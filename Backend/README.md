# ⚙️ UCMS Backend Workspace

This directory contains the ASP.NET Core 10 Web API backend service for the **University Club Management System (UCMS)**, along with backend architectural requirements and solution configurations.

---

## 📂 Workspace Structure

```text
Backend/
├── README.md                                # Workspace overview (this file)
├── UCMS_Backend_Requirements.md             # Detailed API specifications & database schema
├── Campus-Club-Management-API.postman_collection.json  # Postman API collection
├── University Club Management Backend.slnx  # Visual Studio / .NET Solution File
└── University Club Management Backend/      # Main ASP.NET Core Web API Project
    ├── Program.cs                           # App startup, service registration & middleware setup
    ├── University Club Management Backend.csproj  # Project file with NuGet package references
    ├── .env                                 # Local environment variables (DB, JWT, Cloudinary, Stripe Sandbox)
    ├── .gitignore                           # Git ignore for build outputs & secrets
    ├── appsettings.json                     # Default application settings & connection strings
    ├── appsettings.Development.json         # Development-specific settings
    ├── UniversityClubManagement.http        # REST API test queries (.http interactive file with 9+ sections)
    ├── data/                                # Entity Framework Core Database Context, Seed.cs & Migrations
    │   ├── ApplicationDbContext.cs          # EF Core DbContext entity set mappings
    │   ├── Seed.cs                          # Pre-seeded test data initialization
    │   └── Migrations/                      # EF Core database migration snapshots
    ├── Dtos/                                # Data Transfer Objects organized by module
    │   ├── Auth.cs
    │   ├── StudentVerificationDtos.cs
    │   ├── UserDtos.cs
    │   ├── ClubDtos.cs
    │   ├── MembershipDtos.cs
    │   ├── EventDtos.cs
    │   ├── PaymentDtos.cs
    │   ├── NotificationDtos.cs
    │   ├── AnnouncementDtos.cs
    │   └── DashboardDtos.cs
    ├── models/                              # Entity models for database persistence
    │   ├── user.cs                          # User (Student/ClubAdmin/Admin roles, StudentId, IdCardImageUrl)
    │   ├── StudentVerification.cs           # ID verification record & approval status
    │   ├── Club.cs                          # Club entity (with Status, RejectionReason, LogoUrl)
    │   ├── Membership.cs                    # Club membership application & status
    │   ├── Event.cs                         # Free & paid event entity
    │   ├── EventRegistration.cs             # Event registration & payment tracking
    │   ├── Payment.cs                       # Stripe payment session & transaction record
    │   ├── Announcement.cs                  # Club announcement & pinned bulletin entity
    │   └── Notification.cs                  # In-app notification feed entity
    ├── Services/                            # Infrastructure & utility services
    │   └── CloudinaryService.cs             # Cloudinary CDN image upload & URL management
    ├── Properties/                          # Project properties
    │   └── launchSettings.json              # Kestrel launch configuration for HTTP/HTTPS ports
    ├── bin/                                 # Compiled binaries (Debug/Release)
    └── modules/                             # Feature modules (each with Controller + Service)
        ├── auth/                            # Authentication & JWT token management
        ├── student-verification/            # Student ID photo verification & approval workflow
        ├── user/                            # User profile & admin management endpoints
        ├── club/                            # Club application, approval & CRUD endpoints
        ├── membership/                      # Membership application & approval workflow
        ├── event/                           # Event CRUD & registration endpoints
        ├── payment/                         # Stripe Checkout & webhook confirmation
        ├── notification/                    # In-app notifications & club broadcasts
        ├── announcement/                    # Announcements & pinned post management
        └── dashboard/                       # Analytics & role-specific statistics
```

---

## 🛠️ Tech Stack & Key Libraries

- **Framework**: ASP.NET Core 10 Web API (`net10.0`)
- **Language**: C# 13
- **ORM**: Entity Framework Core 10 (`Npgsql.EntityFrameworkCore.PostgreSQL`)
- **Database**: PostgreSQL
- **Cloud Image Storage**: Cloudinary (`CloudinaryDotNet`)
- **Payment Processing**: Stripe Sandbox (`Stripe.net`)
- **Authentication**: JWT Bearer Tokens (`Microsoft.AspNetCore.Authentication.JwtBearer`), Refresh Tokens, Cookie handling, BCrypt Hashing
- **API Tooling**: Swagger / OpenAPI, `.http` interactive test suite

---

## 📋 Core Modules

1. **Authentication & Authorization (`/api/auth`)** 
   - JWT token generation & refresh tokens
   - Student registration (`/api/auth/register-student`) without role parameter
   - Club admin registration (`/api/auth/register-club-admin`)
   - Login with credentials, logout, token refresh
   - Role-based authorization policies

2. **Student Verification (`/api/student-verification`)** 
   - Student ID number & ID card photo upload to Cloudinary
   - Admin review queue for pending verifications (`/api/student-verification/pending`)
   - Approval/rejection with rejection reasons
   - Verification status tracking

3. **Users (`/api/users`)** 
   - User profile retrieval & updates
   - Admin user management, search & filtering
   - Role modification & user deletion
   - Account settings & profile information

4. **Clubs (`/api/clubs`)** 
   - Club creation application with logo upload to Cloudinary
   - Admin approval/rejection queue (`/api/clubs/pending`)
   - Club listing, filtering & category search
   - CRUD operations for active clubs
   - Logo & description management

5. **Memberships (`/api/memberships`)** 
   - Club join application (`/api/clubs/{clubId}/apply`)
   - Membership approval/rejection by Club Admins
   - Leave club functionality
   - Pending membership review queue

6. **Events (`/api/events`)** 
   - Free & paid event creation with capacity tracking
   - Event listing with filters & search (`/api/events`)
   - Managed events listing for club admins (`/api/events/managed`)
   - Registration deadline & venue management
   - Event registration tracking
   - Participant list retrieval

7. **Payments (`/api/payments`)** 
   - Stripe Checkout session creation (`/api/payments/create`)
   - Webhook payment confirmation (`/api/payments/confirm`)
   - User payment history & receipts
   - Payment status tracking

8. **Notifications (`/api/notifications`)** 
   - In-app notification feed with pagination
   - Unread count badge (`/api/notifications/unread-count`)
   - Mark as read / mark all as read
   - Notification deletion
   - Club-wide broadcast to members (`/api/notifications/broadcast`)

9. **Announcements (`/api/announcements`)** 
   - Club announcements CRUD
   - Pin/unpin announcements to top
   - Announcement listing & filtering
   - Author tracking & edit history

10. **Dashboard (`/api/dashboard`)** 
    - Student dashboard metrics (`/api/dashboard/student`)
    - Club Admin analytics (`/api/dashboard/club-admin`)
    - System Admin statistics (`/api/dashboard/admin`)
    - Platform-wide metrics & reporting

---

## 🚀 Running the Backend

From this directory, you can run the primary API service:

```bash
# Navigate to the API project
cd "University Club Management Backend"

# Restore dependencies
dotnet restore

# Apply EF Core migrations to PostgreSQL database
dotnet ef database update

# Run the API server
dotnet run
```

---

## 📖 Related Specifications & Documentation

For complete API endpoint details, database schema definitions, middleware flow, and implementation examples, refer to:

- **[UCMS Backend Requirements Document](UCMS_Backend_Requirements.md)** - Comprehensive API endpoint specifications, database entity schemas, workflow examples, authentication details, and middleware configuration
- **[API Project README](University%20Club%20Management%20Backend/README.md)** - Detailed setup & execution guide, environment configuration, database migrations, and interactive testing
- **[Main System Requirements](../University_Club_Management_System_Requirements.md)** - Master requirements spec with user roles, features, technologies, and API reference tables
- **[Frontend Integration](../Frontend/README.md)** - Frontend workspace overview and page route structure
- **[Design System](../Frontend/DESIGM.md)** - Academic Nexus design system with colors, typography, components, and layouts
