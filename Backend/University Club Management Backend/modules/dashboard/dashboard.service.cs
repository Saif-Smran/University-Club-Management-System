using Microsoft.EntityFrameworkCore;
using University_Club_Management_Backend.Data;
using University_Club_Management_Backend.Dtos;
using University_Club_Management_Backend.Models;

namespace University_Club_Management_Backend.Modules.DashboardModule;

public interface IDashboardService
{
    Task<ApiResponse<AdminDashboardDto>> GetAdminDashboardAsync();
    Task<ApiResponse<ClubAdminDashboardDto>> GetClubAdminDashboardAsync(Guid userId);
    Task<ApiResponse<StudentDashboardDto>> GetStudentDashboardAsync(Guid userId);
}

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _dbContext;

    public DashboardService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ApiResponse<AdminDashboardDto>> GetAdminDashboardAsync()
    {
        var totalUsers = await _dbContext.Users.CountAsync();
        var totalStudents = await _dbContext.Users.CountAsync(u => u.Role == ERole.Student);
        var pendingVerifications = await _dbContext.StudentVerifications.CountAsync(sv => sv.Status == EStudentVerificationStatus.Pending);
        var totalClubs = await _dbContext.Clubs.CountAsync();
        var pendingClubs = await _dbContext.Clubs.CountAsync(c => c.Status == EClubStatus.Pending);
        var totalEvents = await _dbContext.Events.CountAsync();
        var totalActiveMemberships = await _dbContext.Memberships.CountAsync(m => m.Status == "Approved");

        var data = new AdminDashboardDto
        {
            TotalUsers = totalUsers,
            TotalStudents = totalStudents,
            PendingStudentVerifications = pendingVerifications,
            TotalClubs = totalClubs,
            PendingClubApplications = pendingClubs,
            TotalEvents = totalEvents,
            TotalActiveMemberships = totalActiveMemberships
        };

        return new ApiResponse<AdminDashboardDto>
        {
            Success = true,
            Data = data
        };
    }

    public async Task<ApiResponse<ClubAdminDashboardDto>> GetClubAdminDashboardAsync(Guid userId)
    {
        var ownedClubs = await _dbContext.Clubs
            .Include(c => c.Memberships)
            .Include(c => c.Events)
            .Where(c => c.OwnerId == userId)
            .ToListAsync();

        var ownedClubIds = ownedClubs.Select(c => c.Id).ToList();

        var totalMembers = await _dbContext.Memberships
            .CountAsync(m => ownedClubIds.Contains(m.ClubId) && m.Status == "Approved");

        var pendingMemberships = await _dbContext.Memberships
            .CountAsync(m => ownedClubIds.Contains(m.ClubId) && m.Status == "Pending");

        var upcomingEvents = await _dbContext.Events
            .CountAsync(e => ownedClubIds.Contains(e.ClubId) && e.StartTime >= DateTime.UtcNow);

        var totalAnnouncements = await _dbContext.Announcements
            .CountAsync(a => ownedClubIds.Contains(a.ClubId));

        var clubDtos = ownedClubs.Select(c => new ClubDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            Category = c.Category,
            OwnerId = c.OwnerId,
            LogoUrl = c.LogoUrl,
            Status = c.Status.ToString(),
            IsActive = c.IsActive,
            MemberCount = c.Memberships?.Count(m => m.Status == "Approved") ?? 0,
            EventCount = c.Events?.Count ?? 0,
            CreatedAt = c.CreatedAt
        }).ToList();

        var data = new ClubAdminDashboardDto
        {
            ManagedClubsCount = ownedClubs.Count,
            TotalClubMembers = totalMembers,
            PendingMembershipApplications = pendingMemberships,
            UpcomingEventsCount = upcomingEvents,
            TotalAnnouncementsCount = totalAnnouncements,
            ManagedClubs = clubDtos
        };

        return new ApiResponse<ClubAdminDashboardDto>
        {
            Success = true,
            Data = data
        };
    }

    public async Task<ApiResponse<StudentDashboardDto>> GetStudentDashboardAsync(Guid userId)
    {
        var user = await _dbContext.Users
            .Include(u => u.StudentVerification)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return new ApiResponse<StudentDashboardDto>
            {
                Success = false,
                Message = "Student user not found."
            };
        }

        var joinedClubMemberships = await _dbContext.Memberships
            .Include(m => m.Club)
                .ThenInclude(c => c.Memberships)
            .Include(m => m.Club)
                .ThenInclude(c => c.Events)
            .Where(m => m.UserId == userId && m.Status == "Approved")
            .ToListAsync();

        var upcomingRegisteredEventsCount = await _dbContext.EventRegistrations
            .Include(er => er.Event)
            .CountAsync(er => er.UserId == userId && er.Event.StartTime >= DateTime.UtcNow);

        var pendingClubAppsCount = await _dbContext.Memberships
            .CountAsync(m => m.UserId == userId && m.Status == "Pending");

        var joinedClubDtos = joinedClubMemberships
            .Where(m => m.Club != null)
            .Select(m => new ClubDto
            {
                Id = m.Club.Id,
                Name = m.Club.Name,
                Description = m.Club.Description,
                Category = m.Club.Category,
                OwnerId = m.Club.OwnerId,
                LogoUrl = m.Club.LogoUrl,
                Status = m.Club.Status.ToString(),
                IsActive = m.Club.IsActive,
                MemberCount = m.Club.Memberships?.Count(mem => mem.Status == "Approved") ?? 0,
                EventCount = m.Club.Events?.Count ?? 0,
                CreatedAt = m.Club.CreatedAt
            })
            .ToList();

        var data = new StudentDashboardDto
        {
            JoinedClubsCount = joinedClubDtos.Count,
            UpcomingRegisteredEventsCount = upcomingRegisteredEventsCount,
            PendingClubApplicationsCount = pendingClubAppsCount,
            IsStudentVerified = user.IsVerified,
            VerificationStatus = user.StudentVerification?.Status.ToString() ?? (user.IsVerified ? "Approved" : "NotSubmitted"),
            JoinedClubs = joinedClubDtos
        };

        return new ApiResponse<StudentDashboardDto>
        {
            Success = true,
            Data = data
        };
    }
}
