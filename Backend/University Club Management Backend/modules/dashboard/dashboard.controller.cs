using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using University_Club_Management_Backend.Dtos;

namespace University_Club_Management_Backend.Modules.DashboardModule;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [Authorize(Roles = "Admin,SystemAdmin")]
    [HttpGet("admin")]
    public async Task<IActionResult> GetAdminDashboard()
    {
        var response = await _dashboardService.GetAdminDashboardAsync();
        return Ok(response);
    }

    [Authorize(Roles = "ClubAdmin,Admin,SystemAdmin")]
    [HttpGet("club-admin")]
    public async Task<IActionResult> GetClubAdminDashboard()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new ApiResponse<ClubAdminDashboardDto>
            {
                Success = false,
                Message = "Unauthorized user access."
            });
        }

        var response = await _dashboardService.GetClubAdminDashboardAsync(userId);
        return Ok(response);
    }

    [Authorize]
    [HttpGet("student")]
    public async Task<IActionResult> GetStudentDashboard()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new ApiResponse<StudentDashboardDto>
            {
                Success = false,
                Message = "Unauthorized user access."
            });
        }

        var response = await _dashboardService.GetStudentDashboardAsync(userId);
        if (!response.Success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }
}
