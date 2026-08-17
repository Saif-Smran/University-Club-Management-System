using University_Club_Management_Backend.Models;

namespace University_Club_Management_Backend.Dtos;

public class UpdateUserProfileDto
{
    public string? FullName { get; set; }
    public string? StudentId { get; set; }
}

public class AdminUpdateUserRoleDto
{
    public required ERole Role { get; set; }
}

public class UserDetailDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public ERole Role { get; set; } = ERole.Student;
    public string? StudentId { get; set; }
    public bool IsVerified { get; set; }
    public string? VerificationStatus { get; set; }
    public string? IdCardImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}
