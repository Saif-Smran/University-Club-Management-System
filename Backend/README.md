# ⚙️ UCMS Backend Workspace

This directory contains the ASP.NET Core 10 Web API backend service for the **University Club Management System (UCMS)**, along with backend architectural requirements and solution configurations.

---

## 📂 Workspace Structure

```text
Backend/
├── README.md                                # Workspace overview (this file)
├── UCMS_Backend_Requirements.md            # Detailed API specifications & database schema
├── University Club Management Backend.slnx  # Visual Studio / .NET Solution File
└── University Club Management Backend/      # Main ASP.NET Core Web API Project
    ├── Program.cs                           # App startup & middleware setup
    ├── .env                                 # Local environment variables (DB, JWT, Cloudinary, Stripe Sandbox)
    ├── .gitignore                           # Git ignore for build outputs
    ├── appsettings.json                     # Database connection & logging configs
    ├── UniversityClubManagement.http        # REST API test queries (9 complete sections matching Postman)
    ├── data/                                # EF Core Database Context, Seed.cs & Migrations
    ├── Dtos/                                # Data Transfer Objects by module
    ├── models/                              # Data entities & database models
    ├── Services/                            # Infrastructure services (CloudinaryService)
    └── modules/                             # Feature modules (auth, student-verification, user, club, membership, payment, notification, dashboard)
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

1. **Authentication & Authorization (`/api/auth`)**: JWT token generation, refresh tokens, student registration (`/api/auth/register-student` without role selection), club admin registration (`/api/auth/register-club-admin`), logout.
2. **Student Verification (`/api/student-verification`)**: Student ID number & ID photo Cloudinary upload, Admin approval/rejection queue.
3. **Users (`/api/users`)**: User profile retrieval, profile updates, Admin user management, role modification, deletion.
4. **Clubs (`/api/clubs`)**: Club creation application (`/api/clubs/apply`), Admin approval/rejection queue, club listing & logo Cloudinary management.
5. **Memberships (`/api/memberships`)**: Club joining application submission (`/api/clubs/{clubId}/apply`), approval/rejection by Club Admins (`/api/memberships/{id}/approve` & `reject`), leave club (`/api/clubs/{clubId}/leave`).
6. **Events (`/api/events`)**: Free & Paid event creation, capacity tracking, registration.
7. **Payments (`/api/payments`)**: Stripe Checkout session creation (`/api/payments/create`), webhook payment confirmation (`/api/payments/confirm`), user payment history (`/api/payments`).
8. **Notifications (`/api/notifications`)**: In-app user notifications, unread count badge, mark as read, delete, and club-wide broadcasts (`/api/notifications/broadcast`).
9. **Announcements (`/api/announcements`)**: Club announcements & pinned bulletin management.
10. **Dashboard (`/api/dashboard`)**: Analytics statistics for Students (`/api/dashboard/student`), Club Admins (`/api/dashboard/club-admin`), and System Admins (`/api/dashboard/admin`).

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

## 📖 Related Specifications

For complete API endpoint details, schema definitions, and middleware flow, refer to:
- [UCMS Backend Requirements Document](file:///e:/University%20Club%20Management%20system/Backend/UCMS_Backend_Requirements.md)
- [Main API Project README](file:///e:/University%20Club%20Management%20system/Backend/University%20Club%20Management%20Backend/README.md)
