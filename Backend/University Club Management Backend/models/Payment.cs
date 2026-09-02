using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace University_Club_Management_Backend.Models;

public enum PaymentStatus
{
    Pending,
    Paid,
    Failed
}

public class Payment
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid UserId { get; set; }

    public Guid? EventId { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    [Required]
    [MaxLength(10)]
    public required string Currency { get; set; } // BDT, USD

    [Required]
    public PaymentStatus Status { get; set; } // Pending, Paid, Failed

    [MaxLength(255)]
    public string? SessionId { get; set; }

    [MaxLength(50)]
    public string? PaymentMethod { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? PaidAt { get; set; }

    // Navigation properties

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    [ForeignKey(nameof(EventId))]
    public Event? Event { get; set; }
}