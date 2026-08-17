using Microsoft.EntityFrameworkCore;
using University_Club_Management_Backend.Data;
using University_Club_Management_Backend.Dtos;
using University_Club_Management_Backend.Models;

namespace University_Club_Management_Backend.Modules.UserModule;

public interface IUserService
{
    Task<ApiResponse<UserDetailDto>> GetProfileAsync(Guid userId);
    Task<ApiResponse<UserDetailDto>> UpdateProfileAsync(Guid userId, UpdateUserProfileDto dto);
    Task<ApiResponse<List<UserDetailDto>>> GetAllUsersAsync(ERole? role, bool? isVerified, string? search);
    Task<ApiResponse<UserDetailDto>> GetUserByIdAsync(Guid id);
    Task<ApiResponse<UserDetailDto>> UpdateUserRoleAsync(Guid targetUserId, ERole newRole);
    Task<ApiResponse<bool>> DeleteUserAsync(Guid targetUserId);
}

public class UserService : IUserService
{
    private readonly AppDbContext _dbContext;

    public UserService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ApiResponse<UserDetailDto>> GetProfileAsync(Guid userId)
    {
        var user = await _dbContext.Users
            .Include(u => u.StudentVerification)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return new ApiResponse<UserDetailDto>
            {
                Success = false,
                Message = "User profile not found."
            };
        }

        return new ApiResponse<UserDetailDto>
        {
            Success = true,
            Data = MapToDetailDto(user)
        };
    }

    public async Task<ApiResponse<UserDetailDto>> UpdateProfileAsync(Guid userId, UpdateUserProfileDto dto)
    {
        var user = await _dbContext.Users
            .Include(u => u.StudentVerification)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return new ApiResponse<UserDetailDto>
            {
                Success = false,
                Message = "User profile not found."
            };
        }

        if (!string.IsNullOrWhiteSpace(dto.FullName))
        {
            user.FullName = dto.FullName.Trim();
        }

        if (!string.IsNullOrWhiteSpace(dto.StudentId))
        {
            user.StudentId = dto.StudentId.Trim();
        }

        user.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();

        return new ApiResponse<UserDetailDto>
        {
            Success = true,
            Message = "Profile updated successfully.",
            Data = MapToDetailDto(user)
        };
    }

    public async Task<ApiResponse<List<UserDetailDto>>> GetAllUsersAsync(ERole? role, bool? isVerified, string? search)
    {
        var query = _dbContext.Users
            .Include(u => u.StudentVerification)
            .AsQueryable();

        if (role.HasValue)
        {
            query = query.Where(u => u.Role == role.Value);
        }

        if (isVerified.HasValue)
        {
            query = query.Where(u => u.IsVerified == isVerified.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.Trim().ToLower();
            query = query.Where(u =>
                u.FullName.ToLower().Contains(searchLower) ||
                u.Email.ToLower().Contains(searchLower) ||
                (u.StudentId != null && u.StudentId.ToLower().Contains(searchLower)));
        }

        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => MapToDetailDto(u))
            .ToListAsync();

        return new ApiResponse<List<UserDetailDto>>
        {
            Success = true,
            Data = users
        };
    }

    public async Task<ApiResponse<UserDetailDto>> GetUserByIdAsync(Guid id)
    {
        var user = await _dbContext.Users
            .Include(u => u.StudentVerification)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            return new ApiResponse<UserDetailDto>
            {
                Success = false,
                Message = "User not found."
            };
        }

        return new ApiResponse<UserDetailDto>
        {
            Success = true,
            Data = MapToDetailDto(user)
        };
    }

    public async Task<ApiResponse<UserDetailDto>> UpdateUserRoleAsync(Guid targetUserId, ERole newRole)
    {
        var user = await _dbContext.Users
            .Include(u => u.StudentVerification)
            .FirstOrDefaultAsync(u => u.Id == targetUserId);

        if (user == null)
        {
            return new ApiResponse<UserDetailDto>
            {
                Success = false,
                Message = "User not found."
            };
        }

        user.Role = newRole;
        user.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();

        return new ApiResponse<UserDetailDto>
        {
            Success = true,
            Message = "User role updated successfully.",
            Data = MapToDetailDto(user)
        };
    }

    public async Task<ApiResponse<bool>> DeleteUserAsync(Guid targetUserId)
    {
        var user = await _dbContext.Users.FindAsync(targetUserId);
        if (user == null)
        {
            return new ApiResponse<bool>
            {
                Success = false,
                Message = "User not found.",
                Data = false
            };
        }

        _dbContext.Users.Remove(user);
        await _dbContext.SaveChangesAsync();

        return new ApiResponse<bool>
        {
            Success = true,
            Message = "User deleted successfully.",
            Data = true
        };
    }

    private static UserDetailDto MapToDetailDto(User user)
    {
        return new UserDetailDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role,
            StudentId = user.StudentId,
            IsVerified = user.IsVerified,
            VerificationStatus = user.StudentVerification?.Status.ToString() ?? (user.IsVerified ? "Approved" : "NotSubmitted"),
            IdCardImageUrl = user.IdCardImageUrl ?? user.StudentVerification?.DocumentPath,
            CreatedAt = user.CreatedAt
        };
    }
}
