using System.Text.Json;
using System.Text.Json.Serialization;
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
    public async Task<IActionResult> Register([FromBody] RegisterDto? dto)
    {
        dto ??= await TryReadRegisterDtoAsync();

        if (dto == null)
        {
            return BadRequest(new ApiResponse<RegisterResponseData>
            {
                Success = false,
                Message = "Invalid or missing request body. Please provide a valid JSON payload."
            });
        }

        var response = await _authService.RegisterAsync(dto);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return StatusCode(201, response);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto? dto)
    {
        dto ??= await TryReadLoginDtoAsync();

        if (dto == null)
        {
            return BadRequest(new ApiResponse<AuthResponseData>
            {
                Success = false,
                Message = "Invalid or missing request body. Please provide a valid JSON payload."
            });
        }

        var response = await _authService.LoginAsync(dto);
        if (!response.Success)
        {
            return Unauthorized(response);
        }

        return Ok(response);
    }

    private async Task<RegisterDto?> TryReadRegisterDtoAsync()
    {
        try
        {
            if (Request.HasFormContentType)
            {
                var form = await Request.ReadFormAsync();
                var fullName = form["fullName"].ToString();
                var email = form["email"].ToString();
                var password = form["password"].ToString();
                var roleStr = form["role"].ToString();

                Enum.TryParse<ERole>(roleStr, true, out var roleEnum);

                return new RegisterDto
                {
                    FullName = fullName,
                    Email = email,
                    Password = password,
                    Role = roleEnum
                };
            }

            if (Request.Body.CanSeek)
            {
                Request.Body.Position = 0;
            }

            using var reader = new StreamReader(Request.Body, leaveOpen: true);
            var body = await reader.ReadToEndAsync();
            if (!string.IsNullOrWhiteSpace(body))
            {
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };
                options.Converters.Add(new JsonStringEnumConverter());
                return JsonSerializer.Deserialize<RegisterDto>(body, options);
            }
        }
        catch
        {
            // Ignore parse errors
        }

        return null;
    }

    private async Task<LoginDto?> TryReadLoginDtoAsync()
    {
        try
        {
            if (Request.HasFormContentType)
            {
                var form = await Request.ReadFormAsync();
                var email = form["email"].ToString();
                var password = form["password"].ToString();

                return new LoginDto
                {
                    Email = email,
                    Password = password
                };
            }

            if (Request.Body.CanSeek)
            {
                Request.Body.Position = 0;
            }

            using var reader = new StreamReader(Request.Body, leaveOpen: true);
            var body = await reader.ReadToEndAsync();
            if (!string.IsNullOrWhiteSpace(body))
            {
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };
                return JsonSerializer.Deserialize<LoginDto>(body, options);
            }
        }
        catch
        {
            // Ignore parse errors
        }

        return null;
    }
}

