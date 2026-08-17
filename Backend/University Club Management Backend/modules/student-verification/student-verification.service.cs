using Microsoft.EntityFrameworkCore;
using University_Club_Management_Backend.Data;
using University_Club_Management_Backend.Dtos;
using University_Club_Management_Backend.Models;
using University_Club_Management_Backend.Services;

namespace University_Club_Management_Backend.Modules.StudentVerificationModule;

public interface IStudentVerificationService
{
    Task<ApiResponse<StudentVerificationResponseDto>> UploadStudentIdAsync(Guid userId, UploadStudentIdDto dto);
    Task<ApiResponse<List<PendingStudentVerificationDto>>> GetPendingVerificationsAsync();
    Task<ApiResponse<StudentVerificationResponseDto>> ApproveVerificationAsync(Guid verificationId, Guid adminId);
    Task<ApiResponse<StudentVerificationResponseDto>> RejectVerificationAsync(Guid verificationId, string reason);
    Task<ApiResponse<StudentVerificationResponseDto>> GetStatusAsync(Guid userId);
}

public class StudentVerificationService : IStudentVerificationService
{
    private readonly AppDbContext _dbContext;
    private readonly ICloudinaryService _cloudinaryService;

    public StudentVerificationService(AppDbContext dbContext, ICloudinaryService cloudinaryService)
    {
        _dbContext = dbContext;
        _cloudinaryService = cloudinaryService;
    }

    public async Task<ApiResponse<StudentVerificationResponseDto>> UploadStudentIdAsync(Guid userId, UploadStudentIdDto dto)
    {
        var user = await _dbContext.Users.FindAsync(userId);
        if (user == null)
        {
            return new ApiResponse<StudentVerificationResponseDto>
            {
                Success = false,
                Message = "User not found."
            };
        }

        if (dto.Document == null || dto.Document.Length == 0)
        {
            return new ApiResponse<StudentVerificationResponseDto>
            {
                Success = false,
                Message = "Please select a valid image of your student ID card."
            };
        }

        var imageUrl = await _cloudinaryService.UploadImageAsync(dto.Document, "student-verifications");
        if (string.IsNullOrWhiteSpace(imageUrl))
        {
            return new ApiResponse<StudentVerificationResponseDto>
            {
                Success = false,
                Message = "Failed to upload student ID card image to Cloudinary."
            };
        }

        if (!string.IsNullOrWhiteSpace(dto.StudentId))
        {
            user.StudentId = dto.StudentId;
        }

        user.IdCardImageUrl = imageUrl;

        var existingVerification = await _dbContext.StudentVerifications
            .FirstOrDefaultAsync(sv => sv.UserId == userId);

        if (existingVerification != null)
        {
            existingVerification.DocumentPath = imageUrl;
            existingVerification.Status = EStudentVerificationStatus.Pending;
            existingVerification.StudentId = user.StudentId;
            existingVerification.RejectionReason = null;
            existingVerification.ApprovedAt = null;
            existingVerification.ApprovedBy = null;
            existingVerification.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            existingVerification = new StudentVerification
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                StudentId = user.StudentId,
                DocumentPath = imageUrl,
                Status = EStudentVerificationStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };
            _dbContext.StudentVerifications.Add(existingVerification);
        }

        user.IsVerified = false;
        await _dbContext.SaveChangesAsync();

        return new ApiResponse<StudentVerificationResponseDto>
        {
            Success = true,
            Message = "Student ID card uploaded successfully. Pending admin approval.",
            Data = MapToResponseDto(existingVerification)
        };
    }

    public async Task<ApiResponse<List<PendingStudentVerificationDto>>> GetPendingVerificationsAsync()
    {
        var pendingList = await _dbContext.StudentVerifications
            .Include(sv => sv.User)
            .Where(sv => sv.Status == EStudentVerificationStatus.Pending)
            .OrderByDescending(sv => sv.CreatedAt)
            .Select(sv => new PendingStudentVerificationDto
            {
                Id = sv.Id,
                UserId = sv.UserId,
                StudentName = sv.User.FullName,
                Email = sv.User.Email,
                StudentId = sv.StudentId ?? sv.User.StudentId,
                DocumentPath = sv.DocumentPath,
                IdCardImageUrl = sv.DocumentPath != null && sv.DocumentPath != "" ? sv.DocumentPath : (sv.User.IdCardImageUrl ?? ""),
                Status = sv.Status.ToString(),
                CreatedAt = sv.CreatedAt
            })
            .ToListAsync();

        return new ApiResponse<List<PendingStudentVerificationDto>>
        {
            Success = true,
            Data = pendingList
        };
    }

    public async Task<ApiResponse<StudentVerificationResponseDto>> ApproveVerificationAsync(Guid verificationId, Guid adminId)
    {
        var verification = await _dbContext.StudentVerifications
            .Include(sv => sv.User)
            .FirstOrDefaultAsync(sv => sv.Id == verificationId);

        if (verification == null)
        {
            return new ApiResponse<StudentVerificationResponseDto>
            {
                Success = false,
                Message = "Student verification request not found."
            };
        }

        verification.Status = EStudentVerificationStatus.Approved;
        verification.ApprovedAt = DateTime.UtcNow;
        verification.ApprovedBy = adminId;
        verification.RejectionReason = null;
        verification.UpdatedAt = DateTime.UtcNow;

        if (verification.User != null)
        {
            verification.User.IsVerified = true;
        }

        await _dbContext.SaveChangesAsync();

        return new ApiResponse<StudentVerificationResponseDto>
        {
            Success = true,
            Message = "Student verification approved successfully.",
            Data = MapToResponseDto(verification)
        };
    }

    public async Task<ApiResponse<StudentVerificationResponseDto>> RejectVerificationAsync(Guid verificationId, string reason)
    {
        var verification = await _dbContext.StudentVerifications
            .Include(sv => sv.User)
            .FirstOrDefaultAsync(sv => sv.Id == verificationId);

        if (verification == null)
        {
            return new ApiResponse<StudentVerificationResponseDto>
            {
                Success = false,
                Message = "Student verification request not found."
            };
        }

        verification.Status = EStudentVerificationStatus.Rejected;
        verification.RejectionReason = reason;
        verification.UpdatedAt = DateTime.UtcNow;

        if (verification.User != null)
        {
            verification.User.IsVerified = false;
        }

        await _dbContext.SaveChangesAsync();

        return new ApiResponse<StudentVerificationResponseDto>
        {
            Success = true,
            Message = "Student verification rejected.",
            Data = MapToResponseDto(verification)
        };
    }

    public async Task<ApiResponse<StudentVerificationResponseDto>> GetStatusAsync(Guid userId)
    {
        var verification = await _dbContext.StudentVerifications
            .FirstOrDefaultAsync(sv => sv.UserId == userId);

        if (verification == null)
        {
            return new ApiResponse<StudentVerificationResponseDto>
            {
                Success = false,
                Message = "No student verification submission found for this user."
            };
        }

        return new ApiResponse<StudentVerificationResponseDto>
        {
            Success = true,
            Data = MapToResponseDto(verification)
        };
    }

    private static StudentVerificationResponseDto MapToResponseDto(StudentVerification sv)
    {
        return new StudentVerificationResponseDto
        {
            Id = sv.Id,
            UserId = sv.UserId,
            StudentId = sv.StudentId,
            DocumentPath = sv.DocumentPath,
            IdCardImageUrl = sv.DocumentPath,
            Status = sv.Status.ToString(),
            ApprovedAt = sv.ApprovedAt,
            RejectionReason = sv.RejectionReason,
            CreatedAt = sv.CreatedAt
        };
    }
}
