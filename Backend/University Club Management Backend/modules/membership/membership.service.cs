using Microsoft.EntityFrameworkCore;
using University_Club_Management_Backend.Data;
using University_Club_Management_Backend.Dtos;
using University_Club_Management_Backend.Models;

namespace University_Club_Management_Backend.Modules.MembershipModule;

public interface IMembershipService
{
    Task<ApiResponse<MembershipDto>> ApplyToJoinClubAsync(Guid userId, Guid clubId);
    Task<ApiResponse<MembershipDto>> ApproveMembershipAsync(Guid membershipId, Guid clubAdminUserId, bool isAdmin);
    Task<ApiResponse<MembershipDto>> RejectMembershipAsync(Guid membershipId, Guid clubAdminUserId, bool isAdmin, string? reason);
    Task<ApiResponse<bool>> LeaveClubAsync(Guid userId, Guid clubId);
}

public class MembershipService : IMembershipService
{
    private readonly AppDbContext _dbContext;

    public MembershipService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ApiResponse<MembershipDto>> ApplyToJoinClubAsync(Guid userId, Guid clubId)
    {
        var club = await _dbContext.Clubs.FirstOrDefaultAsync(c => c.Id == clubId && c.IsActive && c.Status == EClubStatus.Approved);
        if (club == null)
        {
            return new ApiResponse<MembershipDto>
            {
                Success = false,
                Message = "Club not found or is not active."
            };
        }

        var existingMembership = await _dbContext.Memberships
            .Include(m => m.User)
            .Include(m => m.Club)
            .FirstOrDefaultAsync(m => m.UserId == userId && m.ClubId == clubId);

        if (existingMembership != null)
        {
            if (existingMembership.Status == "Approved")
            {
                return new ApiResponse<MembershipDto>
                {
                    Success = false,
                    Message = "You are already a member of this club."
                };
            }
            else if (existingMembership.Status == "Pending")
            {
                return new ApiResponse<MembershipDto>
                {
                    Success = false,
                    Message = "Your membership application is currently pending approval."
                };
            }

            // Re-apply if rejected
            existingMembership.Status = "Pending";
            existingMembership.AppliedAt = DateTime.UtcNow;
            existingMembership.ApprovedAt = null;
            existingMembership.RejectionReason = null;
        }
        else
        {
            existingMembership = new Membership
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ClubId = clubId,
                Status = "Pending",
                AppliedAt = DateTime.UtcNow
            };
            _dbContext.Memberships.Add(existingMembership);
        }

        await _dbContext.SaveChangesAsync();

        var user = await _dbContext.Users.FindAsync(userId);
        return new ApiResponse<MembershipDto>
        {
            Success = true,
            Message = "Membership application submitted successfully.",
            Data = MapToDto(existingMembership, user, club)
        };
    }

    public async Task<ApiResponse<MembershipDto>> ApproveMembershipAsync(Guid membershipId, Guid clubAdminUserId, bool isAdmin)
    {
        var membership = await _dbContext.Memberships
            .Include(m => m.User)
            .Include(m => m.Club)
            .FirstOrDefaultAsync(m => m.Id == membershipId);

        if (membership == null)
        {
            return new ApiResponse<MembershipDto>
            {
                Success = false,
                Message = "Membership application not found."
            };
        }

        if (!isAdmin && membership.Club.OwnerId != clubAdminUserId)
        {
            return new ApiResponse<MembershipDto>
            {
                Success = false,
                Message = "You do not have permission to manage memberships for this club."
            };
        }

        membership.Status = "Approved";
        membership.ApprovedAt = DateTime.UtcNow;
        membership.RejectionReason = null;

        await _dbContext.SaveChangesAsync();

        return new ApiResponse<MembershipDto>
        {
            Success = true,
            Message = "Membership approved successfully.",
            Data = MapToDto(membership, membership.User, membership.Club)
        };
    }

    public async Task<ApiResponse<MembershipDto>> RejectMembershipAsync(Guid membershipId, Guid clubAdminUserId, bool isAdmin, string? reason)
    {
        var membership = await _dbContext.Memberships
            .Include(m => m.User)
            .Include(m => m.Club)
            .FirstOrDefaultAsync(m => m.Id == membershipId);

        if (membership == null)
        {
            return new ApiResponse<MembershipDto>
            {
                Success = false,
                Message = "Membership application not found."
            };
        }

        if (!isAdmin && membership.Club.OwnerId != clubAdminUserId)
        {
            return new ApiResponse<MembershipDto>
            {
                Success = false,
                Message = "You do not have permission to manage memberships for this club."
            };
        }

        membership.Status = "Rejected";
        membership.RejectionReason = reason;

        await _dbContext.SaveChangesAsync();

        return new ApiResponse<MembershipDto>
        {
            Success = true,
            Message = "Membership rejected.",
            Data = MapToDto(membership, membership.User, membership.Club)
        };
    }

    public async Task<ApiResponse<bool>> LeaveClubAsync(Guid userId, Guid clubId)
    {
        var membership = await _dbContext.Memberships
            .FirstOrDefaultAsync(m => m.UserId == userId && m.ClubId == clubId);

        if (membership == null)
        {
            return new ApiResponse<bool>
            {
                Success = false,
                Message = "You are not a member of this club.",
                Data = false
            };
        }

        _dbContext.Memberships.Remove(membership);
        await _dbContext.SaveChangesAsync();

        return new ApiResponse<bool>
        {
            Success = true,
            Message = "Left club successfully.",
            Data = true
        };
    }

    private static MembershipDto MapToDto(Membership m, User? user, Club? club)
    {
        return new MembershipDto
        {
            Id = m.Id,
            UserId = m.UserId,
            UserName = user?.FullName ?? m.User?.FullName,
            UserEmail = user?.Email ?? m.User?.Email,
            StudentId = user?.StudentId ?? m.User?.StudentId,
            ClubId = m.ClubId,
            ClubName = club?.Name ?? m.Club?.Name,
            Status = m.Status,
            RejectionReason = m.RejectionReason,
            AppliedAt = m.AppliedAt,
            ApprovedAt = m.ApprovedAt
        };
    }
}
