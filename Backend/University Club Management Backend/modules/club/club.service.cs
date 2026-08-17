using Microsoft.EntityFrameworkCore;
using University_Club_Management_Backend.Data;
using University_Club_Management_Backend.Dtos;
using University_Club_Management_Backend.Models;
using University_Club_Management_Backend.Services;

namespace University_Club_Management_Backend.Modules.ClubModule;

public interface IClubService
{
    Task<ApiResponse<ClubDto>> ApplyForClubAsync(Guid userId, CreateClubApplicationDto dto);
    Task<ApiResponse<List<ClubDto>>> GetPendingClubsAsync();
    Task<ApiResponse<ClubDto>> ApproveClubAsync(Guid clubId, Guid adminId);
    Task<ApiResponse<ClubDto>> RejectClubAsync(Guid clubId, string reason);
    Task<ApiResponse<List<ClubDto>>> GetActiveClubsAsync(string? category, string? search);
    Task<ApiResponse<ClubDto>> GetClubByIdAsync(Guid clubId);
    Task<ApiResponse<ClubDto>> UpdateClubAsync(Guid clubId, Guid currentUserId, bool isAdmin, UpdateClubDto dto);
    Task<ApiResponse<bool>> DeleteClubAsync(Guid clubId, Guid currentUserId, bool isAdmin);
}

public class ClubService : IClubService
{
    private readonly AppDbContext _dbContext;
    private readonly ICloudinaryService _cloudinaryService;

    public ClubService(AppDbContext dbContext, ICloudinaryService cloudinaryService)
    {
        _dbContext = dbContext;
        _cloudinaryService = cloudinaryService;
    }

    public async Task<ApiResponse<ClubDto>> ApplyForClubAsync(Guid userId, CreateClubApplicationDto dto)
    {
        var user = await _dbContext.Users.FindAsync(userId);
        if (user == null)
        {
            return new ApiResponse<ClubDto>
            {
                Success = false,
                Message = "User not found."
            };
        }

        if (string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.Category))
        {
            return new ApiResponse<ClubDto>
            {
                Success = false,
                Message = "Club name and category are required."
            };
        }

        var nameTrimmed = dto.Name.Trim();
        var existingClub = await _dbContext.Clubs.AnyAsync(c => c.Name.ToLower() == nameTrimmed.ToLower());
        if (existingClub)
        {
            return new ApiResponse<ClubDto>
            {
                Success = false,
                Message = "A club with this name already exists."
            };
        }

        string? logoUrl = dto.LogoUrl;
        if (dto.Logo != null && dto.Logo.Length > 0)
        {
            logoUrl = await _cloudinaryService.UploadImageAsync(dto.Logo, "club-logos");
        }

        var club = new Club
        {
            Id = Guid.NewGuid(),
            Name = nameTrimmed,
            Description = dto.Description?.Trim(),
            Category = dto.Category.Trim(),
            OwnerId = userId,
            LogoUrl = logoUrl,
            Status = EClubStatus.Pending,
            IsActive = false,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Clubs.Add(club);
        await _dbContext.SaveChangesAsync();

        return new ApiResponse<ClubDto>
        {
            Success = true,
            Message = "Club creation application submitted successfully. Pending admin approval.",
            Data = MapToClubDto(club, user)
        };
    }

    public async Task<ApiResponse<List<ClubDto>>> GetPendingClubsAsync()
    {
        var pendingClubs = await _dbContext.Clubs
            .Include(c => c.Owner)
            .Include(c => c.Memberships)
            .Include(c => c.Events)
            .Where(c => c.Status == EClubStatus.Pending)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => MapToClubDto(c, c.Owner))
            .ToListAsync();

        return new ApiResponse<List<ClubDto>>
        {
            Success = true,
            Data = pendingClubs
        };
    }

    public async Task<ApiResponse<ClubDto>> ApproveClubAsync(Guid clubId, Guid adminId)
    {
        var club = await _dbContext.Clubs
            .Include(c => c.Owner)
            .Include(c => c.Memberships)
            .Include(c => c.Events)
            .FirstOrDefaultAsync(c => c.Id == clubId);

        if (club == null)
        {
            return new ApiResponse<ClubDto>
            {
                Success = false,
                Message = "Club application not found."
            };
        }

        club.Status = EClubStatus.Approved;
        club.IsActive = true;
        club.ApprovedAt = DateTime.UtcNow;
        club.ApprovedBy = adminId;
        club.RejectionReason = null;
        club.UpdatedAt = DateTime.UtcNow;

        // Upgrade applicant role to ClubAdmin if currently Student
        if (club.Owner != null && club.Owner.Role == ERole.Student)
        {
            club.Owner.Role = ERole.ClubAdmin;
            club.Owner.UpdatedAt = DateTime.UtcNow;
        }

        // Add owner as a member with ClubAdmin status
        var existingOwnerMembership = await _dbContext.Memberships
            .FirstOrDefaultAsync(m => m.ClubId == club.Id && m.UserId == club.OwnerId);

        if (existingOwnerMembership == null)
        {
            var ownerMembership = new Membership
            {
                Id = Guid.NewGuid(),
                UserId = club.OwnerId,
                ClubId = club.Id,
                Status = "Approved",
                AppliedAt = DateTime.UtcNow,
                ApprovedAt = DateTime.UtcNow
            };
            _dbContext.Memberships.Add(ownerMembership);
        }

        await _dbContext.SaveChangesAsync();

        return new ApiResponse<ClubDto>
        {
            Success = true,
            Message = "Club creation approved and activated successfully.",
            Data = MapToClubDto(club, club.Owner)
        };
    }

    public async Task<ApiResponse<ClubDto>> RejectClubAsync(Guid clubId, string reason)
    {
        var club = await _dbContext.Clubs
            .Include(c => c.Owner)
            .Include(c => c.Memberships)
            .Include(c => c.Events)
            .FirstOrDefaultAsync(c => c.Id == clubId);

        if (club == null)
        {
            return new ApiResponse<ClubDto>
            {
                Success = false,
                Message = "Club application not found."
            };
        }

        club.Status = EClubStatus.Rejected;
        club.IsActive = false;
        club.RejectionReason = reason;
        club.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return new ApiResponse<ClubDto>
        {
            Success = true,
            Message = "Club application rejected.",
            Data = MapToClubDto(club, club.Owner)
        };
    }

    public async Task<ApiResponse<List<ClubDto>>> GetActiveClubsAsync(string? category, string? search)
    {
        var query = _dbContext.Clubs
            .Include(c => c.Owner)
            .Include(c => c.Memberships)
            .Include(c => c.Events)
            .Where(c => c.IsActive && c.Status == EClubStatus.Approved)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(c => c.Category.ToLower() == category.Trim().ToLower());
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.Trim().ToLower();
            query = query.Where(c =>
                c.Name.ToLower().Contains(searchLower) ||
                (c.Description != null && c.Description.ToLower().Contains(searchLower)));
        }

        var clubs = await query
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => MapToClubDto(c, c.Owner))
            .ToListAsync();

        return new ApiResponse<List<ClubDto>>
        {
            Success = true,
            Data = clubs
        };
    }

    public async Task<ApiResponse<ClubDto>> GetClubByIdAsync(Guid clubId)
    {
        var club = await _dbContext.Clubs
            .Include(c => c.Owner)
            .Include(c => c.Memberships)
            .Include(c => c.Events)
            .FirstOrDefaultAsync(c => c.Id == clubId);

        if (club == null)
        {
            return new ApiResponse<ClubDto>
            {
                Success = false,
                Message = "Club not found."
            };
        }

        return new ApiResponse<ClubDto>
        {
            Success = true,
            Data = MapToClubDto(club, club.Owner)
        };
    }

    public async Task<ApiResponse<ClubDto>> UpdateClubAsync(Guid clubId, Guid currentUserId, bool isAdmin, UpdateClubDto dto)
    {
        var club = await _dbContext.Clubs
            .Include(c => c.Owner)
            .Include(c => c.Memberships)
            .Include(c => c.Events)
            .FirstOrDefaultAsync(c => c.Id == clubId);

        if (club == null)
        {
            return new ApiResponse<ClubDto>
            {
                Success = false,
                Message = "Club not found."
            };
        }

        if (!isAdmin && club.OwnerId != currentUserId)
        {
            return new ApiResponse<ClubDto>
            {
                Success = false,
                Message = "You do not have permission to modify this club."
            };
        }

        if (!string.IsNullOrWhiteSpace(dto.Name))
        {
            club.Name = dto.Name.Trim();
        }

        if (dto.Description != null)
        {
            club.Description = dto.Description.Trim();
        }

        if (!string.IsNullOrWhiteSpace(dto.Category))
        {
            club.Category = dto.Category.Trim();
        }

        if (dto.Logo != null && dto.Logo.Length > 0)
        {
            var uploadedLogoUrl = await _cloudinaryService.UploadImageAsync(dto.Logo, "club-logos");
            if (!string.IsNullOrWhiteSpace(uploadedLogoUrl))
            {
                club.LogoUrl = uploadedLogoUrl;
            }
        }
        else if (!string.IsNullOrWhiteSpace(dto.LogoUrl))
        {
            club.LogoUrl = dto.LogoUrl;
        }

        club.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();

        return new ApiResponse<ClubDto>
        {
            Success = true,
            Message = "Club updated successfully.",
            Data = MapToClubDto(club, club.Owner)
        };
    }

    public async Task<ApiResponse<bool>> DeleteClubAsync(Guid clubId, Guid currentUserId, bool isAdmin)
    {
        var club = await _dbContext.Clubs.FindAsync(clubId);
        if (club == null)
        {
            return new ApiResponse<bool>
            {
                Success = false,
                Message = "Club not found.",
                Data = false
            };
        }

        if (!isAdmin && club.OwnerId != currentUserId)
        {
            return new ApiResponse<bool>
            {
                Success = false,
                Message = "You do not have permission to delete this club.",
                Data = false
            };
        }

        _dbContext.Clubs.Remove(club);
        await _dbContext.SaveChangesAsync();

        return new ApiResponse<bool>
        {
            Success = true,
            Message = "Club deleted successfully.",
            Data = true
        };
    }

    private static ClubDto MapToClubDto(Club c, User? owner)
    {
        return new ClubDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            Category = c.Category,
            OwnerId = c.OwnerId,
            OwnerName = owner?.FullName ?? c.Owner?.FullName,
            OwnerEmail = owner?.Email ?? c.Owner?.Email,
            LogoUrl = c.LogoUrl,
            Status = c.Status.ToString(),
            IsActive = c.IsActive,
            RejectionReason = c.RejectionReason,
            ApprovedAt = c.ApprovedAt,
            MemberCount = c.Memberships?.Count(m => m.Status == "Approved") ?? 0,
            EventCount = c.Events?.Count ?? 0,
            CreatedAt = c.CreatedAt
        };
    }
}
