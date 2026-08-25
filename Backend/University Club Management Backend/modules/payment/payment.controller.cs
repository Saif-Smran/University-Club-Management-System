using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using University_Club_Management_Backend.Dtos;

namespace University_Club_Management_Backend.Modules.PaymentModule;

[ApiController]
[Route("api/payments")]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [Authorize]
    [HttpPost("create")]
    public async Task<IActionResult> CreateCheckoutSession([FromBody] CreateCheckoutSessionDto dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new ApiResponse<CheckoutSessionResponseData>
            {
                Success = false,
                Message = "Unauthorized user access."
            });
        }

        var response = await _paymentService.CreateCheckoutSessionAsync(userId, dto);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpPost("confirm")]
    public async Task<IActionResult> ConfirmPayment()
    {
        using var reader = new StreamReader(Request.Body);
        var rawBody = await reader.ReadToEndAsync();
        var stripeSignature = Request.Headers["Stripe-Signature"].ToString();

        var response = await _paymentService.ConfirmPaymentAsync(rawBody, stripeSignature);
        return Ok(response);
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetMyPayments()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new ApiResponse<List<PaymentDto>>
            {
                Success = false,
                Message = "Unauthorized user access."
            });
        }

        var response = await _paymentService.GetMyPaymentsAsync(userId);
        return Ok(response);
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPaymentById(Guid id)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new ApiResponse<PaymentDto>
            {
                Success = false,
                Message = "Unauthorized user access."
            });
        }

        var role = User.FindFirstValue(ClaimTypes.Role);
        var isAdmin = role == "Admin" || role == "SystemAdmin";

        var response = await _paymentService.GetPaymentByIdAsync(id, userId, isAdmin);
        if (!response.Success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }
}
