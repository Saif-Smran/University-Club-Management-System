# University Club Management System (UCMS)

# Backend Requirements Document

**Backend:** ASP.NET Core 10 Web API  
**Language:** C# 13  
**Database:** PostgreSQL  
**ORM:** Entity Framework Core 10  
**Payments:** Stripe Sandbox (`Stripe.net`)  
**CDN Storage:** Cloudinary (`CloudinaryDotNet`)  

---

# Architecture

- Modular Architecture (Controllers, Services, DTOs per module)
- Entity Framework Core 10
- PostgreSQL Database
- JWT Authentication & Refresh Tokens
- Cookie-based Token Pass-through & Bearer Header Support
- Role-Based Access Control (RBAC) Policies

---

# User Roles

- Public
- Student
- Club Admin
- System Admin / Admin

---

# Authentication & Registration Flow

1. Student registers via `/api/auth/register-student` providing Student ID number and uploading ID card photo (no role parameter required).
2. Backend uploads the ID card photo directly to **Cloudinary CDN** and stores the secure image URL.
3. User verification status is set to **Pending** (`IsVerified = false`).
4. Admin reviews pending verifications at `/api/student-verification/pending` using the ID card photo.
5. Admin approves or rejects the student registration (`/api/student-verification/{id}/approve` or `reject`).
6. Upon approval (`IsVerified = true`), the student logs in via `/api/auth/login` and receives JWT access and refresh tokens.

---

# Modules & Features

## 1. Authentication
- Register Student (`POST /api/auth/register-student` - no role field needed)
- Register Club Admin (`POST /api/auth/register-club-admin`)
- General Register (`POST /api/auth/register`)
- Login (`POST /api/auth/login`)
- Logout (`POST /api/auth/logout`)
- Refresh Token (`POST /api/auth/refresh-token`)
- Current User (`GET /api/auth/me`)

## 2. Student Verification
- Upload Student ID Card photo to Cloudinary (`POST /api/student-verification/upload`)
- Store Cloudinary URL on User & StudentVerification record
- Pending approval queue (`GET /api/student-verification/pending`)
- Admin Approve/Reject with reason (`PATCH /api/student-verification/{id}/approve` & `reject`)
- Get verification status (`GET /api/student-verification/status`)

## 3. Users
- Profile (`GET & PATCH /api/users/profile`)
- Admin list users with filters (`GET /api/users`)
- Admin get user details (`GET /api/users/{id}`)
- Role management (`PATCH /api/users/{id}/role`)
- Delete user (`DELETE /api/users/{id}`)

## 4. Clubs
- Apply for new Club Creation (`POST /api/clubs/apply`)
- Admin pending application queue (`GET /api/clubs/pending`)
- Admin approve/reject club (`PATCH /api/clubs/{id}/approve` & `reject`)
- CRUD Active Clubs, Categories, Search (`GET & PATCH & DELETE /api/clubs`)

## 5. Memberships
- Apply to join club (`POST /api/clubs/{clubId}/apply`)
- Approve membership (`PATCH /api/memberships/{id}/approve`)
- Reject membership with reason (`PATCH /api/memberships/{id}/reject`)
- Leave club (`POST /api/clubs/{clubId}/leave`)

## 6. Events
- CRUD Events
- Free/Paid events
- Registration & Capacity limits
- Registration deadline

## 7. Payments (Stripe)
- Create Stripe Checkout Session (`POST /api/payments/create`)
- Webhook callback / payment confirmation (`POST /api/payments/confirm`)
- Customer payment history (`GET /api/payments`)
- Payment details by ID (`GET /api/payments/{id}`)

## 8. Notifications
- List user notifications with pagination & read status filtering (`GET /api/notifications`)
- Unread notification count badge (`GET /api/notifications/unread-count`)
- Single notification lookup (`GET /api/notifications/{id}`)
- Mark as read / mark all as read (`PATCH /api/notifications/{id}/read` & `read-all`)
- Delete notification (`DELETE /api/notifications/{id}`)
- Broadcast notification to club members (`POST /api/notifications/broadcast`)

## 9. Announcements
- CRUD Bulletins
- Pin announcement

## 10. Dashboard
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
│   ├── MembershipDtos.cs
│   ├── UserDtos.cs
│   ├── DashboardDtos.cs
│   ├── PaymentDtos.cs
│   └── NotificationDtos.cs
├── Models/
│   ├── user.cs
│   ├── StudentVerification.cs
│   ├── Club.cs
│   ├── Membership.cs
│   ├── Event.cs
│   ├── EventRegistration.cs
│   ├── Payment.cs
│   ├── Announcement.cs
│   └── Notification.cs
├── Services/
│   └── CloudinaryService.cs
└── Modules/
    ├── auth/
    ├── student-verification/
    ├── user/
    ├── club/
    ├── membership/
    ├── payment/
    ├── notification/
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
| POST | /api/clubs/{clubId}/apply | Student |
| PATCH | /api/memberships/{id}/approve | Club Admin |
| PATCH | /api/memberships/{id}/reject | Club Admin |
| POST | /api/clubs/{clubId}/leave | Student |

## Event Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/events | Club Admin |
| GET | /api/events | Public |
| GET | /api/events/{id} | Public |
| PATCH | /api/events/{id} | Club Admin / Owner |
| DELETE | /api/events/{id} | Club Admin / Owner |
| POST | /api/events/{id}/register | Student |
| GET | /api/events/{id}/registrations | Club Admin / Owner |

## Payment Endpoints (Stripe)

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/payments/create | Student |
| POST | /api/payments/confirm | Public / Webhook |
| GET | /api/payments | Student |
| GET | /api/payments/{id} | Student / System Admin |

## Announcement Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/announcements | Club Admin |
| GET | /api/announcements | Public |
| GET | /api/announcements/{id} | Public |
| PATCH | /api/announcements/{id} | Club Admin / Owner |
| DELETE | /api/announcements/{id} | Club Admin / Owner |
| PATCH | /api/announcements/{id}/pin | Club Admin / Owner |

## Notification Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/notifications | Private |
| GET | /api/notifications/unread-count | Private |
| GET | /api/notifications/{id} | Private |
| PATCH | /api/notifications/{id}/read | Private |
| PATCH | /api/notifications/read-all | Private |
| DELETE | /api/notifications/{id} | Private |
| POST | /api/notifications/broadcast | Club Admin |

## Dashboard Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/dashboard/student | Student |
| GET | /api/dashboard/club-admin | Club Admin |
| GET | /api/dashboard/admin | System Admin |

---

# Database Entities

- **User** - (Id, Email, PasswordHash, FullName, Role, StudentId, IdCardImageUrl, IsVerified, RefreshToken, CreatedAt, UpdatedAt)
- **StudentVerification** - (Id, UserId, StudentId, DocumentPath, Status, ApprovedAt, RejectionReason, CreatedAt)
- **Club** - (Id, Name, Description, Category, OwnerId, LogoUrl, Status, IsActive, RejectionReason, ApprovedAt, CreatedAt, UpdatedAt)
- **Membership** - (Id, UserId, ClubId, Status, AppliedAt, ApprovedAt, LeftAt, RejectionReason, CreatedAt)
- **Event** - (Id, ClubId, Title, Description, Date, Venue, Price, Capacity, RegistrationDeadline, CreatedAt, UpdatedAt)
- **EventRegistration** - (Id, EventId, UserId, PaymentStatus, RegisteredAt, CreatedAt)
- **Payment** - (Id, UserId, EventId, Amount, Currency, Status, SessionId, PaymentMethod, CreatedAt, PaidAt)
- **Announcement** - (Id, ClubId, AuthorId, Title, Content, IsPinned, CreatedAt, UpdatedAt)
- **Notification** - (Id, UserId, ClubId, Title, Message, Type, IsRead, CreatedAt)

---

# Workflow Examples

## Student Registration & Verification Workflow

1. Student registers via `POST /api/auth/register-student` providing Student ID number and uploading ID card photo.
2. Backend uploads ID card photo to **Cloudinary CDN** and saves the returned image URL.
3. User verification status is set to **Pending** (`IsVerified = false`).
4. Admin reviews pending verifications at `GET /api/student-verification/pending` using the ID card photo preview.
5. Admin approves via `PATCH /api/student-verification/{id}/approve` or rejects via `PATCH /api/student-verification/{id}/reject` with reason.
6. Upon approval, `IsVerified` becomes `true` and the student gains full access.

## Club Creation & Approval Workflow

1. User applies for club creation via `POST /api/clubs/apply` with club name, description, and logo image.
2. Backend uploads logo to **Cloudinary** and saves the returned URL.
3. Club status is set to **Pending** review.
4. Admin reviews pending club applications at `GET /api/clubs/pending`.
5. Admin approves via `PATCH /api/clubs/{id}/approve` (auto-promotes applicant to ClubAdmin role) or rejects via `PATCH /api/clubs/{id}/reject`.
6. Upon approval, club becomes **Active** and the owner becomes **Club Admin**.

## Membership Application Workflow

1. Student applies to join a club via `POST /api/clubs/{clubId}/apply`.
2. Application is created with **Pending** status.
3. Club Admin reviews pending membership requests at the club management dashboard.
4. Club Admin approves via `PATCH /api/memberships/{id}/approve` or rejects via `PATCH /api/memberships/{id}/reject` with reason.
5. Upon approval, student becomes an active club member and receives a notification.

## Event Registration & Stripe Payment Workflow

1. Student views available events via `GET /api/events` and selects a paid event.
2. Student initiates payment via `POST /api/payments/create` with event ID and amount.
3. Backend creates a **Stripe Checkout Session** using `Stripe.net` SDK and returns the checkout URL.
4. Student completes payment on Stripe Sandbox hosted checkout page.
5. Stripe triggers `POST /api/payments/confirm` webhook, updating payment status to **Paid** and recording timestamp.
6. Event registration is created with PaymentStatus = **Paid** and student receives confirmation notification.

## Notification & Broadcast Workflow

1. Club Admin sends a broadcast notification via `POST /api/notifications/broadcast` with title and message.
2. Backend creates notifications for all active club members.
3. Students receive notifications at `GET /api/notifications` with unread count badge at `GET /api/notifications/unread-count`.
4. Student marks notifications as read via `PATCH /api/notifications/{id}/read`.
5. Student can delete notifications via `DELETE /api/notifications/{id}`.

---

# Middleware & Environment Setup

- JWT Authentication & Cookie handling
- Authorization Policies
- Global JSON Exception Formatting
- Environment configuration via `.env` (Database Connection, JWT Secret, Cloudinary CDN, Stripe Sandbox Keys)