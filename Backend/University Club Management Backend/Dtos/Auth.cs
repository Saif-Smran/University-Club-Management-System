using System.Text.Json.Serialization;

namespace University_Club_Management_Backend.Dtos;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ERole
{
    Student,
    ClubAdmin,
    Admin,
    SystemAdmin
}


public class RegisterDto
{
    public required string FullName { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required ERole Role { get; set; } = ERole.Student;
}

public class LoginDto
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public class UserDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public ERole Role { get; set; } = ERole.Student;
}

public class RegisterResponseData
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public ERole Role { get; set; } = ERole.Student;
    public string Status { get; set; } = "Pending";
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
