using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace University_Club_Management_Backend.Models;

public class Club
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(200)]
    public required string Name { get; set; }

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    [MaxLength(50)]
    public required string Category { get; set; }

    [Required]
    public Guid OwnerId { get; set; }

    [MaxLength(500)]
    public string? LogoUrl { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    // Navigation properties

    [ForeignKey(nameof(OwnerId))]
    public User Owner { get; set; } = null!;

    public ICollection<Membership> Memberships { get; set; }
        = new List<Membership>();

    public ICollection<Event> Events { get; set; }
        = new List<Event>();

    public ICollection<Announcement> Announcements { get; set; }
        = new List<Announcement>();
}