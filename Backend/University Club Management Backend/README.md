# 🚀 University Club Management Backend Web API

This is the primary ASP.NET Core 10 Web API service for the **University Club Management System (UCMS)**.

---

## 🛠️ Tech Stack & Dependencies

- **Target Framework**: `.NET 10.0`
- **Language**: C#
- **ORM**: Entity Framework Core 10
- **Database Provider**: PostgreSQL (`Npgsql.EntityFrameworkCore.PostgreSQL`)
- **Cloud Storage**: Cloudinary (`CloudinaryDotNet`)
- **Authentication**: JWT Bearer (`Microsoft.AspNetCore.Authentication.JwtBearer`), Refresh Tokens, BCrypt
- **API Documentation**: Swagger / OpenAPI UI & `.http` Interactive File

---

## 📂 Project Architecture & File Organization

```text
University Club Management Backend/
├── Program.cs                                 # Services registration, middleware pipeline, DB & Seed init
├── University Club Management Backend.csproj  # Package references & project properties
├── .env                                       # Local environment variables (DB, JWT, Cloudinary)
├── .gitignore                                 # Project build artifact ignore file
├── appsettings.json                           # Default app settings & connection strings
├── UniversityClubManagement.http             # REST API HTTP test queries for VS Code / Visual Studio
├── data/                                      # Entity Framework Core DB Context, Seed.cs & Migrations
│   ├── ApplicationDbContext.cs                # EF Core DbContext mapping entity sets
│   ├── Seed.cs                                # Pre-populated test data seeding logic
│   └── Migrations/                            # EF Core database migration snapshots
├── Dtos/                                      # Data Transfer Objects by module
├── models/                                    # C# Entity Models
│   ├── user.cs                                # User entity (with StudentId & IdCardImageUrl)
│   ├── StudentVerification.cs                 # Verification document & approval status entity
│   ├── Club.cs                                # Club entity (with Status, RejectionReason, logo URL)
│   ├── Membership.cs                          # Club membership application entity
│   ├── Event.cs                               # Free & Paid event entity
│   ├── EventRegistration.cs                   # Event registration record entity
│   ├── Payment.cs                             # Payment session & transaction record entity
│   └── Announcement.cs                        # Announcement bulletin entity
├── Services/                                  # Infrastructure services
│   └── CloudinaryService.cs                   # Cloudinary CDN image upload service
└── modules/                                   # Feature modules (Controller + Service)
    ├── auth/                                  # Auth service & endpoints
    ├── student-verification/                  # Student verification queue & endpoints
    ├── user/                                  # User management & profile endpoints
    ├── club/                                  # Club creation application & approval endpoints
    └── dashboard/                             # Dashboard metrics endpoints
```

---

## ⚙️ Environment Configuration

Create or update the `.env` file in this directory with your local PostgreSQL, JWT, and Cloudinary settings:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ucms_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET_KEY=YourSuperSecretKeyWithAtLeast32BytesLength!
JWT_ISSUER=UCMS_Backend
JWT_AUDIENCE=UCMS_Frontend

CLOUDINARY_CLOUD_NAME=tw2hejfe
CLOUDINARY_API_KEY=289826258969662
CLOUDINARY_API_SECRET=91NhEL_ZV3QvVM0jG3Ff53hxe2w
```

---

## 🚀 Commands & Execution

### 1. Restore Packages
```bash
dotnet restore
```

### 2. Database Migrations
To apply existing Entity Framework Core migrations to your PostgreSQL database:
```bash
dotnet ef database update
```

To create a new migration after model changes:
```bash
dotnet ef migrations add <MigrationName>
```

### 3. Run Web API
```bash
dotnet run
```

By default, Kestrel will listen on:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`

### 4. Interactive API Testing
- **Swagger UI**: Access `http://localhost:5000/swagger` in your browser.
- **HTTP File**: Open [UniversityClubManagement.http](file:///e:/University%20Club%20Management%20system/Backend/University%20Club%20Management%20Backend/UniversityClubManagement.http) in VS Code or Visual Studio to execute test requests directly.

---

## 📊 Database Models Summary

- **`User`**: System user with role (`Student`, `ClubAdmin`, `SystemAdmin`) and approval status (`Pending`, `Approved`, `Rejected`).
- **`StudentVerification`**: Uploaded student identity document path and verification state.
- **`Club`**: Registered university club with leader references and category metadata.
- **`Membership`**: Relationship between a student and a club.
- **`Event`**: Event details, capacity limits, deadlines, and fee specifications.
- **`EventRegistration`**: Student enrollment record for an event.
- **`Payment`**: Payment transaction record and payment gateway session details.
- **`Announcement`**: Published club bulletin posts.
