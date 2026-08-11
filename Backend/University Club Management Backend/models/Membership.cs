using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace University_Club_Management_Backend.Models;

public class Membership
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [Required]
    public Guid ClubId { get; set; }

    [Required]
    [MaxLength(20)]
    public required string Status { get; set; } // Pending, Approved, Rejected

    public DateTime AppliedAt { get; set; }

    public DateTime? ApprovedAt { get; set; }

    public DateTime? LeftAt { get; set; }

    // Navigation properties

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    [ForeignKey(nameof(ClubId))]
    public Club Club { get; set; } = null!;
}