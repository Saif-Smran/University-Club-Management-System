using Microsoft.EntityFrameworkCore;
using University_Club_Management_Backend.Models;

namespace University_Club_Management_Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<StudentVerification> StudentVerifications => Set<StudentVerification>();
    public DbSet<Club> Clubs => Set<Club>();
    public DbSet<Membership> Memberships => Set<Membership>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<EventRegistration> EventRegistrations => Set<EventRegistration>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Announcement> Announcements => Set<Announcement>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // =========================
        // USER
        // =========================

        modelBuilder.Entity<User>()
            .HasKey(u => u.Id);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // =========================
        // STUDENT VERIFICATION
        // =========================

        modelBuilder.Entity<StudentVerification>()
            .HasKey(sv => sv.Id);

        modelBuilder.Entity<StudentVerification>()
            .HasOne(sv => sv.User)
            .WithOne(u => u.StudentVerification)
            .HasForeignKey<StudentVerification>(sv => sv.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // =========================
        // CLUB
        // =========================

        modelBuilder.Entity<Club>()
            .HasKey(c => c.Id);

        modelBuilder.Entity<Club>()
            .HasOne(c => c.Owner)
            .WithMany(u => u.OwnedClubs)
            .HasForeignKey(c => c.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

        // =========================
        // MEMBERSHIP
        // =========================

        modelBuilder.Entity<Membership>()
            .HasKey(m => m.Id);

        modelBuilder.Entity<Membership>()
            .HasOne(m => m.User)
            .WithMany(u => u.Memberships)
            .HasForeignKey(m => m.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Membership>()
            .HasOne(m => m.Club)
            .WithMany(c => c.Memberships)
            .HasForeignKey(m => m.ClubId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Membership>()
            .HasIndex(m => new { m.UserId, m.ClubId })
            .IsUnique();

        // =========================
        // EVENT
        // =========================

        modelBuilder.Entity<Event>()
            .HasKey(e => e.Id);

        modelBuilder.Entity<Event>()
            .HasOne(e => e.Club)
            .WithMany(c => c.Events)
            .HasForeignKey(e => e.ClubId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Event>()
            .Property(e => e.Price)
            .HasPrecision(18, 2);

        // =========================
        // EVENT REGISTRATION
        // =========================

        modelBuilder.Entity<EventRegistration>()
            .HasKey(er => er.Id);

        modelBuilder.Entity<EventRegistration>()
            .HasOne(er => er.Event)
            .WithMany(e => e.Registrations)
            .HasForeignKey(er => er.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<EventRegistration>()
            .HasOne(er => er.User)
            .WithMany(u => u.EventRegistrations)
            .HasForeignKey(er => er.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<EventRegistration>()
            .HasIndex(er => new { er.EventId, er.UserId })
            .IsUnique();

        // =========================
        // PAYMENT
        // =========================

        modelBuilder.Entity<Payment>()
            .HasKey(p => p.Id);

        modelBuilder.Entity<Payment>()
            .Property(p => p.Amount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Payment>()
            .HasOne(p => p.User)
            .WithMany(u => u.Payments)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Payment>()
            .HasOne(p => p.Event)
            .WithMany(e => e.Payments)
            .HasForeignKey(p => p.EventId)
            .OnDelete(DeleteBehavior.SetNull);

        // =========================
        // ANNOUNCEMENT
        // =========================

        modelBuilder.Entity<Announcement>()
            .HasKey(a => a.Id);

        modelBuilder.Entity<Announcement>()
            .HasOne(a => a.Club)
            .WithMany(c => c.Announcements)
            .HasForeignKey(a => a.ClubId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Announcement>()
            .HasOne(a => a.Author)
            .WithMany(u => u.Announcements)
            .HasForeignKey(a => a.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}