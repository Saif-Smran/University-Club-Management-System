using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using University_Club_Management_Backend.Dtos;

namespace University_Club_Management_Backend.Modules.ClubModule;

[ApiController]
[Route("api/clubs")]
public class ClubController : ControllerBase
{
    private readonly IClubService _clubService;

    public ClubController(IClubService clubService)
    {
        _clubService = clubService;
    }

    [Authorize]
    [HttpPost("apply")]
    public async Task<IActionResult> ApplyForClub([FromForm] CreateClubApplicationDto dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new ApiResponse<ClubDto>
            {
                Success = false,
                Message = "Unauthorized user access."
            });
        }

        // Support JSON input if form content type is missing
        if (string.IsNullOrWhiteSpace(dto.Name) && !Request.HasFormContentType)
        {
            var jsonDto = await TryReadJsonBodyAsync<CreateClubApplicationDto>();
            if (jsonDto != null)
            {
                dto = jsonDto;
            }
        }

        var response = await _clubService.ApplyForClubAsync(userId, dto);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return StatusCode(201, response);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateClub([FromForm] CreateClubApplicationDto dto)
    {
        return await ApplyForClub(dto);
    }

    [Authorize(Roles = "Admin,SystemAdmin")]
    [HttpGet("pending")]
    public async Task<IActionResult> GetPendingClubs()
    {
        var response = await _clubService.GetPendingClubsAsync();
        return Ok(response);
    }

    [Authorize(Roles = "Admin,SystemAdmin")]
    [HttpPatch("{id}/approve")]
    public async Task<IActionResult> ApproveClub(Guid id)
    {
        var adminIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid.TryParse(adminIdClaim, out var adminId);

        var response = await _clubService.ApproveClubAsync(id, adminId);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [Authorize(Roles = "Admin,SystemAdmin")]
    [HttpPatch("{id}/reject")]
    public async Task<IActionResult> RejectClub(Guid id, [FromBody] RejectClubDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto?.RejectionReason))
        {
            return BadRequest(new ApiResponse<ClubDto>
            {
                Success = false,
                Message = "Rejection reason is required."
            });
        }

        var response = await _clubService.RejectClubAsync(id, dto.RejectionReason);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpGet]
    public async Task<IActionResult> GetActiveClubs([FromQuery] string? category, [FromQuery] string? search)
    {
        var response = await _clubService.GetActiveClubsAsync(category, search);
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetClubById(Guid id)
    {
        var response = await _clubService.GetClubByIdAsync(id);
        if (!response.Success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }

    [Authorize]
    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateClub(Guid id, [FromForm] UpdateClubDto dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new ApiResponse<ClubDto>
            {
                Success = false,
                Message = "Unauthorized user access."
            });
        }

        var userRole = User.FindFirstValue(ClaimTypes.Role);
        var isAdmin = userRole == "Admin" || userRole == "SystemAdmin";

        if (string.IsNullOrWhiteSpace(dto.Name) && string.IsNullOrWhiteSpace(dto.Description) && !Request.HasFormContentType)
        {
            var jsonDto = await TryReadJsonBodyAsync<UpdateClubDto>();
            if (jsonDto != null)
            {
                dto = jsonDto;
            }
        }

        var response = await _clubService.UpdateClubAsync(id, userId, isAdmin, dto);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteClub(Guid id)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new ApiResponse<bool>
            {
                Success = false,
                Message = "Unauthorized user access."
            });
        }

        var userRole = User.FindFirstValue(ClaimTypes.Role);
        var isAdmin = userRole == "Admin" || userRole == "SystemAdmin";

        var response = await _clubService.DeleteClubAsync(id, userId, isAdmin);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
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
