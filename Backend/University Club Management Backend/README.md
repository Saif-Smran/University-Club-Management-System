# 🚀 University Club Management Backend Web API

This is the primary ASP.NET Core 10 Web API service for the **University Club Management System (UCMS)**.

---

## 🛠️ Tech Stack & Dependencies

- **Target Framework**: `.NET 10.0` (`net10.0`)
- **Language**: C# 13
- **ORM**: Entity Framework Core 10
- **Database Provider**: PostgreSQL (`Npgsql.EntityFrameworkCore.PostgreSQL`)
- **Cloud Media Storage**: Cloudinary (`CloudinaryDotNet`)
- **Payments Gateway**: Stripe Sandbox (`Stripe.net`)
- **Authentication**: JWT Bearer (`Microsoft.AspNetCore.Authentication.JwtBearer`), Refresh Tokens, BCrypt Hashing
- **API Documentation & Testing**: Swagger / OpenAPI UI & `.http` Interactive File (`UniversityClubManagement.http`)

---

## 📂 Project Architecture & File Organization

```text
University Club Management Backend/
├── Program.cs                                 # Services registration, middleware pipeline, DB & Seed init
├── University Club Management Backend.csproj  # Package references (EF Core, PostgreSQL, Cloudinary, Stripe) & properties
├── .env                                       # Local environment variables (DB, JWT, Cloudinary, Stripe Sandbox)
├── .gitignore                                 # Project build artifact ignore file
├── appsettings.json                           # Default app settings & connection strings
├── UniversityClubManagement.http             # REST API HTTP test suite (9 complete sections matching Postman)
├── data/                                      # Entity Framework Core DB Context, Seed.cs & Migrations
│   ├── ApplicationDbContext.cs                # EF Core DbContext mapping entity sets
│   ├── Seed.cs                                # Pre-populated test data seeding logic
│   └── Migrations/                            # EF Core database migration snapshots
├── Dtos/                                      # Data Transfer Objects by module
│   ├── Auth.cs
│   ├── StudentVerificationDtos.cs
│   ├── ClubDtos.cs
│   ├── MembershipDtos.cs
│   ├── UserDtos.cs
│   ├── DashboardDtos.cs
│   ├── PaymentDtos.cs
│   └── NotificationDtos.cs
├── models/                                    # C# Entity Models
│   ├── user.cs                                # User entity (with StudentId & IdCardImageUrl)
│   ├── StudentVerification.cs                 # Verification document & approval status entity
│   ├── Club.cs                                # Club entity (with Status, RejectionReason, logo URL)
│   ├── Membership.cs                          # Club membership application entity (with RejectionReason)
│   ├── Event.cs                               # Free & Paid event entity
│   ├── EventRegistration.cs                   # Event registration record entity
│   ├── Payment.cs                             # Payment session & transaction record entity
│   ├── Announcement.cs                        # Announcement bulletin entity
│   └── Notification.cs                       # Notification feed entity
├── Services/                                  # Infrastructure services
│   └── CloudinaryService.cs                   # Cloudinary CDN image upload service
└── modules/                                   # Feature modules (Controller + Service)
    ├── auth/                                  # Auth service & endpoints
    ├── student-verification/                  # Student verification queue & endpoints
    ├── user/                                  # User management & profile endpoints
    ├── club/                                  # Club creation application & approval endpoints
    ├── membership/                            # Membership join, approve, reject, leave endpoints
    ├── event/                                 # Event CRUD & registration endpoints
    ├── payment/                               # Stripe Checkout & webhook confirmation endpoints
    ├── notification/                          # In-app notifications & broadcast endpoints
    ├── announcement/                          # Club announcements & pin management endpoints
    └── dashboard/                             # Analytics & statistics endpoints by role

---

## ⚙️ Environment Configuration

Create or update the `.env` file in this directory with your local PostgreSQL, JWT, Cloudinary, and Stripe Sandbox settings:

```env
UCMS_DB_CONNECTION=Host=localhost;Database=ucms_db;Username=postgres;Password=your_password;SslMode=Prefer

JWT_SECRET_KEY=YourSuperSecretKeyWithAtLeast32BytesLength!
JWT_ISSUER=UCMS_Backend
JWT_AUDIENCE=UCMS_Frontend

# CLOUDINARY Setup
CLOUDINARY_CLOUD_NAME=tw2hejfe
CLOUDINARY_API_KEY=289826258969662
CLOUDINARY_API_SECRET=91NhEL_ZV3QvVM0jG3Ff53hxe2w

# STRIPE Sandbox Setup
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
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
- **HTTP File**: Open [UniversityClubManagement.http](file:///e:/University%20Club%20Management%20system/Backend/University%20Club%20Management%20Backend/UniversityClubManagement.http) in VS Code or Visual Studio to execute test requests directly across all 9 API sections.

---

## 📊 Database Models Summary

- **`User`**: System user with role (`Student`, `ClubAdmin`, `Admin`, `SystemAdmin`) and approval status (`Pending`, `Approved`, `Rejected`).
- **`StudentVerification`**: Uploaded student identity document path and verification state.
- **`Club`**: Registered university club with leader references, status, and category metadata.
- **`Membership`**: Relationship between a student and a club with status (`Pending`, `Approved`, `Rejected`) and rejection reasons.
- **`Event`**: Event details, capacity limits, deadlines, and fee specifications.
- **`EventRegistration`**: Student enrollment record for an event.
- **`Payment`**: Payment transaction record, amount, currency, status, and Stripe session ID.
- **`Announcement`**: Published club bulletin posts.
- **`Notification`**: User notification item, type (`Announcement`, `System`, etc.), read state, and broadcast links.
