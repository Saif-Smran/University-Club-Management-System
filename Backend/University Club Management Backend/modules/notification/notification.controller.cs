using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using University_Club_Management_Backend.Dtos;

namespace University_Club_Management_Backend.Modules.NotificationModule;

[ApiController]
[Route("api/notifications")]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetMyNotifications(
        [FromQuery] bool? isRead,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new ApiResponse<List<NotificationDto>>
            {
                Success = false,
                Message = "Unauthorized user access."
            });
        }

        var response = await _notificationService.GetMyNotificationsAsync(userId, isRead, page, limit);
        return Ok(response);
    }

    [Authorize]
    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new ApiResponse<UnreadCountDto>
            {
                Success = false,
                Message = "Unauthorized user access."
            });
        }

        var response = await _notificationService.GetUnreadCountAsync(userId);
        return Ok(response);
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetNotificationById(Guid id)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new ApiResponse<NotificationDto>
            {
                Success = false,
                Message = "Unauthorized user access."
            });
        }

        var response = await _notificationService.GetNotificationByIdAsync(id, userId);
        if (!response.Success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }

    [Authorize]
    [HttpPatch("{id}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new ApiResponse<NotificationDto>
            {
                Success = false,
                Message = "Unauthorized user access."
            });
        }

        var response = await _notificationService.MarkAsReadAsync(id, userId);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [Authorize]
    [HttpPatch("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
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

        var response = await _notificationService.MarkAllAsReadAsync(userId);
        return Ok(response);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNotification(Guid id)
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

        var response = await _notificationService.DeleteNotificationAsync(id, userId);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [Authorize]
    [HttpPost("broadcast")]
    public async Task<IActionResult> BroadcastNotification([FromBody] BroadcastNotificationDto dto)
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

        var role = User.FindFirstValue(ClaimTypes.Role);
        var isAdmin = role == "Admin" || role == "SystemAdmin";

        var response = await _notificationService.BroadcastNotificationAsync(userId, isAdmin, dto);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }
}
