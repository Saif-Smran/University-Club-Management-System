# University Club Management System (UCMS)

## Course Project Proposal

**Backend:** ASP.NET Core 10 Web API  
**Frontend:** Next.js 16 (App Router) + TypeScript  
**Database:** PostgreSQL  
**Team Size:** 3 Members

---

# Project Overview

The University Club Management System (UCMS) is a full-stack web application for managing university clubs, student memberships, events, announcements, notifications, and paid event registrations.

Key features:

- Student registration requires **Admin approval**.
- Students register with their **Student ID Number** and **Student ID Card photo** (no role selection required).
- ID Card photos and Club logos are uploaded directly to **Cloudinary CDN** via the ASP.NET backend.
- Account verification status is set to `Pending` until an Admin reviews and approves the ID card photo.
- Users can apply to create a new **Club**; Admins review and approve/reject club creation requests.
- Clubs can create **free or paid events**.
- Paid events integrate with **Stripe Sandbox** for secure checkout session creation and webhook confirmation.
- Members receive **In-App Notifications** for club broadcasts, system events, and status updates.
- Club admins manage memberships, events, announcements, and member broadcasts.
- System admins manage users, clubs, student verifications, and platform moderation.

---

# User Roles

## Student

- Register account (provides Student ID & ID card photo)
- Upload/re-upload Student ID photo to Cloudinary
- Wait for admin ID photo verification & approval
- Login after verification
- Apply to create a new club
- Browse active approved clubs
- Apply for club membership & leave club
- Register for free or paid events with Stripe Checkout
- Receive in-app notifications and mark as read
- View announcements
- Manage profile & payment history

## Club Admin

- Apply for club creation and manage active clubs
- Approve or reject membership requests
- Manage members
- Create/Edit/Delete events
- Create announcements
- Broadcast notifications to all active club members
- View event registrations & payment records

## System Admin

- Review and approve or reject new student registrations using ID card photos
- Review pending club creation applications and approve/reject (auto-promotes owner to ClubAdmin)
- Manage users & user roles
- Delete users & clubs
- View dashboard metrics & platform analytics

---

# Expected Features

## Authentication

- Student Registration (`/api/auth/register-student` - no role field needed)
- Club Admin Registration (`/api/auth/register-club-admin`)
- Login (`/api/auth/login`)
- Logout (`/api/auth/logout`)
- JWT Authentication & Cookie Storage
- Refresh Tokens (`/api/auth/refresh-token`)
- Role Based Authorization & Get Current User (`/api/auth/me`)

## Student Verification

- Upload Student ID Card photo to Cloudinary
- Store Cloudinary Image URL on User & StudentVerification record
- Pending approval state
- Admin Approve/Reject with reason (`/api/student-verification/{id}/approve` & `reject`)
- Verification Status Check (`/api/student-verification/status`)

## Club Management & Application

- Apply for new Club Creation (`/api/clubs/apply`, Status: Pending)
- Admin review & Approve/Reject club application
- Upgrade applicant role to ClubAdmin upon approval
- CRUD Clubs, Categories, Search (`/api/clubs`)

## Membership

- Apply to join club (`POST /api/clubs/{clubId}/apply`)
- Approve membership (`PATCH /api/memberships/{id}/approve`)
- Reject membership with reason (`PATCH /api/memberships/{id}/reject`)
- Leave Club (`POST /api/clubs/{clubId}/leave`)

## Events

- Create/Edit/Delete Events
- Free & Paid Events
- Registration & Capacity tracking
- Registration Deadline

## Payments (Stripe Integration)

- Stripe Checkout Session Creation (`POST /api/payments/create`)
- Webhook & Confirmation callback (`POST /api/payments/confirm`)
- Customer Payment History (`GET /api/payments`)
- Payment details by ID (`GET /api/payments/{id}`)

## Notifications

- List user notifications with filtering & pagination (`GET /api/notifications`)
- Unread badge count (`GET /api/notifications/unread-count`)
- Notification details (`GET /api/notifications/{id}`)
- Mark single/all as read (`PATCH /api/notifications/{id}/read` & `read-all`)
- Delete notification (`DELETE /api/notifications/{id}`)
- Broadcast message to club members (`POST /api/notifications/broadcast`)

## Announcements

- CRUD Bulletins & Pinned Posts

---

# Technologies

## Frontend

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Hook Form
- Zod
- Axios
- Recharts

## Backend

- ASP.NET Core 10 Web API
- C# 13
- Entity Framework Core 10
- PostgreSQL
- Cloudinary (`CloudinaryDotNet`)
- Stripe (`Stripe.net`)
- JWT & Refresh Tokens
- `.http` test suite & Swagger / OpenAPI

---

# Backend Task Distribution & Status

## Member 1 (Leader) Smran

- ✅ Authentication (JWT, Refresh Tokens, Logout, Role-based policies)
- ✅ Student Verification (Cloudinary ID photo upload, Admin approval flow)
- ✅ User Management (Profile, List users, Role changes, Deletion)
- ✅ Club Application & Approval Flow (Apply, Pending queue, Admin Approve/Reject)
- ✅ Membership Module (Apply, Approve, Reject, Leave)
- ✅ Payment Module (Stripe Sandbox Checkout & Webhook Confirmation)
- ✅ Notification Module (In-App notifications, Unread counts, Read state, Club Broadcast)
- ✅ Dashboard APIs (Admin, Club Admin, Student metrics)
- ✅ Database Schema, Migrations & Seed Data (`Seed.cs`)
- ✅ API Documentation & `.http` test suite
- Next.js Frontend integration

## Member 2 Araf

- Frontend Club & Membership UI Components

## Member 3 Sharika

- Frontend Events, Payments & Announcements UI Components

---

# Database Entities

- **User** (Id, Email, PasswordHash, FullName, Role, StudentId, IdCardImageUrl, IsVerified, RefreshToken)
- **StudentVerification** (Id, UserId, StudentId, DocumentPath, Status, ApprovedAt, RejectionReason)
- **Club** (Id, Name, Description, Category, OwnerId, LogoUrl, Status, IsActive, RejectionReason, ApprovedAt)
- **Membership** (Id, UserId, ClubId, Status, AppliedAt, ApprovedAt, LeftAt, RejectionReason)
- **Event** (Id, ClubId, Title, Description, Date, Venue, Price, Capacity, RegistrationDeadline)
- **EventRegistration** (Id, EventId, UserId, PaymentStatus, RegisteredAt)
- **Payment** (Id, UserId, EventId, Amount, Currency, Status, SessionId, PaymentMethod, CreatedAt, PaidAt)
- **Announcement** (Id, ClubId, AuthorId, Title, Content, IsPinned, CreatedAt)
- **Notification** (Id, UserId, ClubId, Title, Message, Type, IsRead, CreatedAt)

---

# Main APIs Reference

## Authentication

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
|POST|/api/auth/register-student|Register student with ID number & ID photo|Public|
|POST|/api/auth/register-club-admin|Register club admin account|Public|
|POST|/api/auth/login|Login verified users|Public|
|POST|/api/auth/logout|Logout and clear token cookies|Private|
|POST|/api/auth/refresh-token|Refresh JWT token|Public|
|GET|/api/auth/me|Get current authenticated user profile|Private|

## Student Verification

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
|POST|/api/student-verification/upload|Upload ID card photo to Cloudinary|Student|
|GET|/api/student-verification/pending|List pending verifications|Admin only|
|PATCH|/api/student-verification/{id}/approve|Approve student ID|Admin only|
|PATCH|/api/student-verification/{id}/reject|Reject student ID with reason|Admin only|
|GET|/api/student-verification/status|Get student verification status|Student|

## User Management

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
|GET|/api/users/profile|Get my profile|Private|
|PATCH|/api/users/profile|Update my profile|Private|
|GET|/api/users|Get all users (with role & search filters)|Admin only|
|GET|/api/users/{id}|Get user details by ID|Admin only|
|PATCH|/api/users/{id}/role|Update user role|Admin only|
|DELETE|/api/users/{id}|Delete user account|Admin only|

## Clubs

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
|POST|/api/clubs/apply|Apply for new club creation (Status: Pending)|Student|
|GET|/api/clubs/pending|List pending club applications|Admin only|
|PATCH|/api/clubs/{id}/approve|Approve & activate club|Admin only|
|PATCH|/api/clubs/{id}/reject|Reject club application|Admin only|
|GET|/api/clubs|List active approved clubs|Public|
|GET|/api/clubs/{id}|Get club details|Public|
|PATCH|/api/clubs/{id}|Update club details/logo|Club Admin|
|DELETE|/api/clubs/{id}|Delete club|Admin/Owner|

## Membership

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
|POST|/api/clubs/{clubId}/apply|Apply to join club|Student|
|PATCH|/api/memberships/{id}/approve|Approve membership|Club Admin|
|PATCH|/api/memberships/{id}/reject|Reject membership with reason|Club Admin|
|POST|/api/clubs/{clubId}/leave|Leave club|Student|

## Payments (Stripe)

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
|POST|/api/payments/create|Create Stripe Checkout Session|Student|
|POST|/api/payments/confirm|Stripe Webhook & Payment confirmation|Public / Webhook|
|GET|/api/payments|Get logged-in user's payment history|Student|
|GET|/api/payments/{id}|Get payment transaction by ID|Student / Admin|

## Notifications

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
|GET|/api/notifications|Get my notifications (paginated, isRead filter)|Private|
|GET|/api/notifications/unread-count|Get unread notification count badge|Private|
|GET|/api/notifications/{id}|Get notification details|Private|
|PATCH|/api/notifications/{id}/read|Mark single notification as read|Private|
|PATCH|/api/notifications/read-all|Mark all notifications as read|Private|
|DELETE|/api/notifications/{id}|Delete notification|Private|
|POST|/api/notifications/broadcast|Broadcast notification to all club members|Club Admin|

## Dashboard APIs

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
|GET|/api/dashboard/admin|System Admin statistics|Admin only|
|GET|/api/dashboard/club-admin|Club Admin statistics|Club Admin|
|GET|/api/dashboard/student|Student statistics|Student|

---

# Registration Workflow

1. Student registers via `/api/auth/register-student` providing Student ID number and uploading ID card photo.
2. Backend uploads ID card photo to **Cloudinary** and saves the returned image URL.
3. User verification status is set to **Pending** (`IsVerified = false`).
4. Admin reviews pending verifications at `/api/student-verification/pending` using the ID card photo.
5. Admin approves or rejects the student registration.
6. Upon approval, `IsVerified` becomes `true` and the student gains full access.

---

# Paid Event & Stripe Payment Workflow

1. Student initiates payment via `POST /api/payments/create` with amount and registration metadata.
2. Backend initializes a **Stripe Checkout Session** using `Stripe.net` SDK and returns the checkout URL.
3. Student completes payment on Stripe Sandbox hosted checkout page.
4. Stripe triggers `POST /api/payments/confirm` webhook, updating payment status to `Paid` and recording timestamp.
5. Registration & receipt history updated under `/api/payments`.
