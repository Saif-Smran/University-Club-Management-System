# 🚀 University Club Management Backend Web API

This is the primary ASP.NET Core 10 Web API service for the **University Club Management System (UCMS)**.

---

## 🛠️ Tech Stack & Dependencies

- **Target Framework**: `.NET 10.0`
- **Language**: C#
- **ORM**: Entity Framework Core 10
- **Database Provider**: PostgreSQL (`Npgsql.EntityFrameworkCore.PostgreSQL`)
- **Authentication**: JWT Bearer (`Microsoft.AspNetCore.Authentication.JwtBearer`)
- **API Documentation**: Swagger / OpenAPI UI

---

## 📂 Project Architecture & File Organization

```text
University Club Management Backend/
├── Program.cs                                 # Services registration, middleware pipeline, DB init
├── University Club Management Backend.csproj  # Package references & project properties
├── .env                                       # Local environment variables (DB host, secret keys)
├── .gitignore                                 # Project build artifact ignore file
├── appsettings.json                           # Default app settings & connection strings
├── appsettings.Development.json               # Development environment overrides
├── UniversityClubManagement.http             # REST API HTTP test queries for VS Code / Visual Studio
├── data/                                      # Entity Framework Core DB Context & Migrations
│   ├── ApplicationDbContext.cs                # EF Core DbContext mapping entity sets
│   └── Migrations/                            # EF Core database migration snapshots
├── models/                                    # C# Entity Models
│   ├── user.cs                                # User entity (Student, ClubAdmin, SystemAdmin)
│   ├── StudentVerification.cs                 # Verification document & approval status entity
│   ├── Club.cs                                # Club profile entity
│   ├── Membership.cs                          # Club membership application entity
│   ├── Event.cs                               # Free & Paid event entity
│   ├── EventRegistration.cs                   # Event registration record entity
│   ├── Payment.cs                             # Payment session & transaction record entity
│   └── Announcement.cs                        # Announcement bulletin entity
└── Properties/
    └── launchSettings.json                    # Kestrel & IIS launch profiles
```

---

## ⚙️ Environment Configuration

Create or update the `.env` file in this directory with your local PostgreSQL and JWT settings:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ucms_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET_KEY=YourSuperSecretKeyWithAtLeast32BytesLength!
JWT_ISSUER=UCMS_Backend
JWT_AUDIENCE=UCMS_Frontend
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
