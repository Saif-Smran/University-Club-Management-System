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
    ├── .env                                 # Local environment variables
    ├── .gitignore                           # Git ignore for build outputs
    ├── appsettings.json                     # Database connection & logging configs
    ├── data/                                # EF Core Database Context & Migrations
    ├── models/                              # Data entities & database models
    └── Properties/                          # Launch profiles (IIS, Kestrel)
```

---

## 🛠️ Tech Stack & Key Libraries

- **Framework**: ASP.NET Core 10 Web API (`net10.0`)
- **Language**: C# 13
- **ORM**: Entity Framework Core 10 (`Npgsql.EntityFrameworkCore.PostgreSQL`)
- **Database**: PostgreSQL
- **Authentication**: JWT Bearer Tokens (`Microsoft.AspNetCore.Authentication.JwtBearer`)
- **API Tooling**: Swagger / OpenAPI, `.http` file execution

---

## 📋 Core Modules

1. **Authentication & Authorization (`/api/auth`)**: JWT issuance, refresh tokens, role-based protection.
2. **Student Verification (`/api/student-verification`)**: ID upload, image-to-PDF conversion, admin approval.
3. **Users (`/api/users`)**: User profile management and role assignment.
4. **Clubs (`/api/clubs`)**: Club creation, category management, searching.
5. **Memberships (`/api/memberships`)**: Application submission, club admin approvals.
6. **Events (`/api/events`)**: Event publishing (Free & Paid), capacity validation.
7. **Payments (`/api/payments`)**: Payment session initialization and webhook processing.
8. **Announcements (`/api/announcements`)**: Club bulletins and pinned announcements.
9. **Dashboard (`/api/dashboard`)**: Tailored metrics for Students, Club Admins, and System Admins.

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
