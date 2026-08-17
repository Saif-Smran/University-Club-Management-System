using System.Text.Json.Serialization;
using University_Club_Management_Backend.Models;

namespace University_Club_Management_Backend.Dtos;


public class RegisterStudentDto
{
    public required string FullName { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string StudentId { get; set; }
    public IFormFile? IdCardImage { get; set; }
    public string? IdCardImageUrl { get; set; }
}

public class RegisterClubAdminDto
{
    public required string FullName { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public ERole Role { get; set; } = ERole.ClubAdmin;
}

public class RegisterDto
{
    public required string FullName { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public ERole? Role { get; set; }
    public string? StudentId { get; set; }
    public IFormFile? IdCardImage { get; set; }
    public string? IdCardImageUrl { get; set; }
}

public class LoginDto
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public class RefreshTokenDto
{
    public required string RefreshToken { get; set; }
}

public class UserDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public ERole Role { get; set; } = ERole.Student;
    public string? StudentId { get; set; }
    public bool IsVerified { get; set; }
    public string? VerificationStatus { get; set; }
    public string? IdCardImageUrl { get; set; }
}

public class RegisterResponseData
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public ERole Role { get; set; } = ERole.Student;
    public string? StudentId { get; set; }
    public string Status { get; set; } = "Pending";
    public string? IdCardImageUrl { get; set; }
}

public class AuthResponseData
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public int ExpiresIn { get; set; } = 900;
    public UserDto User { get; set; } = null!;
}

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
}
