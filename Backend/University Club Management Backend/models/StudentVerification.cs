using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace University_Club_Management_Backend.Models;

public enum EStudentVerificationStatus
{
    Pending,
    Approved,
    Rejected
}

public class StudentVerification
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [MaxLength(50)]
    public string? StudentId { get; set; }

    [Required]
    [MaxLength(500)]
    public required string DocumentPath { get; set; }

    [Required]
    public required EStudentVerificationStatus Status { get; set; } 

    public DateTime? ApprovedAt { get; set; }

    public Guid? ApprovedBy { get; set; }

    [MaxLength(500)]
    public string? RejectionReason { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    // Navigation property
    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;
}