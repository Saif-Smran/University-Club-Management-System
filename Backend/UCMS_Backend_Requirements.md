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

## Payment Endpoints (Stripe)

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/payments/create | Student |
| POST | /api/payments/confirm | Public / Webhook |
| GET | /api/payments | Student |
| GET | /api/payments/{id} | Student / System Admin |

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

- **User**
- **StudentVerification**
- **Club**
- **Membership**
- **Event**
- **EventRegistration**
- **Payment**
- **Announcement**
- **Notification**

---

# Middleware & Environment Setup

- JWT Authentication & Cookie handling
- Authorization Policies
- Global JSON Exception Formatting
- Environment configuration via `.env` (Database Connection, JWT Secret, Cloudinary CDN, Stripe Sandbox Keys)