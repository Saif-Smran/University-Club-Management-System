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

1. Register
2. Upload Student ID (PDF/JPG/PNG)
3. Backend converts images to PDF.
4. Account status = Pending.
5. System Admin approves.
6. User logs in.
7. JWT + Refresh Token issued.

---

# Modules

## Authentication
- Register
- Login
- Logout
- Refresh Token
- Change Password

## Student Verification
- Upload ID
- Convert Image to PDF
- Store document
- Admin approval

## Users
- Profile
- Update profile
- Role management

## Clubs
- CRUD
- Search
- Categories

## Memberships
- Apply
- Approve
- Reject
- Leave club

## Events
- CRUD
- Free/Paid events
- Registration
- Capacity

## Payments
- Create payment session
- Verify payment
- Payment history

## Announcements
- CRUD
- Pin announcement

## Dashboard
- Student
- Club Admin
- System Admin

---

# Suggested Folder Structure

```text
src/
├── Controllers/
├── Services/
├── Repositories/
├── Interfaces/
├── DTOs/
├── Entities/
├── Data/
├── Middleware/
├── Validators/
├── Mappings/
├── Helpers/
├── Extensions/
├── Common/
└── Program.cs
```

---

# API Reference

## Authentication Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| POST | /api/auth/logout | Private |
| POST | /api/auth/refresh-token | Private |
| GET | /api/auth/me | Private |

## Student Verification Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/student-verification/upload | Private (Pending Student) |
| GET | /api/student-verification/pending | System Admin |
| PATCH | /api/student-verification/{id}/approve | System Admin |
| PATCH | /api/student-verification/{id}/reject | System Admin |

## User Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/users/profile | Private |
| PATCH | /api/users/profile | Private |
| GET | /api/users | System Admin |
| PATCH | /api/users/{id}/role | System Admin |

## Club Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/clubs | Club Admin |
| GET | /api/clubs | Public |
| GET | /api/clubs/{id} | Public |
| PATCH | /api/clubs/{id} | Club Admin |
| DELETE | /api/clubs/{id} | System Admin |

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