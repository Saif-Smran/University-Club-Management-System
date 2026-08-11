using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace University_Club_Management_Backend.Models;

public class Announcement
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid ClubId { get; set; }

    [Required]
    public Guid AuthorId { get; set; }

    [Required]
    [MaxLength(255)]
    public required string Title { get; set; }

    [Required]
    [MaxLength(4000)]
    public required string Content { get; set; }

    public bool IsPinned { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    // Navigation properties

    [ForeignKey(nameof(ClubId))]
    public Club Club { get; set; } = null!;

    [ForeignKey(nameof(AuthorId))]
    public User Author { get; set; } = null!;
}