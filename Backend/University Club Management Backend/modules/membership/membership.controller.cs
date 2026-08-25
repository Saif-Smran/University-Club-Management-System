using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using University_Club_Management_Backend.Dtos;

namespace University_Club_Management_Backend.Modules.MembershipModule;

[ApiController]
public class MembershipController : ControllerBase
{
    private readonly IMembershipService _membershipService;

    public MembershipController(IMembershipService membershipService)
    {
        _membershipService = membershipService;
    }

    [Authorize]
    [HttpPost("api/clubs/{clubId}/apply")]
    public async Task<IActionResult> ApplyToJoinClub(Guid clubId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new ApiResponse<MembershipDto>
            {
                Success = false,
                Message = "Unauthorized user access."
            });
        }

        var response = await _membershipService.ApplyToJoinClubAsync(userId, clubId);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [Authorize]
    [HttpPatch("api/memberships/{id}/approve")]
    public async Task<IActionResult> ApproveMembership(Guid id)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new ApiResponse<MembershipDto>
            {
                Success = false,
                Message = "Unauthorized user access."
            });
        }

        var role = User.FindFirstValue(ClaimTypes.Role);
        var isAdmin = role == "Admin" || role == "SystemAdmin";

        var response = await _membershipService.ApproveMembershipAsync(id, userId, isAdmin);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [Authorize]
    [HttpPatch("api/memberships/{id}/reject")]
    public async Task<IActionResult> RejectMembership(Guid id, [FromBody] RejectMembershipDto? dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new ApiResponse<MembershipDto>
            {
                Success = false,
                Message = "Unauthorized user access."
            });
        }

        var role = User.FindFirstValue(ClaimTypes.Role);
        var isAdmin = role == "Admin" || role == "SystemAdmin";

        var response = await _membershipService.RejectMembershipAsync(id, userId, isAdmin, dto?.Reason);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [Authorize]
    [HttpPost("api/clubs/{clubId}/leave")]
    public async Task<IActionResult> LeaveClub(Guid clubId)
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

        var response = await _membershipService.LeaveClubAsync(userId, clubId);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }
}
