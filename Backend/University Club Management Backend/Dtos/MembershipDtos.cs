namespace University_Club_Management_Backend.Dtos;

public class MembershipDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string? UserName { get; set; }
    public string? UserEmail { get; set; }
    public string? StudentId { get; set; }
    public Guid ClubId { get; set; }
    public string? ClubName { get; set; }
    public string Status { get; set; } = null!;
    public string? RejectionReason { get; set; }
    public DateTime AppliedAt { get; set; }
    public DateTime? ApprovedAt { get; set; }
}

public class RejectMembershipDto
{
    public string? Reason { get; set; }
}
