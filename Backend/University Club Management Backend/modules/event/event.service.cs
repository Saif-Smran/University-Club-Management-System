using Microsoft.EntityFrameworkCore;
using University_Club_Management_Backend.Data;
using University_Club_Management_Backend.Dtos;
using University_Club_Management_Backend.Models;

namespace University_Club_Management_Backend.Modules.EventModule;

public interface IEventService
{
    Task<ApiResponse<List<EventDto>>> GetEventsAsync(Guid? userId, string? search, Guid? clubId);
    Task<ApiResponse<EventDto>> GetEventByIdAsync(Guid eventId, Guid? userId);
    Task<ApiResponse<EventDto>> CreateEventAsync(Guid userId, CreateEventDto dto);
    Task<ApiResponse<bool>> DeleteEventAsync(Guid eventId, Guid userId, bool isAdmin);
    Task<ApiResponse<EventDto>> RegisterAsync(Guid eventId, Guid userId);
    Task<ApiResponse<bool>> RemoveRegistrationAsync(Guid eventId, Guid userId);
    Task<ApiResponse<List<EventParticipantDto>>> GetParticipantsAsync(Guid eventId, Guid userId, bool isAdmin);
}

public class EventService : IEventService
{
    private readonly AppDbContext _dbContext;

    public EventService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ApiResponse<List<EventDto>>> GetEventsAsync(Guid? userId, string? search, Guid? clubId)
    {
        var query = _dbContext.Events
            .Include(e => e.Club)
            .Include(e => e.Registrations)
            .AsQueryable();

        if (clubId.HasValue) query = query.Where(e => e.ClubId == clubId.Value);
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(e => e.Title.ToLower().Contains(term) || (e.Location ?? "").ToLower().Contains(term));
        }

        var events = await query
            .Where(e => e.Club.Status == EClubStatus.Approved && e.Club.IsActive)
            .OrderBy(e => e.StartTime)
            .ToListAsync();

        return new ApiResponse<List<EventDto>> { Success = true, Data = events.Select(e => Map(e, userId)).ToList() };
    }

    public async Task<ApiResponse<EventDto>> GetEventByIdAsync(Guid eventId, Guid? userId)
    {
        var eventItem = await _dbContext.Events
            .Include(e => e.Club)
            .Include(e => e.Registrations)
            .FirstOrDefaultAsync(e => e.Id == eventId);

        return eventItem == null
            ? new ApiResponse<EventDto> { Success = false, Message = "Event not found." }
            : new ApiResponse<EventDto> { Success = true, Data = Map(eventItem, userId) };
    }

    public async Task<ApiResponse<EventDto>> CreateEventAsync(Guid userId, CreateEventDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title) || dto.ClubId == Guid.Empty)
            return new ApiResponse<EventDto> { Success = false, Message = "Club and event title are required." };
        if (dto.Capacity <= 0) return new ApiResponse<EventDto> { Success = false, Message = "Capacity must be greater than 0." };

        var club = await _dbContext.Clubs.FirstOrDefaultAsync(c => c.Id == dto.ClubId && c.OwnerId == userId);
        var role = await _dbContext.Users.Where(u => u.Id == userId).Select(u => u.Role).FirstOrDefaultAsync();
        if (club == null && role != ERole.Admin)
            return new ApiResponse<EventDto> { Success = false, Message = "You do not own this club." };
        if (club == null) club = await _dbContext.Clubs.FindAsync(dto.ClubId);
        if (club == null) return new ApiResponse<EventDto> { Success = false, Message = "Club not found." };

        var start = dto.StartTime ?? dto.Date;
        var end = dto.EndTime ?? start.AddHours(2);
        if (start <= DateTime.UtcNow) return new ApiResponse<EventDto> { Success = false, Message = "Event date must be in the future." };
        if (end <= start) return new ApiResponse<EventDto> { Success = false, Message = "Event end time must be after the start time." };

        var eventItem = new Event
        {
            Id = Guid.NewGuid(), ClubId = dto.ClubId, Title = dto.Title.Trim(), Description = dto.Description?.Trim(),
            Type = string.IsNullOrWhiteSpace(dto.Type) ? (dto.Price.GetValueOrDefault() > 0 ? "Paid" : "Free") : dto.Type.Trim(),
            Price = Math.Max(0, dto.Price ?? 0), Capacity = dto.Capacity, RegisteredCount = 0,
            StartTime = start, EndTime = end, Location = (dto.Location ?? dto.Venue)?.Trim(), CreatedAt = DateTime.UtcNow
        };
        _dbContext.Events.Add(eventItem);
        await _dbContext.SaveChangesAsync();
        eventItem.Club = club;
        return new ApiResponse<EventDto> { Success = true, Message = "Event created successfully.", Data = Map(eventItem, userId) };
    }

    public async Task<ApiResponse<bool>> DeleteEventAsync(Guid eventId, Guid userId, bool isAdmin)
    {
        var eventItem = await _dbContext.Events.Include(e => e.Club).FirstOrDefaultAsync(e => e.Id == eventId);
        if (eventItem == null) return new ApiResponse<bool> { Success = false, Message = "Event not found." };
        if (!isAdmin && eventItem.Club.OwnerId != userId) return new ApiResponse<bool> { Success = false, Message = "You do not have permission to delete this event." };
        _dbContext.Events.Remove(eventItem);
        await _dbContext.SaveChangesAsync();
        return new ApiResponse<bool> { Success = true, Message = "Event deleted successfully.", Data = true };
    }

    public async Task<ApiResponse<EventDto>> RegisterAsync(Guid eventId, Guid userId)
    {
        var eventItem = await _dbContext.Events.Include(e => e.Club).Include(e => e.Registrations).FirstOrDefaultAsync(e => e.Id == eventId);
        if (eventItem == null) return new ApiResponse<EventDto> { Success = false, Message = "Event not found." };
        if (eventItem.StartTime <= DateTime.UtcNow) return new ApiResponse<EventDto> { Success = false, Message = "Registration for this event is closed." };
        if (eventItem.Registrations.Any(r => r.UserId == userId)) return new ApiResponse<EventDto> { Success = false, Message = "You are already registered for this event." };
        if (eventItem.RegisteredCount >= eventItem.Capacity) return new ApiResponse<EventDto> { Success = false, Message = "This event is full." };

        eventItem.Registrations.Add(new EventRegistration { Id = Guid.NewGuid(), EventId = eventId, UserId = userId, RegisteredAt = DateTime.UtcNow });
        eventItem.RegisteredCount++;
        await _dbContext.SaveChangesAsync();
        return new ApiResponse<EventDto> { Success = true, Message = "Event registration successful.", Data = Map(eventItem, userId) };
    }

    public async Task<ApiResponse<bool>> RemoveRegistrationAsync(Guid eventId, Guid userId)
    {
        var registration = await _dbContext.EventRegistrations.FirstOrDefaultAsync(r => r.EventId == eventId && r.UserId == userId);
        if (registration == null) return new ApiResponse<bool> { Success = false, Message = "Event registration not found." };
        if (registration.IsCheckedIn) return new ApiResponse<bool> { Success = false, Message = "A checked-in registration cannot be removed." };
        var eventItem = await _dbContext.Events.FindAsync(eventId);
        _dbContext.EventRegistrations.Remove(registration);
        if (eventItem != null && eventItem.RegisteredCount > 0) eventItem.RegisteredCount--;
        await _dbContext.SaveChangesAsync();
        return new ApiResponse<bool> { Success = true, Message = "Event registration removed successfully.", Data = true };
    }

    public async Task<ApiResponse<List<EventParticipantDto>>> GetParticipantsAsync(Guid eventId, Guid userId, bool isAdmin)
    {
        var eventItem = await _dbContext.Events.Include(e => e.Club).FirstOrDefaultAsync(e => e.Id == eventId);
        if (eventItem == null) return new ApiResponse<List<EventParticipantDto>> { Success = false, Message = "Event not found." };
        if (!isAdmin && eventItem.Club.OwnerId != userId) return new ApiResponse<List<EventParticipantDto>> { Success = false, Message = "You do not have permission to view participants." };
        var participants = await _dbContext.EventRegistrations.Include(r => r.User).Where(r => r.EventId == eventId).ToListAsync();
        return new ApiResponse<List<EventParticipantDto>> { Success = true, Data = participants.Select(r => new EventParticipantDto { Id = r.Id, EventId = r.EventId, EventTitle = eventItem.Title, UserId = r.UserId, UserName = r.User.FullName, UserEmail = r.User.Email, PaymentStatus = "Paid", RegisteredAt = r.RegisteredAt, QrCode = $"UCMS-{r.Id:N}" }).ToList() };
    }

    private static EventDto Map(Event e, Guid? userId)
    {
        var registration = userId.HasValue ? e.Registrations.FirstOrDefault(r => r.UserId == userId.Value) : null;
        return new EventDto { Id = e.Id, ClubId = e.ClubId, ClubName = e.Club?.Name, ClubLogoUrl = e.Club?.LogoUrl, Title = e.Title, Description = e.Description ?? string.Empty, Date = e.StartTime, Venue = e.Location ?? string.Empty, Price = e.Price ?? 0, Capacity = e.Capacity, RegisteredCount = e.RegisteredCount, SeatsRemaining = Math.Max(0, e.Capacity - e.RegisteredCount), RegistrationDeadline = e.StartTime, CreatedAt = e.CreatedAt, IsRegistered = registration != null, RegistrationId = registration?.Id };
    }
}
