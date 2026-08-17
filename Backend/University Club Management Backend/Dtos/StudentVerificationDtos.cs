namespace University_Club_Management_Backend.Dtos;

public class UploadStudentIdDto
{
    public required IFormFile Document { get; set; }
    public string? StudentId { get; set; }
}

public class PendingStudentVerificationDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? StudentId { get; set; }
    public string DocumentPath { get; set; } = string.Empty;
    public string IdCardImageUrl { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
    public DateTime CreatedAt { get; set; }
}

public class ApproveStudentVerificationDto
{
    public Guid? ApprovedBy { get; set; }
}

public class RejectStudentVerificationDto
{
    public required string RejectionReason { get; set; }
}

public class StudentVerificationResponseDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string? StudentId { get; set; }
    public string DocumentPath { get; set; } = string.Empty;
    public string IdCardImageUrl { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
    public DateTime? ApprovedAt { get; set; }
    public string? RejectionReason { get; set; }
    public DateTime CreatedAt { get; set; }
}
