using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using University_Club_Management_Backend.Data;
using University_Club_Management_Backend.Dtos;
using University_Club_Management_Backend.Models;
using University_Club_Management_Backend.Services;

namespace University_Club_Management_Backend.Modules.Auth;

public interface IAuthService
{
    Task<ApiResponse<RegisterResponseData>> RegisterAsync(RegisterDto dto);
    Task<ApiResponse<RegisterResponseData>> RegisterStudentAsync(RegisterStudentDto dto);
    Task<ApiResponse<RegisterResponseData>> RegisterClubAdminAsync(RegisterClubAdminDto dto);
    Task<ApiResponse<AuthResponseData>> LoginAsync(LoginDto dto);
    Task<ApiResponse<AuthResponseData>> RefreshTokenAsync(RefreshTokenDto dto);
    Task<ApiResponse<UserDto>> GetCurrentUserAsync(Guid userId);
    Task<ApiResponse<bool>> LogoutAsync(Guid userId);
}

public class AuthService : IAuthService
{
    private readonly AppDbContext _dbContext;
    private readonly IConfiguration _configuration;
    private readonly ICloudinaryService _cloudinaryService;

    public AuthService(AppDbContext dbContext, IConfiguration configuration, ICloudinaryService cloudinaryService)
    {
        _dbContext = dbContext;
        _configuration = configuration;
        _cloudinaryService = cloudinaryService;
    }

    public async Task<ApiResponse<RegisterResponseData>> RegisterStudentAsync(RegisterStudentDto dto)
    {
        var registerDto = new RegisterDto
        {
            FullName = dto.FullName,
            Email = dto.Email,
            Password = dto.Password,
            Role = ERole.Student,
            StudentId = dto.StudentId,
            IdCardImage = dto.IdCardImage,
            IdCardImageUrl = dto.IdCardImageUrl
        };

        return await RegisterAsync(registerDto);
    }

    public async Task<ApiResponse<RegisterResponseData>> RegisterClubAdminAsync(RegisterClubAdminDto dto)
    {
        var registerDto = new RegisterDto
        {
            FullName = dto.FullName,
            Email = dto.Email,
            Password = dto.Password,
            Role = ERole.ClubAdmin
        };

        return await RegisterAsync(registerDto);
    }

    public async Task<ApiResponse<RegisterResponseData>> RegisterAsync(RegisterDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password) || string.IsNullOrWhiteSpace(dto.FullName))
        {
            return new ApiResponse<RegisterResponseData>
            {
                Success = false,
                Message = "Full name, email, and password are required."
            };
        }

        var normalizedEmail = dto.Email.Trim().ToLower();
        var existingUser = await _dbContext.Users.AnyAsync(u => u.Email.ToLower() == normalizedEmail);
        if (existingUser)
        {
            return new ApiResponse<RegisterResponseData>
            {
                Success = false,
                Message = "Email is already registered"
            };
        }

        var userRole = dto.Role ?? ERole.Student;
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        string? uploadedCardUrl = dto.IdCardImageUrl;
        if (userRole == ERole.Student && dto.IdCardImage != null && dto.IdCardImage.Length > 0)
        {
            uploadedCardUrl = await _cloudinaryService.UploadImageAsync(dto.IdCardImage, "student-verifications");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            FullName = dto.FullName.Trim(),
            Email = normalizedEmail,
            PasswordHash = passwordHash,
            Role = userRole,
            StudentId = dto.StudentId,
            IdCardImageUrl = uploadedCardUrl,
            IsVerified = (userRole != ERole.Student), // Non-students auto-verified, students need admin approval
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Users.Add(user);

        if (userRole == ERole.Student)
        {
            var verification = new StudentVerification
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                StudentId = dto.StudentId,
                DocumentPath = uploadedCardUrl ?? string.Empty,
                Status = EStudentVerificationStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.StudentVerifications.Add(verification);
        }

        await _dbContext.SaveChangesAsync();

        return new ApiResponse<RegisterResponseData>
        {
            Success = true,
            Message = userRole == ERole.Student
                ? "Registration successful. Please await admin verification of your student ID photo."
                : "Registration successful.",
            Data = new RegisterResponseData
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                StudentId = user.StudentId,
                Status = user.IsVerified ? "Approved" : "Pending",
                IdCardImageUrl = user.IdCardImageUrl
            }
        };
    }

    public async Task<ApiResponse<AuthResponseData>> LoginAsync(LoginDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
        {
            return new ApiResponse<AuthResponseData>
            {
                Success = false,
                Message = "Email and password are required."
            };
        }

        var normalizedEmail = dto.Email.Trim().ToLower();
        var user = await _dbContext.Users
            .Include(u => u.StudentVerification)
            .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            return new ApiResponse<AuthResponseData>
            {
                Success = false,
                Message = "Invalid email or password"
            };
        }

        var accessToken = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        user.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return new ApiResponse<AuthResponseData>
        {
            Success = true,
            Message = "Login successful",
            Data = new AuthResponseData
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresIn = 900,
                User = MapUserToDto(user)
            }
        };
    }

    public async Task<ApiResponse<AuthResponseData>> RefreshTokenAsync(RefreshTokenDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.RefreshToken))
        {
            return new ApiResponse<AuthResponseData>
            {
                Success = false,
                Message = "Refresh token is required."
            };
        }

        var user = await _dbContext.Users
            .Include(u => u.StudentVerification)
            .FirstOrDefaultAsync(u => u.RefreshToken == dto.RefreshToken);

        if (user == null || user.RefreshTokenExpiry == null || user.RefreshTokenExpiry < DateTime.UtcNow)
        {
            return new ApiResponse<AuthResponseData>
            {
                Success = false,
                Message = "Invalid or expired refresh token."
            };
        }

        var newAccessToken = GenerateJwtToken(user);
        var newRefreshToken = GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        user.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return new ApiResponse<AuthResponseData>
        {
            Success = true,
            Message = "Token refreshed successfully",
            Data = new AuthResponseData
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                ExpiresIn = 900,
                User = MapUserToDto(user)
            }
        };
    }

    public async Task<ApiResponse<UserDto>> GetCurrentUserAsync(Guid userId)
    {
        var user = await _dbContext.Users
            .Include(u => u.StudentVerification)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return new ApiResponse<UserDto>
            {
                Success = false,
                Message = "User not found"
            };
        }

        return new ApiResponse<UserDto>
        {
            Success = true,
            Data = MapUserToDto(user)
        };
    }

    public async Task<ApiResponse<bool>> LogoutAsync(Guid userId)
    {
        var user = await _dbContext.Users.FindAsync(userId);
        if (user != null)
        {
            user.RefreshToken = null;
            user.RefreshTokenExpiry = null;
            user.UpdatedAt = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();
        }

        return new ApiResponse<bool>
        {
            Success = true,
            Message = "Logged out successfully",
            Data = true
        };
    }

    private string GenerateJwtToken(User user)
    {
        var secretKey = _configuration["JWT_SECRET_KEY"]
                        ?? Environment.GetEnvironmentVariable("JWT_SECRET_KEY")
                        ?? "YourSuperSecretKeyWithAtLeast32BytesLength!";

        var issuer = _configuration["JWT_ISSUER"]
                     ?? Environment.GetEnvironmentVariable("JWT_ISSUER")
                     ?? "UCMS_Backend";

        var audience = _configuration["JWT_AUDIENCE"]
                      ?? Environment.GetEnvironmentVariable("JWT_AUDIENCE")
                      ?? "UCMS_Frontend";

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("IsVerified", user.IsVerified.ToString().ToLower())
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(15),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    private static UserDto MapUserToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role,
            StudentId = user.StudentId,
            IsVerified = user.IsVerified,
            VerificationStatus = user.StudentVerification?.Status.ToString() ?? (user.IsVerified ? "Approved" : "NotSubmitted"),
            IdCardImageUrl = user.IdCardImageUrl ?? user.StudentVerification?.DocumentPath
        };
    }
}
