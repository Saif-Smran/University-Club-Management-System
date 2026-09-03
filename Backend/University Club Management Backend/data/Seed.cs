using Microsoft.EntityFrameworkCore;
using University_Club_Management_Backend.Models;

namespace University_Club_Management_Backend.Data;

public static class Seed
{
    public static async Task SeedDataAsync(AppDbContext context)
    {
        bool anyDataAdded = false;

        var passwordHashAdmin = BCrypt.Net.BCrypt.HashPassword("Admin123!");
        var passwordHashUser = BCrypt.Net.BCrypt.HashPassword("Password123!");

        // 1. Users
        var seedUsers = new[]
        {           
            new User
            {
                Id = Guid.NewGuid(),
                FullName = "University Admin",
                Email = "admin.user@ucms.edu",
                PasswordHash = passwordHashAdmin,
                Role = ERole.Admin,
                IsVerified = true,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                Id = Guid.NewGuid(),
                FullName = "Tech Lead Admin",
                Email = "tech.lead@ucms.edu",
                PasswordHash = passwordHashUser,
                Role = ERole.ClubAdmin,
                IsVerified = true,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                Id = Guid.NewGuid(),
                FullName = "Robotics Lead Admin",
                Email = "robotics.lead@ucms.edu",
                PasswordHash = passwordHashUser,
                Role = ERole.ClubAdmin,
                IsVerified = true,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                Id = Guid.NewGuid(),
                FullName = "Arts Society Admin",
                Email = "arts.admin@ucms.edu",
                PasswordHash = passwordHashUser,
                Role = ERole.ClubAdmin,
                IsVerified = true,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                Id = Guid.NewGuid(),
                FullName = "Business Forum Admin",
                Email = "business.admin@ucms.edu",
                PasswordHash = passwordHashUser,
                Role = ERole.ClubAdmin,
                IsVerified = true,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                Id = Guid.NewGuid(),
                FullName = "Environment Club Admin",
                Email = "environment.admin@ucms.edu",
                PasswordHash = passwordHashUser,
                Role = ERole.ClubAdmin,
                IsVerified = true,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                Id = Guid.NewGuid(),
                FullName = "John Doe",
                Email = "john.doe@ucms.edu",
                PasswordHash = passwordHashUser,
                Role = ERole.Student,
                StudentId = "2023-1-60-001",
                IsVerified = true,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                Id = Guid.NewGuid(),
                FullName = "Jane Smith",
                Email = "jane.smith@ucms.edu",
                PasswordHash = passwordHashUser,
                Role = ERole.Student,
                StudentId = "2023-1-60-002",
                IsVerified = false,
                CreatedAt = DateTime.UtcNow
            }
        };

        var userMap = new Dictionary<string, User>();
        bool usersAdded = false;

        foreach (var seedUser in seedUsers)
        {
            var existingUser = await context.Users.FirstOrDefaultAsync(u => u.Email == seedUser.Email);
            if (existingUser == null)
            {
                context.Users.Add(seedUser);
                userMap[seedUser.Email] = seedUser;
                usersAdded = true;
            }
            else
            {
                userMap[seedUser.Email] = existingUser;
            }
        }

        if (usersAdded)
        {
            await context.SaveChangesAsync();
            anyDataAdded = true;
        }

        // 2. Student Verifications
        var student1 = userMap["john.doe@ucms.edu"];
        var student2 = userMap["jane.smith@ucms.edu"];
        var adminUser = userMap["admin.user@ucms.edu"];

        var seedVerifications = new[]
        {
            new StudentVerification
            {
                Id = Guid.NewGuid(),
                UserId = student1.Id,
                StudentId = student1.StudentId ?? "2023-1-60-001",
                DocumentPath = "https://res.cloudinary.com/demo/image/upload/sample_id_card1.jpg",
                Status = EStudentVerificationStatus.Approved,
                ApprovedAt = DateTime.UtcNow,
                ApprovedBy = adminUser.Id,
                CreatedAt = DateTime.UtcNow
            },
            new StudentVerification
            {
                Id = Guid.NewGuid(),
                UserId = student2.Id,
                StudentId = student2.StudentId ?? "2023-1-60-002",
                DocumentPath = "https://res.cloudinary.com/demo/image/upload/sample_id_card2.jpg",
                Status = EStudentVerificationStatus.Pending,
                CreatedAt = DateTime.UtcNow
            }
        };

        bool verificationsAdded = false;
        foreach (var seedVerification in seedVerifications)
        {
            var exists = await context.StudentVerifications.AnyAsync(sv => sv.UserId == seedVerification.UserId);
            if (!exists)
            {
                context.StudentVerifications.Add(seedVerification);
                verificationsAdded = true;
            }
        }

        if (verificationsAdded)
        {
            await context.SaveChangesAsync();
            anyDataAdded = true;
        }

        // 3. Clubs
        var clubAdmin1 = userMap["tech.lead@ucms.edu"];
        var clubAdmin2 = userMap["robotics.lead@ucms.edu"];
        var clubAdmin3 = userMap["arts.admin@ucms.edu"];
        var clubAdmin4 = userMap["business.admin@ucms.edu"];
        var clubAdmin5 = userMap["environment.admin@ucms.edu"];

        var seedClubs = new[]
        {
            new Club
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
            },
            new Club
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
            },
            new Club
            {
                Id = Guid.NewGuid(),
                Name = "Arts and Performance Society",
                Description = "Connecting students through theatre, music, dance, and live performance.",
                Category = "Arts",
                OwnerId = clubAdmin3.Id,
                LogoUrl = "https://res.cloudinary.com/demo/image/upload/sample_arts_logo.png",
                Status = EClubStatus.Approved,
                IsActive = true,
                ApprovedAt = DateTime.UtcNow,
                ApprovedBy = adminUser.Id,
                CreatedAt = DateTime.UtcNow
            },
            new Club
            {
                Id = Guid.NewGuid(),
                Name = "Business and Entrepreneurship Forum",
                Description = "A practical community for student founders, innovators, and future business leaders.",
                Category = "Business",
                OwnerId = clubAdmin4.Id,
                LogoUrl = "https://res.cloudinary.com/demo/image/upload/sample_business_logo.png",
                Status = EClubStatus.Approved,
                IsActive = true,
                ApprovedAt = DateTime.UtcNow,
                ApprovedBy = adminUser.Id,
                CreatedAt = DateTime.UtcNow
            },
            new Club
            {
                Id = Guid.NewGuid(),
                Name = "Green Campus Initiative",
                Description = "Leading sustainability projects, recycling drives, and environmental awareness campaigns.",
                Category = "Social Work",
                OwnerId = clubAdmin5.Id,
                LogoUrl = "https://res.cloudinary.com/demo/image/upload/sample_environment_logo.png",
                Status = EClubStatus.Approved,
                IsActive = true,
                ApprovedAt = DateTime.UtcNow,
                ApprovedBy = adminUser.Id,
                CreatedAt = DateTime.UtcNow
            },
            new Club
            {
                Id = Guid.NewGuid(),
                Name = "Debate and Public Speaking Club",
                Description = "Developing confident speakers through debates, model conferences, and public forums.",
                Category = "Academic",
                OwnerId = clubAdmin1.Id,
                LogoUrl = "https://res.cloudinary.com/demo/image/upload/sample_debate_logo.png",
                Status = EClubStatus.Approved,
                IsActive = true,
                ApprovedAt = DateTime.UtcNow,
                ApprovedBy = adminUser.Id,
                CreatedAt = DateTime.UtcNow
            },
            new Club
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
            }
        };

        var clubMap = new Dictionary<string, Club>();
        bool clubsAdded = false;

        foreach (var seedClub in seedClubs)
        {
            var existingClub = await context.Clubs.FirstOrDefaultAsync(c => c.Name == seedClub.Name);
            if (existingClub == null)
            {
                context.Clubs.Add(seedClub);
                clubMap[seedClub.Name] = seedClub;
                clubsAdded = true;
            }
            else
            {
                clubMap[seedClub.Name] = existingClub;
            }
        }

        if (clubsAdded)
        {
            await context.SaveChangesAsync();
            anyDataAdded = true;
        }

        // 4. Memberships
        var computerClub = clubMap["Computer Club"];
        var roboticsClub = clubMap["Robotics Club"];
        var artsClub = clubMap["Arts and Performance Society"];

        var seedMemberships = new[]
        {
            new Membership
            {
                Id = Guid.NewGuid(),
                UserId = student1.Id,
                ClubId = computerClub.Id,
                Status = "Approved",
                AppliedAt = DateTime.UtcNow.AddDays(-10),
                ApprovedAt = DateTime.UtcNow.AddDays(-10)
            },
            new Membership
            {
                Id = Guid.NewGuid(),
                UserId = student1.Id,
                ClubId = roboticsClub.Id,
                Status = "Approved",
                AppliedAt = DateTime.UtcNow.AddDays(-8),
                ApprovedAt = DateTime.UtcNow.AddDays(-8)
            },
            new Membership
            {
                Id = Guid.NewGuid(),
                UserId = student1.Id,
                ClubId = artsClub.Id,
                Status = "Approved",
                AppliedAt = DateTime.UtcNow.AddDays(-5),
                ApprovedAt = DateTime.UtcNow.AddDays(-5)
            },
            new Membership
            {
                Id = Guid.NewGuid(),
                UserId = student2.Id,
                ClubId = computerClub.Id,
                Status = "Pending",
                AppliedAt = DateTime.UtcNow.AddDays(-1)
            }
        };

        bool membershipsAdded = false;
        foreach (var seedMembership in seedMemberships)
        {
            var exists = await context.Memberships.AnyAsync(m => m.UserId == seedMembership.UserId && m.ClubId == seedMembership.ClubId);
            if (!exists)
            {
                context.Memberships.Add(seedMembership);
                membershipsAdded = true;
            }
        }

        if (membershipsAdded)
        {
            await context.SaveChangesAsync();
            anyDataAdded = true;
        }

        // 5. Events
        var seedEvents = new[]
        {
            new Event
            {
                Id = Guid.NewGuid(),
                ClubId = computerClub.Id,
                Title = "Annual Hackathon 2026",
                Description = "Join us for 24 hours of coding, innovative projects, and exciting prizes!",
                Type = "Free",
                Price = 0,
                Capacity = 100,
                RegisteredCount = 1,
                StartTime = DateTime.UtcNow.AddDays(7),
                EndTime = DateTime.UtcNow.AddDays(8),
                Location = "Main Campus Auditorium",
                CreatedAt = DateTime.UtcNow.AddDays(-5)
            },
            new Event
            {
                Id = Guid.NewGuid(),
                ClubId = computerClub.Id,
                Title = "Introduction to Open Source",
                Description = "Learn how to make your first contribution to an open-source project.",
                Type = "Free",
                Price = 0,
                Capacity = 80,
                RegisteredCount = 1,
                StartTime = DateTime.UtcNow.AddDays(10),
                EndTime = DateTime.UtcNow.AddDays(10).AddHours(2),
                Location = "Computer Science Lab 204",
                CreatedAt = DateTime.UtcNow.AddDays(-4)
            },
            new Event
            {
                Id = Guid.NewGuid(),
                ClubId = roboticsClub.Id,
                Title = "Robotics Build Day",
                Description = "A hands-on free build day for students interested in sensors and autonomous systems.",
                Type = "Free",
                Price = 0,
                Capacity = 50,
                RegisteredCount = 0,
                StartTime = DateTime.UtcNow.AddDays(14),
                EndTime = DateTime.UtcNow.AddDays(14).AddHours(6),
                Location = "Engineering Workshop",
                CreatedAt = DateTime.UtcNow.AddDays(-3)
            },
            new Event
            {
                Id = Guid.NewGuid(),
                ClubId = artsClub.Id,
                Title = "Campus Music Night",
                Description = "An evening of live performances by university student artists.",
                Type = "Paid",
                Price = 8.00m,
                Capacity = 250,
                RegisteredCount = 1,
                StartTime = DateTime.UtcNow.AddDays(18),
                EndTime = DateTime.UtcNow.AddDays(18).AddHours(3),
                Location = "University Open-Air Theatre",
                CreatedAt = DateTime.UtcNow.AddDays(-2)
            },
            new Event
            {
                Id = Guid.NewGuid(),
                ClubId = clubMap["Business and Entrepreneurship Forum"].Id,
                Title = "Startup Pitch Masterclass",
                Description = "Build a compelling pitch deck and present your startup idea to experienced mentors.",
                Type = "Paid",
                Price = 12.50m,
                Capacity = 120,
                RegisteredCount = 1,
                StartTime = DateTime.UtcNow.AddDays(21),
                EndTime = DateTime.UtcNow.AddDays(21).AddHours(3),
                Location = "Business Faculty Conference Hall",
                CreatedAt = DateTime.UtcNow.AddDays(-1)
            },
            new Event
            {
                Id = Guid.NewGuid(),
                ClubId = clubMap["Green Campus Initiative"].Id,
                Title = "Sustainable Campus Workshop",
                Description = "Explore practical ways to reduce waste and improve sustainability on campus.",
                Type = "Free",
                Price = 0,
                Capacity = 100,
                RegisteredCount = 0,
                StartTime = DateTime.UtcNow.AddDays(25),
                EndTime = DateTime.UtcNow.AddDays(25).AddHours(2),
                Location = "Student Union Seminar Room",
                CreatedAt = DateTime.UtcNow
            },
            new Event
            {
                Id = Guid.NewGuid(),
                ClubId = clubMap["Debate and Public Speaking Club"].Id,
                Title = "Interfaculty Debate Finals",
                Description = "Watch the university's leading speakers compete in the annual debate finals.",
                Type = "Paid",
                Price = 5.00m,
                Capacity = 300,
                RegisteredCount = 0,
                StartTime = DateTime.UtcNow.AddDays(30),
                EndTime = DateTime.UtcNow.AddDays(30).AddHours(3),
                Location = "Main Campus Auditorium",
                CreatedAt = DateTime.UtcNow
            }
        };

        var eventMap = new Dictionary<string, Event>();
        bool eventsAdded = false;

        foreach (var seedEvent in seedEvents)
        {
            var existingEvent = await context.Events.FirstOrDefaultAsync(e => e.Title == seedEvent.Title && e.ClubId == seedEvent.ClubId);
            if (existingEvent == null)
            {
                context.Events.Add(seedEvent);
                eventMap[seedEvent.Title] = seedEvent;
                eventsAdded = true;
            }
            else
            {
                eventMap[seedEvent.Title] = existingEvent;
            }
        }

        if (eventsAdded)
        {
            await context.SaveChangesAsync();
            anyDataAdded = true;
        }

        // 6. Event Registrations (4 Registrations for John Doe)
        var hackathonEvt = eventMap["Annual Hackathon 2026"];
        var openSourceEvt = eventMap["Introduction to Open Source"];
        var musicEvt = eventMap["Campus Music Night"];
        var pitchEvt = eventMap["Startup Pitch Masterclass"];
        var debateEvt = eventMap["Interfaculty Debate Finals"];

        var seedRegistrations = new[]
        {
            new EventRegistration
            {
                Id = Guid.NewGuid(),
                EventId = hackathonEvt.Id,
                UserId = student1.Id,
                RegisteredAt = DateTime.UtcNow.AddDays(-3),
                IsCheckedIn = false
            },
            new EventRegistration
            {
                Id = Guid.NewGuid(),
                EventId = openSourceEvt.Id,
                UserId = student1.Id,
                RegisteredAt = DateTime.UtcNow.AddDays(-2),
                IsCheckedIn = false
            },
            new EventRegistration
            {
                Id = Guid.NewGuid(),
                EventId = musicEvt.Id,
                UserId = student1.Id,
                RegisteredAt = DateTime.UtcNow.AddDays(-1),
                IsCheckedIn = false
            },
            new EventRegistration
            {
                Id = Guid.NewGuid(),
                EventId = pitchEvt.Id,
                UserId = student1.Id,
                RegisteredAt = DateTime.UtcNow,
                IsCheckedIn = false
            }
        };

        bool registrationsAdded = false;
        foreach (var reg in seedRegistrations)
        {
            var exists = await context.EventRegistrations.AnyAsync(r => r.EventId == reg.EventId && r.UserId == reg.UserId);
            if (!exists)
            {
                context.EventRegistrations.Add(reg);
                registrationsAdded = true;
            }
        }

        if (registrationsAdded)
        {
            await context.SaveChangesAsync();
            anyDataAdded = true;
        }

        // 7. Payments (3 Payments for John Doe)
        var seedPayments = new[]
        {
            new Payment
            {
                Id = Guid.NewGuid(),
                UserId = student1.Id,
                EventId = musicEvt.Id,
                Amount = 8.00m,
                Currency = "USD",
                Status = PaymentStatus.Paid,
                SessionId = "cs_test_music_night_101",
                PaymentMethod = "Stripe Sandbox",
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                PaidAt = DateTime.UtcNow.AddDays(-1)
            },
            new Payment
            {
                Id = Guid.NewGuid(),
                UserId = student1.Id,
                EventId = pitchEvt.Id,
                Amount = 12.50m,
                Currency = "USD",
                Status = PaymentStatus.Paid,
                SessionId = "cs_test_pitch_masterclass_102",
                PaymentMethod = "Stripe Sandbox",
                CreatedAt = DateTime.UtcNow.AddHours(-12),
                PaidAt = DateTime.UtcNow.AddHours(-12)
            },
            new Payment
            {
                Id = Guid.NewGuid(),
                UserId = student1.Id,
                EventId = debateEvt.Id,
                Amount = 5.00m,
                Currency = "USD",
                Status = PaymentStatus.Paid,
                SessionId = "cs_test_debate_finals_103",
                PaymentMethod = "Stripe Sandbox",
                CreatedAt = DateTime.UtcNow.AddHours(-2),
                PaidAt = DateTime.UtcNow.AddHours(-2)
            }
        };

        bool paymentsAdded = false;
        foreach (var pay in seedPayments)
        {
            var exists = await context.Payments.AnyAsync(p => p.UserId == pay.UserId && p.EventId == pay.EventId);
            if (!exists)
            {
                context.Payments.Add(pay);
                paymentsAdded = true;
            }
        }

        if (paymentsAdded)
        {
            await context.SaveChangesAsync();
            anyDataAdded = true;
        }

        // 8. Announcements
        var seedAnnouncements = new[]
        {
            new Announcement
            {
                Id = Guid.NewGuid(),
                ClubId = computerClub.Id,
                AuthorId = clubAdmin1.Id,
                Title = "Welcome to Computer Club!",
                Content = "We are thrilled to welcome all new members. Stay tuned for upcoming workshops and events!",
                IsPinned = true,
                CreatedAt = DateTime.UtcNow
            }
        };

        bool announcementsAdded = false;
        foreach (var seedAnnouncement in seedAnnouncements)
        {
            var exists = await context.Announcements.AnyAsync(a => a.Title == seedAnnouncement.Title && a.ClubId == seedAnnouncement.ClubId);
            if (!exists)
            {
                context.Announcements.Add(seedAnnouncement);
                announcementsAdded = true;
            }
        }

        if (announcementsAdded)
        {
            await context.SaveChangesAsync();
            anyDataAdded = true;
        }

        // Output summary message
        if (anyDataAdded)
        {
            Console.WriteLine("seed data has been added in the db");
        }
        else
        {
            Console.WriteLine("seed data is in the database");
        }
    }
}
