using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace University_Club_Management_Backend.Models;

public class Event
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid ClubId { get; set; }

    [Required]
    [MaxLength(255)]
    public required string Title { get; set; }

    [MaxLength(2000)]
    public string? Description { get; set; }

    [Required]
    [MaxLength(10)]
    public required string Type { get; set; } // Free, Paid

    [Column(TypeName = "decimal(18,2)")]
    public decimal? Price { get; set; }

    public int Capacity { get; set; }

    public int RegisteredCount { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    [MaxLength(500)]
    public string? Location { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    // Navigation properties

    [ForeignKey(nameof(ClubId))]
    public Club Club { get; set; } = null!;

    public ICollection<EventRegistration> Registrations { get; set; }
        = new List<EventRegistration>();

    public ICollection<Payment> Payments { get; set; }
        = new List<Payment>();
}