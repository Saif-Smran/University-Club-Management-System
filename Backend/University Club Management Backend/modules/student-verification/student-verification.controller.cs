using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using University_Club_Management_Backend.Dtos;

namespace University_Club_Management_Backend.Modules.StudentVerificationModule;

[ApiController]
[Route("api/student-verification")]
public class StudentVerificationController : ControllerBase
{
    private readonly IStudentVerificationService _verificationService;

    public StudentVerificationController(IStudentVerificationService verificationService)
    {
        _verificationService = verificationService;
    }

    [Authorize]
    [HttpPost("upload")]
    public async Task<IActionResult> UploadStudentId([FromForm] UploadStudentIdDto dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new ApiResponse<StudentVerificationResponseDto>
            {
                Success = false,
                Message = "Unauthorized user access."
            });
        }

        var response = await _verificationService.UploadStudentIdAsync(userId, dto);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return StatusCode(201, response);
    }

    [Authorize(Roles = "Admin,SystemAdmin")]
    [HttpGet("pending")]
    public async Task<IActionResult> GetPendingVerifications()
    {
        var response = await _verificationService.GetPendingVerificationsAsync();
        return Ok(response);
    }

    [Authorize(Roles = "Admin,SystemAdmin")]
    [HttpPatch("{id}/approve")]
    public async Task<IActionResult> ApproveVerification(Guid id, [FromBody] ApproveStudentVerificationDto? dto)
    {
        var adminIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid.TryParse(adminIdClaim, out var adminId);
        var reviewerId = dto?.ApprovedBy ?? adminId;

        var response = await _verificationService.ApproveVerificationAsync(id, reviewerId);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [Authorize(Roles = "Admin,SystemAdmin")]
    [HttpPatch("{id}/reject")]
    public async Task<IActionResult> RejectVerification(Guid id, [FromBody] RejectStudentVerificationDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto?.RejectionReason))
        {
            return BadRequest(new ApiResponse<StudentVerificationResponseDto>
            {
                Success = false,
                Message = "Rejection reason is required."
            });
        }

        var response = await _verificationService.RejectVerificationAsync(id, dto.RejectionReason);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [Authorize]
    [HttpGet("status")]
    public async Task<IActionResult> GetStatus()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new ApiResponse<StudentVerificationResponseDto>
            {
                Success = false,
                Message = "Unauthorized user access."
            });
        }

        var response = await _verificationService.GetStatusAsync(userId);
        if (!response.Success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }
}
