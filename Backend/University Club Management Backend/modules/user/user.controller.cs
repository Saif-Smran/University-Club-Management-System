using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using University_Club_Management_Backend.Dtos;
using University_Club_Management_Backend.Models;

namespace University_Club_Management_Backend.Modules.UserModule;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new ApiResponse<UserDetailDto>
            {
                Success = false,
                Message = "Unauthorized user access."
            });
        }

        var response = await _userService.GetProfileAsync(userId);
        if (!response.Success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }

    [Authorize]
    [HttpPatch("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserProfileDto dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new ApiResponse<UserDetailDto>
            {
                Success = false,
                Message = "Unauthorized user access."
            });
        }

        var response = await _userService.UpdateProfileAsync(userId, dto);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [Authorize(Roles = "Admin,SystemAdmin")]
    [HttpGet]
    public async Task<IActionResult> GetAllUsers(
        [FromQuery] ERole? role,
        [FromQuery] bool? isVerified,
        [FromQuery] string? search)
    {
        var response = await _userService.GetAllUsersAsync(role, isVerified, search);
        return Ok(response);
    }

    [Authorize(Roles = "Admin,SystemAdmin")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(Guid id)
    {
        var response = await _userService.GetUserByIdAsync(id);
        if (!response.Success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }

    [Authorize(Roles = "Admin,SystemAdmin")]
    [HttpPatch("{id}/role")]
    public async Task<IActionResult> UpdateUserRole(Guid id, [FromBody] AdminUpdateUserRoleDto dto)
    {
        var response = await _userService.UpdateUserRoleAsync(id, dto.Role);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [Authorize(Roles = "Admin,SystemAdmin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var response = await _userService.DeleteUserAsync(id);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }
}
