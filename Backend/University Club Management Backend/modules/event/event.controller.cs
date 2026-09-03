using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using University_Club_Management_Backend.Dtos;

namespace University_Club_Management_Backend.Modules.EventModule;

[ApiController]
[Route("api/events")]
public class EventController : ControllerBase
{
    private readonly IEventService _eventService;

    public EventController(IEventService eventService)
    {
        _eventService = eventService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetEvents([FromQuery] string? search, [FromQuery] Guid? clubId)
    {
        var userId = GetUserId();
        return Ok(await _eventService.GetEventsAsync(userId, search, clubId));
    }

    [HttpGet("managed")]
    [Authorize(Roles = "ClubAdmin,Admin,SystemAdmin")]
    public async Task<IActionResult> GetManagedEvents([FromQuery] string? search)
    {
        var userId = GetRequiredUserId();
        if (!userId.HasValue) return Unauthorized();
        var role = User.FindFirstValue(ClaimTypes.Role);
        var isAdmin = role is "Admin" or "SystemAdmin";
        return Ok(await _eventService.GetManagedEventsAsync(userId.Value, isAdmin, search));
    }

    [HttpGet("{eventId:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetEvent(Guid eventId)
    {
        var response = await _eventService.GetEventByIdAsync(eventId, GetUserId());
        return response.Success ? Ok(response) : NotFound(response);
    }

    [HttpPost]
    [Authorize(Roles = "ClubAdmin,Admin,SystemAdmin")]
    public async Task<IActionResult> CreateEvent([FromBody] CreateEventDto dto)
    {
        var userId = GetRequiredUserId();
        if (!userId.HasValue) return Unauthorized();
        var response = await _eventService.CreateEventAsync(userId.Value, dto);
        return response.Success ? StatusCode(201, response) : BadRequest(response);
    }

    [HttpDelete("{eventId:guid}")]
    [Authorize(Roles = "ClubAdmin,Admin,SystemAdmin")]
    public async Task<IActionResult> DeleteEvent(Guid eventId)
    {
        var userId = GetRequiredUserId();
        if (!userId.HasValue) return Unauthorized();
        var role = User.FindFirstValue(ClaimTypes.Role);
        var response = await _eventService.DeleteEventAsync(eventId, userId.Value, role is "Admin" or "SystemAdmin");
        return response.Success ? Ok(response) : BadRequest(response);
    }

    [HttpPost("{eventId:guid}/register")]
    [Authorize]
    public async Task<IActionResult> Register(Guid eventId)
    {
        var userId = GetRequiredUserId();
        if (!userId.HasValue) return Unauthorized();
        var response = await _eventService.RegisterAsync(eventId, userId.Value);
        return response.Success ? StatusCode(201, response) : BadRequest(response);
    }

    [HttpDelete("{eventId:guid}/register")]
    [Authorize]
    public async Task<IActionResult> RemoveRegistration(Guid eventId)
    {
        var userId = GetRequiredUserId();
        if (!userId.HasValue) return Unauthorized();
        var response = await _eventService.RemoveRegistrationAsync(eventId, userId.Value);
        return response.Success ? Ok(response) : BadRequest(response);
    }

    [HttpGet("{eventId:guid}/participants")]
    [Authorize(Roles = "ClubAdmin,Admin,SystemAdmin")]
    public async Task<IActionResult> GetParticipants(Guid eventId)
    {
        var userId = GetRequiredUserId();
        if (!userId.HasValue) return Unauthorized();
        var role = User.FindFirstValue(ClaimTypes.Role);
        var response = await _eventService.GetParticipantsAsync(eventId, userId.Value, role is "Admin" or "SystemAdmin");
        return response.Success ? Ok(response) : BadRequest(response);
    }

    private Guid? GetUserId() => Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId) ? userId : null;
    private Guid? GetRequiredUserId() => GetUserId();
}
