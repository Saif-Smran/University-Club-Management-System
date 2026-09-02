namespace University_Club_Management_Backend.Dtos;

public class CreateEventDto
{
    public Guid ClubId { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public string? Type { get; set; }
    public decimal? Price { get; set; }
    public int Capacity { get; set; }
    public DateTime Date { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public string? Venue { get; set; }
    public string? Location { get; set; }
    public DateTime? RegistrationDeadline { get; set; }
    public string? BannerUrl { get; set; }
}

public class EventDto
{
    public Guid Id { get; set; }
    public Guid ClubId { get; set; }
    public string? ClubName { get; set; }
    public string? ClubLogoUrl { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? BannerUrl { get; set; }
    public DateTime Date { get; set; }
    public string Venue { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Capacity { get; set; }
    public int RegisteredCount { get; set; }
    public int SeatsRemaining { get; set; }
    public DateTime RegistrationDeadline { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsRegistered { get; set; }
    public Guid? RegistrationId { get; set; }
}

public class EventParticipantDto
{
    public Guid Id { get; set; }
    public Guid EventId { get; set; }
    public string? EventTitle { get; set; }
    public Guid UserId { get; set; }
    public string? UserName { get; set; }
    public string? UserEmail { get; set; }
    public string PaymentStatus { get; set; } = "Pending";
    public DateTime RegisteredAt { get; set; }
    public string? QrCode { get; set; }
}
