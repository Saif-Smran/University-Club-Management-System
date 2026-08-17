using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using University_Club_Management_Backend.Dtos;

namespace University_Club_Management_Backend.Modules.Auth;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromForm] RegisterDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) && !Request.HasFormContentType)
        {
            var jsonDto = await TryReadJsonBodyAsync<RegisterDto>();
            if (jsonDto != null)
            {
                dto = jsonDto;
            }
        }

        var response = await _authService.RegisterAsync(dto);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return StatusCode(201, response);
    }

    [HttpPost("register-student")]
    public async Task<IActionResult> RegisterStudent([FromForm] RegisterStudentDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) && !Request.HasFormContentType)
        {
            var jsonDto = await TryReadJsonBodyAsync<RegisterStudentDto>();
            if (jsonDto != null)
            {
                dto = jsonDto;
            }
        }

        var response = await _authService.RegisterStudentAsync(dto);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return StatusCode(201, response);
    }

    [HttpPost("register-club-admin")]
    public async Task<IActionResult> RegisterClubAdmin([FromBody] RegisterClubAdminDto? dto)
    {
        dto ??= await TryReadJsonBodyAsync<RegisterClubAdminDto>();
        if (dto == null)
        {
            return BadRequest(new ApiResponse<RegisterResponseData>
            {
                Success = false,
                Message = "Full name, email, and password are required."
            });
        }

        var response = await _authService.RegisterClubAdminAsync(dto);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return StatusCode(201, response);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto? dto)
    {
        if (dto == null || string.IsNullOrWhiteSpace(dto.Email))
        {
            dto = await TryReadJsonBodyAsync<LoginDto>();
        }

        if (dto == null)
        {
            return BadRequest(new ApiResponse<AuthResponseData>
            {
                Success = false,
                Message = "Email and password are required."
            });
        }

        var response = await _authService.LoginAsync(dto);
        if (!response.Success)
        {
            return Unauthorized(response);
        }

        return Ok(response);
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto dto)
    {
        var response = await _authService.RefreshTokenAsync(dto);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new ApiResponse<UserDto>
            {
                Success = false,
                Message = "Invalid user token claims."
            });
        }

        var response = await _authService.GetCurrentUserAsync(userId);
        if (!response.Success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (Guid.TryParse(userIdClaim, out var userId))
        {
            await _authService.LogoutAsync(userId);
        }

        return Ok(new ApiResponse<bool>
        {
            Success = true,
            Message = "Logged out successfully",
            Data = true
        });
    }

    private async Task<T?> TryReadJsonBodyAsync<T>() where T : class
    {
        try
        {
            if (Request.Body.CanSeek)
            {
                Request.Body.Position = 0;
            }

            using var reader = new StreamReader(Request.Body, leaveOpen: true);
            var body = await reader.ReadToEndAsync();
            if (!string.IsNullOrWhiteSpace(body))
            {
                var options = new System.Text.Json.JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };
                options.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
                return System.Text.Json.JsonSerializer.Deserialize<T>(body, options);
            }
        }
        catch
        {
            // Ignore parse errors
        }

        return null;
    }
}
