using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace University_Club_Management_Backend.Models;

public class Notification
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid UserId { get; set; }

    public Guid? ClubId { get; set; }

    [Required]
    [MaxLength(255)]
    public required string Title { get; set; }

    [Required]
    [MaxLength(4000)]
    public required string Message { get; set; }

    [Required]
    [MaxLength(50)]
    public required string Type { get; set; } = "Announcement"; // Announcement, System, Membership, Event

    public bool IsRead { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    [ForeignKey(nameof(ClubId))]
    public Club? Club { get; set; }
}
