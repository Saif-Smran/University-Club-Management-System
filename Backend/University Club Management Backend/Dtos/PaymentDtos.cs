namespace University_Club_Management_Backend.Dtos;

public class CreateCheckoutSessionDto
{
    public Guid? RegistrationId { get; set; }
    public Guid? EventId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "usd";
    public string? SuccessUrl { get; set; }
    public string? CancelUrl { get; set; }
}

public class CheckoutSessionResponseData
{
    public string SessionId { get; set; } = null!;
    public string CheckoutUrl { get; set; } = null!;
}

public class PaymentDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string? UserName { get; set; }
    public Guid? EventId { get; set; }
    public string? EventTitle { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "usd";
    public string Status { get; set; } = null!;
    public string? SessionId { get; set; }
    public string? PaymentMethod { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? PaidAt { get; set; }
}
