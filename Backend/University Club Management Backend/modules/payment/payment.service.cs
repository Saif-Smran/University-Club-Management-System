using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Stripe;
using Stripe.Checkout;
using University_Club_Management_Backend.Data;
using University_Club_Management_Backend.Dtos;
using University_Club_Management_Backend.Models;

namespace University_Club_Management_Backend.Modules.PaymentModule;

public interface IPaymentService
{
    Task<ApiResponse<CheckoutSessionResponseData>> CreateCheckoutSessionAsync(Guid userId, CreateCheckoutSessionDto dto);
    Task<ApiResponse<bool>> ConfirmPaymentAsync(string rawBody, string? stripeSignature);
    Task<ApiResponse<List<PaymentDto>>> GetMyPaymentsAsync(Guid userId);
    Task<ApiResponse<PaymentDto>> GetPaymentByIdAsync(Guid paymentId, Guid userId, bool isAdmin);
}

public class PaymentService : IPaymentService
{
    private readonly AppDbContext _dbContext;
    private readonly string _stripeSecretKey;
    private readonly string _webhookSecret;

    public PaymentService(AppDbContext dbContext, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _stripeSecretKey = configuration["STRIPE_SECRET_KEY"]
                           ?? Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY")
                           ?? string.Empty;
        _webhookSecret = configuration["STRIPE_WEBHOOK_SECRET"]
                         ?? Environment.GetEnvironmentVariable("STRIPE_WEBHOOK_SECRET")
                         ?? string.Empty;

        StripeConfiguration.ApiKey = _stripeSecretKey;
    }

    public async Task<ApiResponse<CheckoutSessionResponseData>> CreateCheckoutSessionAsync(Guid userId, CreateCheckoutSessionDto dto)
    {
        var user = await _dbContext.Users.FindAsync(userId);
        if (user == null)
        {
            return new ApiResponse<CheckoutSessionResponseData>
            {
                Success = false,
                Message = "User not found."
            };
        }

        if (dto.Amount <= 0)
        {
            return new ApiResponse<CheckoutSessionResponseData>
            {
                Success = false,
                Message = "Amount must be greater than 0."
            };
        }

        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            EventId = dto.EventId,
            Amount = dto.Amount,
            Currency = string.IsNullOrWhiteSpace(dto.Currency) ? "usd" : dto.Currency.ToLower(),
            Status = PaymentStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Payments.Add(payment);
        await _dbContext.SaveChangesAsync();

        var successUrl = dto.SuccessUrl ?? "http://localhost:3000/payment/success";
        var cancelUrl = dto.CancelUrl ?? "http://localhost:3000/payment/cancel";

        // Determine unit amount in smallest currency unit (cents for USD)
        // If amount is small (e.g. 5.00), multiply by 100. If 500, check if already in cents or convert.
        long unitAmountInCents = dto.Amount < 50 ? (long)(dto.Amount * 100) : (long)dto.Amount;

        try
        {
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            UnitAmount = unitAmountInCents,
                            Currency = payment.Currency,
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = "Club / Event Registration Payment",
                                Description = $"Payment reference #{payment.Id.ToString()[..8]}"
                            }
                        },
                        Quantity = 1
                    }
                },
                Mode = "payment",
                SuccessUrl = successUrl,
                CancelUrl = cancelUrl,
                Metadata = new Dictionary<string, string>
                {
                    { "paymentId", payment.Id.ToString() },
                    { "userId", userId.ToString() },
                    { "registrationId", dto.RegistrationId?.ToString() ?? "" }
                }
            };

            var service = new SessionService();
            Session session = await service.CreateAsync(options);

            payment.SessionId = session.Id;
            await _dbContext.SaveChangesAsync();

            return new ApiResponse<CheckoutSessionResponseData>
            {
                Success = true,
                Message = "Stripe Checkout session created successfully.",
                Data = new CheckoutSessionResponseData
                {
                    SessionId = session.Id,
                    CheckoutUrl = session.Url
                }
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<CheckoutSessionResponseData>
            {
                Success = false,
                Message = $"Failed to create Stripe Checkout session: {ex.Message}"
            };
        }
    }

    public async Task<ApiResponse<bool>> ConfirmPaymentAsync(string rawBody, string? stripeSignature)
    {
        try
        {
            Payment? payment = null;
            string? paymentIdStr = null;
            string? sessionIdStr = null;

            // 1. Try parsing as Stripe Webhook Event if signature is provided
            if (!string.IsNullOrWhiteSpace(stripeSignature) && !string.IsNullOrWhiteSpace(_webhookSecret))
            {
                try
                {
                    var stripeEvent = EventUtility.ConstructEvent(rawBody, stripeSignature, _webhookSecret);
                    if (stripeEvent.Type == EventTypes.CheckoutSessionCompleted)
                    {
                        var session = stripeEvent.Data.Object as Session;
                        sessionIdStr = session?.Id;
                        if (session?.Metadata != null && session.Metadata.TryGetValue("paymentId", out var pid))
                        {
                            paymentIdStr = pid;
                        }
                    }
                }
                catch
                {
                    // Fall back to JSON parsing below
                }
            }

            // 2. Parse JSON body directly if webhook construction wasn't used or fell through
            if (string.IsNullOrWhiteSpace(paymentIdStr) && string.IsNullOrWhiteSpace(sessionIdStr))
            {
                using var doc = System.Text.Json.JsonDocument.Parse(rawBody);
                var root = doc.RootElement;

                // Check direct object or metadata
                if (root.TryGetProperty("data", out var dataElement) &&
                    dataElement.TryGetProperty("object", out var objectElement))
                {
                    if (objectElement.TryGetProperty("id", out var sessId))
                    {
                        sessionIdStr = sessId.GetString();
                    }

                    if (objectElement.TryGetProperty("metadata", out var metaElement) &&
                        metaElement.TryGetProperty("paymentId", out var pIdVal))
                    {
                        paymentIdStr = pIdVal.GetString();
                    }
                }
                else if (root.TryGetProperty("paymentId", out var directPid))
                {
                    paymentIdStr = directPid.GetString();
                }
                else if (root.TryGetProperty("sessionId", out var directSid))
                {
                    sessionIdStr = directSid.GetString();
                }
            }

            // Find payment by paymentId or sessionId
            if (Guid.TryParse(paymentIdStr, out var paymentId))
            {
                payment = await _dbContext.Payments.FindAsync(paymentId);
            }

            if (payment == null && !string.IsNullOrWhiteSpace(sessionIdStr))
            {
                payment = await _dbContext.Payments.FirstOrDefaultAsync(p => p.SessionId == sessionIdStr);
            }

            if (payment == null)
            {
                // If payment record wasn't found in DB, return received true for Stripe webhooks
                return new ApiResponse<bool>
                {
                    Success = true,
                    Message = "Event received, no matching pending payment record found.",
                    Data = true
                };
            }

            // Update payment status
            payment.Status = PaymentStatus.Paid;
            payment.PaymentMethod = "Stripe";
            payment.PaidAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();

            return new ApiResponse<bool>
            {
                Success = true,
                Message = "Payment confirmed successfully.",
                Data = true
            };
        }
        catch (Exception ex)
        {
            return new ApiResponse<bool>
            {
                Success = false,
                Message = $"Error processing payment confirmation: {ex.Message}",
                Data = false
            };
        }
    }

    public async Task<ApiResponse<List<PaymentDto>>> GetMyPaymentsAsync(Guid userId)
    {
        var payments = await _dbContext.Payments
            .Include(p => p.User)
            .Include(p => p.Event)
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => MapToPaymentDto(p))
            .ToListAsync();

        return new ApiResponse<List<PaymentDto>>
        {
            Success = true,
            Data = payments
        };
    }

    public async Task<ApiResponse<PaymentDto>> GetPaymentByIdAsync(Guid paymentId, Guid userId, bool isAdmin)
    {
        var payment = await _dbContext.Payments
            .Include(p => p.User)
            .Include(p => p.Event)
            .FirstOrDefaultAsync(p => p.Id == paymentId);

        if (payment == null)
        {
            return new ApiResponse<PaymentDto>
            {
                Success = false,
                Message = "Payment record not found."
            };
        }

        if (!isAdmin && payment.UserId != userId)
        {
            return new ApiResponse<PaymentDto>
            {
                Success = false,
                Message = "You do not have permission to view this payment."
            };
        }

        return new ApiResponse<PaymentDto>
        {
            Success = true,
            Data = MapToPaymentDto(payment)
        };
    }

    private static PaymentDto MapToPaymentDto(Payment p)
    {
        return new PaymentDto
        {
            Id = p.Id,
            UserId = p.UserId,
            UserName = p.User?.FullName,
            EventId = p.EventId,
            EventTitle = p.Event?.Title,
            Amount = p.Amount,
            Currency = p.Currency,
            Status = p.Status.ToString(),
            SessionId = p.SessionId,
            PaymentMethod = p.PaymentMethod,
            CreatedAt = p.CreatedAt,
            PaidAt = p.PaidAt
        };
    }
}
