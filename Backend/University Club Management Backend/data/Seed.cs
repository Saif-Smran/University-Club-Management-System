using Microsoft.EntityFrameworkCore;
using University_Club_Management_Backend.Models;

namespace University_Club_Management_Backend.Data;

public static class Seed
{
    public static async Task SeedDataAsync(AppDbContext context)
    {
        if (await context.Users.AnyAsync())
        {
            return; // DB already seeded
        }

        var passwordHashAdmin = BCrypt.Net.BCrypt.HashPassword("Admin123!");
        var passwordHashUser = BCrypt.Net.BCrypt.HashPassword("Password123!");

        // 1. Users
        var systemAdmin = new User
        {
            Id = Guid.NewGuid(),
            FullName = "Super Admin",
            Email = "admin@ucms.edu",
            PasswordHash = passwordHashAdmin,
            Role = ERole.SystemAdmin,
            IsVerified = true,
            CreatedAt = DateTime.UtcNow
        };

        var adminUser = new User
        {
            Id = Guid.NewGuid(),
            FullName = "University Admin",
            Email = "admin.user@ucms.edu",
            PasswordHash = passwordHashAdmin,
            Role = ERole.Admin,
            IsVerified = true,
            CreatedAt = DateTime.UtcNow
        };

        var clubAdmin1 = new User
        {
            Id = Guid.NewGuid(),
            FullName = "Tech Lead Admin",
            Email = "tech.lead@ucms.edu",
            PasswordHash = passwordHashUser,
            Role = ERole.ClubAdmin,
            IsVerified = true,
            CreatedAt = DateTime.UtcNow
        };

        var clubAdmin2 = new User
        {
            Id = Guid.NewGuid(),
            FullName = "Robotics Lead Admin",
            Email = "robotics.lead@ucms.edu",
            PasswordHash = passwordHashUser,
            Role = ERole.ClubAdmin,
            IsVerified = true,
            CreatedAt = DateTime.UtcNow
        };

        var student1 = new User
        {
            Id = Guid.NewGuid(),
            FullName = "John Doe",
            Email = "john.doe@ucms.edu",
            PasswordHash = passwordHashUser,
            Role = ERole.Student,
            StudentId = "2023-1-60-001",
            IsVerified = true,
            CreatedAt = DateTime.UtcNow
        };

        var student2 = new User
        {
            Id = Guid.NewGuid(),
            FullName = "Jane Smith",
            Email = "jane.smith@ucms.edu",
            PasswordHash = passwordHashUser,
            Role = ERole.Student,
            StudentId = "2023-1-60-002",
            IsVerified = false,
            CreatedAt = DateTime.UtcNow
        };

        context.Users.AddRange(systemAdmin, adminUser, clubAdmin1, clubAdmin2, student1, student2);

        // 2. Student Verifications
        var verification1 = new StudentVerification
        {
            Id = Guid.NewGuid(),
            UserId = student1.Id,
            StudentId = student1.StudentId,
            DocumentPath = "https://res.cloudinary.com/demo/image/upload/sample_id_card1.jpg",
            Status = EStudentVerificationStatus.Approved,
            ApprovedAt = DateTime.UtcNow,
            ApprovedBy = adminUser.Id,
            CreatedAt = DateTime.UtcNow
        };

        var verification2 = new StudentVerification
        {
            Id = Guid.NewGuid(),
            UserId = student2.Id,
            StudentId = student2.StudentId,
            DocumentPath = "https://res.cloudinary.com/demo/image/upload/sample_id_card2.jpg",
            Status = EStudentVerificationStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        context.StudentVerifications.AddRange(verification1, verification2);

        // 3. Clubs
        var computerClub = new Club
        {
            Id = Guid.NewGuid(),
            Name = "Computer Club",
            Description = "The official Computer and Software Development Club of UCMS.",
            Category = "Technology",
            OwnerId = clubAdmin1.Id,
            LogoUrl = "https://res.cloudinary.com/demo/image/upload/sample_computer_logo.png",
            Status = EClubStatus.Approved,
            IsActive = true,
            ApprovedAt = DateTime.UtcNow,
            ApprovedBy = adminUser.Id,
            CreatedAt = DateTime.UtcNow
        };

        var roboticsClub = new Club
        {
            Id = Guid.NewGuid(),
            Name = "Robotics Club",
            Description = "Exploring automation, hardware, and robotics engineering.",
            Category = "Engineering",
            OwnerId = clubAdmin2.Id,
            LogoUrl = "https://res.cloudinary.com/demo/image/upload/sample_robotics_logo.png",
            Status = EClubStatus.Approved,
            IsActive = true,
            ApprovedAt = DateTime.UtcNow,
            ApprovedBy = adminUser.Id,
            CreatedAt = DateTime.UtcNow
        };

        var pendingPhotographyClub = new Club
        {
            Id = Guid.NewGuid(),
            Name = "Photography Club",
            Description = "A community for visual arts and photography enthusiasts.",
            Category = "Arts",
            OwnerId = student1.Id,
            LogoUrl = "https://res.cloudinary.com/demo/image/upload/sample_photo_logo.png",
            Status = EClubStatus.Pending,
            IsActive = false,
            CreatedAt = DateTime.UtcNow
        };

        context.Clubs.AddRange(computerClub, roboticsClub, pendingPhotographyClub);

        // 4. Memberships
        var member1 = new Membership
        {
            Id = Guid.NewGuid(),
            UserId = student1.Id,
            ClubId = computerClub.Id,
            Status = "Approved",
            AppliedAt = DateTime.UtcNow,
            ApprovedAt = DateTime.UtcNow
        };

        context.Memberships.Add(member1);

        await context.SaveChangesAsync();
    }
}
