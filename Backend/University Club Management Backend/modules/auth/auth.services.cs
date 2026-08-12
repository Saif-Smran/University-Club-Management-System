using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using University_Club_Management_Backend.Data;
using University_Club_Management_Backend.Dtos;
using University_Club_Management_Backend.Models;

namespace University_Club_Management_Backend.Modules.Auth;

public interface IAuthService
{
    Task<ApiResponse<RegisterResponseData>> RegisterAsync(RegisterDto dto);
    Task<ApiResponse<AuthResponseData>> LoginAsync(LoginDto dto);
}

public class AuthService : IAuthService
{
    private readonly AppDbContext _dbContext;
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext dbContext, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _configuration = configuration;
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

        var roleString = MapERoleToString(dto.Role);
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var user = new User
        {
            Id = Guid.NewGuid(),
            FullName = dto.FullName.Trim(),
            Email = normalizedEmail,
            PasswordHash = passwordHash,
            Role = roleString,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        return new ApiResponse<RegisterResponseData>
        {
            Success = true,
            Message = "Registration successful. Please upload your student ID.",
            Data = new RegisterResponseData
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = MapStringToERole(user.Role),
                Status = "Pending"
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
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);

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
                User = new UserDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    Role = MapStringToERole(user.Role)
                }
            }
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
            new Claim(ClaimTypes.Role, user.Role)
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

    private static string MapERoleToString(ERole role)
    {
        return role switch
        {
            ERole.Admin => "SystemAdmin",
            ERole.SystemAdmin => "SystemAdmin",
            ERole.ClubAdmin => "ClubAdmin",
            _ => "Student"
        };
    }

    private static ERole MapStringToERole(string role)
    {
        return role switch
        {
            "SystemAdmin" => ERole.SystemAdmin,
            "Admin" => ERole.Admin,
            "ClubAdmin" => ERole.ClubAdmin,
            _ => ERole.Student
        };
    }
}

