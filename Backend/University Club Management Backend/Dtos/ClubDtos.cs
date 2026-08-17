namespace University_Club_Management_Backend.Dtos;

public class CreateClubApplicationDto
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public required string Category { get; set; }
    public IFormFile? Logo { get; set; }
    public string? LogoUrl { get; set; }
}

public class UpdateClubDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Category { get; set; }
    public IFormFile? Logo { get; set; }
    public string? LogoUrl { get; set; }
}

public class RejectClubDto
{
    public required string RejectionReason { get; set; }
}

public class ClubDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty;
    public Guid OwnerId { get; set; }
    public string? OwnerName { get; set; }
    public string? OwnerEmail { get; set; }
    public string? LogoUrl { get; set; }
    public string Status { get; set; } = "Pending";
    public bool IsActive { get; set; }
    public string? RejectionReason { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public int MemberCount { get; set; }
    public int EventCount { get; set; }
    public DateTime CreatedAt { get; set; }
}
