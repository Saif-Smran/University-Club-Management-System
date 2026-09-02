using System.ComponentModel.DataAnnotations;

namespace University_Club_Management_Backend.Models;

public enum ERole
{
    Student,
    ClubAdmin,
    Admin
}

public class User
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(255)]
    public required string Email { get; set; }

    [Required]
    public required string PasswordHash { get; set; }

    [Required]
    [MaxLength(100)]
    public required string FullName { get; set; }

    [Required]
    public ERole Role { get; set; } = ERole.Student;

    [MaxLength(50)]
    public string? StudentId { get; set; }

    [MaxLength(500)]
    public string? IdCardImageUrl { get; set; }

    public bool IsVerified { get; set; } = false;

    [MaxLength(500)]
    public string? RefreshToken { get; set; }

    public DateTime? RefreshTokenExpiry { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    // Navigation properties

    public StudentVerification? StudentVerification { get; set; }

    public ICollection<Club> OwnedClubs { get; set; } = new List<Club>();

    public ICollection<Membership> Memberships { get; set; } = new List<Membership>();

    public ICollection<EventRegistration> EventRegistrations { get; set; }
        = new List<EventRegistration>();

    public ICollection<Payment> Payments { get; set; }
        = new List<Payment>();

    public ICollection<Announcement> Announcements { get; set; }
        = new List<Announcement>();
}