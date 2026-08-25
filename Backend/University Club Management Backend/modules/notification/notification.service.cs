using Microsoft.EntityFrameworkCore;
using University_Club_Management_Backend.Data;
using University_Club_Management_Backend.Dtos;
using University_Club_Management_Backend.Models;

namespace University_Club_Management_Backend.Modules.NotificationModule;

public interface INotificationService
{
    Task<ApiResponse<List<NotificationDto>>> GetMyNotificationsAsync(Guid userId, bool? isRead, int page, int limit);
    Task<ApiResponse<UnreadCountDto>> GetUnreadCountAsync(Guid userId);
    Task<ApiResponse<NotificationDto>> GetNotificationByIdAsync(Guid id, Guid userId);
    Task<ApiResponse<NotificationDto>> MarkAsReadAsync(Guid id, Guid userId);
    Task<ApiResponse<bool>> MarkAllAsReadAsync(Guid userId);
    Task<ApiResponse<bool>> DeleteNotificationAsync(Guid id, Guid userId);
    Task<ApiResponse<bool>> BroadcastNotificationAsync(Guid clubAdminUserId, bool isAdmin, BroadcastNotificationDto dto);
}

public class NotificationService : INotificationService
{
    private readonly AppDbContext _dbContext;

    public NotificationService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ApiResponse<List<NotificationDto>>> GetMyNotificationsAsync(Guid userId, bool? isRead, int page, int limit)
    {
        page = page < 1 ? 1 : page;
        limit = limit < 1 ? 20 : limit;

        var query = _dbContext.Notifications
            .Include(n => n.Club)
            .Where(n => n.UserId == userId)
            .AsQueryable();

        if (isRead.HasValue)
        {
            query = query.Where(n => n.IsRead == isRead.Value);
        }

        var notifications = await query
            .OrderByDescending(n => n.CreatedAt)
            .Skip((page - 1) * limit)
            .Take(limit)
            .Select(n => MapToDto(n))
            .ToListAsync();

        return new ApiResponse<List<NotificationDto>>
        {
            Success = true,
            Data = notifications
        };
    }

    public async Task<ApiResponse<UnreadCountDto>> GetUnreadCountAsync(Guid userId)
    {
        var count = await _dbContext.Notifications
            .CountAsync(n => n.UserId == userId && !n.IsRead);

        return new ApiResponse<UnreadCountDto>
        {
            Success = true,
            Data = new UnreadCountDto { UnreadCount = count }
        };
    }

    public async Task<ApiResponse<NotificationDto>> GetNotificationByIdAsync(Guid id, Guid userId)
    {
        var notification = await _dbContext.Notifications
            .Include(n => n.Club)
            .FirstOrDefaultAsync(n => n.Id == id);

        if (notification == null)
        {
            return new ApiResponse<NotificationDto>
            {
                Success = false,
                Message = "Notification not found."
            };
        }

        if (notification.UserId != userId)
        {
            return new ApiResponse<NotificationDto>
            {
                Success = false,
                Message = "You do not have permission to view this notification."
            };
        }

        return new ApiResponse<NotificationDto>
        {
            Success = true,
            Data = MapToDto(notification)
        };
    }

    public async Task<ApiResponse<NotificationDto>> MarkAsReadAsync(Guid id, Guid userId)
    {
        var notification = await _dbContext.Notifications
            .Include(n => n.Club)
            .FirstOrDefaultAsync(n => n.Id == id);

        if (notification == null)
        {
            return new ApiResponse<NotificationDto>
            {
                Success = false,
                Message = "Notification not found."
            };
        }

        if (notification.UserId != userId)
        {
            return new ApiResponse<NotificationDto>
            {
                Success = false,
                Message = "You do not have permission to update this notification."
            };
        }

        notification.IsRead = true;
        await _dbContext.SaveChangesAsync();

        return new ApiResponse<NotificationDto>
        {
            Success = true,
            Message = "Notification marked as read.",
            Data = MapToDto(notification)
        };
    }

    public async Task<ApiResponse<bool>> MarkAllAsReadAsync(Guid userId)
    {
        var unreadNotifications = await _dbContext.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ToListAsync();

        foreach (var n in unreadNotifications)
        {
            n.IsRead = true;
        }

        await _dbContext.SaveChangesAsync();

        return new ApiResponse<bool>
        {
            Success = true,
            Message = "All notifications marked as read.",
            Data = true
        };
    }

    public async Task<ApiResponse<bool>> DeleteNotificationAsync(Guid id, Guid userId)
    {
        var notification = await _dbContext.Notifications
            .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

        if (notification == null)
        {
            return new ApiResponse<bool>
            {
                Success = false,
                Message = "Notification not found or access denied.",
                Data = false
            };
        }

        _dbContext.Notifications.Remove(notification);
        await _dbContext.SaveChangesAsync();

        return new ApiResponse<bool>
        {
            Success = true,
            Message = "Notification deleted successfully.",
            Data = true
        };
    }

    public async Task<ApiResponse<bool>> BroadcastNotificationAsync(Guid clubAdminUserId, bool isAdmin, BroadcastNotificationDto dto)
    {
        var club = await _dbContext.Clubs.FindAsync(dto.ClubId);
        if (club == null)
        {
            return new ApiResponse<bool>
            {
                Success = false,
                Message = "Club not found.",
                Data = false
            };
        }

        if (!isAdmin && club.OwnerId != clubAdminUserId)
        {
            return new ApiResponse<bool>
            {
                Success = false,
                Message = "You do not have permission to broadcast notifications for this club.",
                Data = false
            };
        }

        if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.Message))
        {
            return new ApiResponse<bool>
            {
                Success = false,
                Message = "Notification title and message are required.",
                Data = false
            };
        }

        // Get all approved members of the club (including owner)
        var memberUserIds = await _dbContext.Memberships
            .Where(m => m.ClubId == dto.ClubId && m.Status == "Approved")
            .Select(m => m.UserId)
            .Distinct()
            .ToListAsync();

        if (!memberUserIds.Contains(club.OwnerId))
        {
            memberUserIds.Add(club.OwnerId);
        }

        var newNotifications = memberUserIds.Select(uid => new Notification
        {
            Id = Guid.NewGuid(),
            UserId = uid,
            ClubId = dto.ClubId,
            Title = dto.Title.Trim(),
            Message = dto.Message.Trim(),
            Type = string.IsNullOrWhiteSpace(dto.Type) ? "Announcement" : dto.Type.Trim(),
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        }).ToList();

        _dbContext.Notifications.AddRange(newNotifications);
        await _dbContext.SaveChangesAsync();

        return new ApiResponse<bool>
        {
            Success = true,
            Message = $"Notification broadcasted to {newNotifications.Count} club members successfully.",
            Data = true
        };
    }

    private static NotificationDto MapToDto(Notification n)
    {
        return new NotificationDto
        {
            Id = n.Id,
            UserId = n.UserId,
            ClubId = n.ClubId,
            ClubName = n.Club?.Name,
            Title = n.Title,
            Message = n.Message,
            Type = n.Type,
            IsRead = n.IsRead,
            CreatedAt = n.CreatedAt
        };
    }
}
