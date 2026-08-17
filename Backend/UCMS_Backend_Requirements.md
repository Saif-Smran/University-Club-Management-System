# University Club Management System (UCMS)

# Backend Requirements Document

**Backend:** ASP.NET Core 10 Web API
**Language:** C#
**Database:** PostgreSQL
**ORM:** Entity Framework Core

---

# Architecture

- Clean Architecture (simplified)
- Controllers
- Services
- Repositories
- DTOs
- Entity Framework Core
- PostgreSQL
- JWT Authentication
- Refresh Tokens
- Role-Based Access Control (RBAC)

---

# User Roles

- Public
- Student
- Club Admin
- System Admin

---

# Authentication Flow

1. Student registers via `/api/auth/register-student` providing Student ID number and uploading ID card photo (no role parameter required).
2. Backend uploads the ID card photo directly to **Cloudinary CDN** and stores the secure image URL.
3. User verification status is set to **Pending** (`IsVerified = false`).
4. Admin reviews pending verifications at `/api/student-verification/pending` using the ID card photo.
5. Admin approves or rejects the student registration (`/api/student-verification/{id}/approve`).
6. Upon approval (`IsVerified = true`), the student logs in via `/api/auth/login` and receives JWT access and refresh tokens.

---

# Modules

## Authentication
- Register Student (`/api/auth/register-student` - no role field needed)
- Register Club Admin (`/api/auth/register-club-admin`)
- General Register (`/api/auth/register`)
- Login
- Logout
- Refresh Token
- Current User (`/api/auth/me`)

## Student Verification
- Upload Student ID Card photo to Cloudinary
- Store Cloudinary URL on User & StudentVerification record
- Pending approval queue
- Admin Approve/Reject with reason
- Get verification status

## Users
- Profile (`GET & PATCH /api/users/profile`)
- Admin list users (`GET /api/users`)
- Admin get user details (`GET /api/users/{id}`)
- Role management (`PATCH /api/users/{id}/role`)
- Delete user (`DELETE /api/users/{id}`)

## Clubs
- Apply for new Club Creation (`POST /api/clubs/apply`)
- Admin pending application queue (`GET /api/clubs/pending`)
- Admin approve/reject club (`PATCH /api/clubs/{id}/approve` & `reject`)
- CRUD Active Clubs, Categories, Search

## Memberships
- Apply to join club
- Approve membership
- Reject membership
- Leave club

## Events
- CRUD Events
- Free/Paid events
- Registration
- Capacity limits & deadline

## Payments
- Create payment session
- Verify payment / Webhook callback
- Payment history

## Announcements
- CRUD Bulletins
- Pin announcement

## Dashboard
- Student Dashboard (`GET /api/dashboard/student`)
- Club Admin Dashboard (`GET /api/dashboard/club-admin`)
- System Admin Dashboard (`GET /api/dashboard/admin`)

---

# Project Module Structure

```text
University Club Management Backend/
├── Data/
│   ├── ApplicationDbContext.cs
│   └── Seed.cs
├── Dtos/
│   ├── Auth.cs
│   ├── StudentVerificationDtos.cs
│   ├── ClubDtos.cs
│   ├── UserDtos.cs
│   └── DashboardDtos.cs
├── Models/
│   ├── user.cs
│   ├── StudentVerification.cs
│   ├── Club.cs
│   ├── Membership.cs
│   ├── Event.cs
│   ├── EventRegistration.cs
│   ├── Payment.cs
│   └── Announcement.cs
├── Services/
│   └── CloudinaryService.cs
└── Modules/
    ├── auth/
    ├── student-verification/
    ├── user/
    ├── club/
    └── dashboard/
```

---

# API Reference

## Authentication Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register-student | Public |
| POST | /api/auth/register-club-admin | Public |
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| POST | /api/auth/logout | Private |
| POST | /api/auth/refresh-token | Public |
| GET | /api/auth/me | Private |

## Student Verification Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/student-verification/upload | Private (Student) |
| GET | /api/student-verification/pending | System Admin |
| PATCH | /api/student-verification/{id}/approve | System Admin |
| PATCH | /api/student-verification/{id}/reject | System Admin |
| GET | /api/student-verification/status | Private (Student) |

## User Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/users/profile | Private |
| PATCH | /api/users/profile | Private |
| GET | /api/users | System Admin |
| GET | /api/users/{id} | System Admin |
| PATCH | /api/users/{id}/role | System Admin |
| DELETE | /api/users/{id} | System Admin |

## Club Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/clubs/apply | Private (Student/User) |
| GET | /api/clubs/pending | System Admin |
| PATCH | /api/clubs/{id}/approve | System Admin |
| PATCH | /api/clubs/{id}/reject | System Admin |
| GET | /api/clubs | Public |
| GET | /api/clubs/{id} | Public |
| PATCH | /api/clubs/{id} | Club Admin / Owner |
| DELETE | /api/clubs/{id} | System Admin / Owner |

## Membership Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/clubs/{id}/apply | Student |
| PATCH | /api/memberships/{id}/approve | Club Admin |
| PATCH | /api/memberships/{id}/reject | Club Admin |
| POST | /api/clubs/{id}/leave | Student |

## Event Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/events | Club Admin |
| GET | /api/events | Public |
| GET | /api/events/{id} | Public |
| PATCH | /api/events/{id} | Club Admin |
| DELETE | /api/events/{id} | Club Admin |
| POST | /api/events/{id}/register | Student |

## Payment Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/payments/create-session | Student |
| POST | /api/payments/webhook | Public (Gateway) |
| GET | /api/payments/{id} | Student/System Admin |

## Announcement Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/announcements | Club Admin |
| GET | /api/announcements | Public |
| PATCH | /api/announcements/{id} | Club Admin |
| DELETE | /api/announcements/{id} | Club Admin |

## Dashboard Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/dashboard/student | Student |
| GET | /api/dashboard/club-admin | Club Admin |
| GET | /api/dashboard/admin | System Admin |

---

# Database Entities

- User
- StudentVerification
- Club
- Membership
- Event
- EventRegistration
- Payment
- Announcement

---

# Middleware

- Exception Handling
- JWT Authentication
- Authorization
- Request Logging
- Validation

---

# Future Enhancements

- SignalR
- Email Verification
- QR Check-in
- AI Recommendations
- Mobile App