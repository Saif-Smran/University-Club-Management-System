# University Club Management System (UCMS)

## Course Project Proposal

**Backend:** ASP.NET Core 10 Web API  
**Frontend:** Next.js 16 (App Router) + TypeScript  
**Database:** PostgreSQL  
**Team Size:** 3 Members

---

# Project Overview

The University Club Management System (UCMS) is a full-stack web application for managing university clubs, student memberships, events, announcements, and paid event registrations.

Key enhancements:

- Student registration requires **Admin approval**.
- Students register with their **Student ID Number** and **Student ID Card photo** (no role selection required).
- ID Card photos and Club logos are uploaded directly to **Cloudinary CDN** via the ASP.NET backend.
- Account verification status is set to `Pending` until an Admin reviews and approves the ID card photo.
- Users can apply to create a new **Club**; Admins review and approve/reject club creation requests.
- Clubs can create **free or paid events**.
- Paid events require successful payment before registration is confirmed.
- Club admins manage memberships, events, and announcements.
- System admins manage users, clubs, student verifications, and platform moderation.

---

# User Roles

## Student

- Register account (provides Student ID & ID card photo)
- Upload/re-upload Student ID photo to Cloudinary
- Wait for admin ID photo verification & approval
- Login after verification
- Apply to create a new club
- Browse clubs
- Apply for membership
- Register for free or paid events
- View announcements
- Manage profile

## Club Admin

- Apply for club creation and manage active clubs
- Approve memberships
- Manage members
- Create/Edit/Delete events
- Create announcements
- View event registrations

## System Admin

- Review and approve or reject new student registrations using ID card photos
- Review pending club creation applications and approve/reject
- Manage users & user roles
- View dashboard metrics & platform analytics

---

# Expected Features

## Authentication

- Student Registration (`/api/auth/register-student` - no role field needed)
- Club Admin Registration (`/api/auth/register-club-admin`)
- Login
- Logout
- JWT Authentication
- Refresh Tokens
- Role Based Authorization
- Admin Student Verification Workflow

## Student Verification

- Upload Student ID Card photo to Cloudinary
- Store Cloudinary Image URL on User & StudentVerification record
- Pending approval state
- Admin Approve/Reject with reason

## Club Management & Application

- Apply for new Club Creation (Status: Pending)
- Admin review & Approve/Reject club application
- Upgrade applicant role to ClubAdmin upon approval
- CRUD Clubs, Categories, Search

## Membership

- Apply
- Approve
- Reject
- Leave Club

## Events

- Create/Edit/Delete
- Free & Paid Events
- Registration
- Capacity
- Registration Deadline

## Payments

- Payment Gateway Integration
- Payment History
- Transaction Records
- Event Fee Support

## Announcements

- CRUD
- Pin Announcement

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
- C#
- Entity Framework Core
- PostgreSQL
- Cloudinary (`CloudinaryDotNet`)
- JWT & Refresh Tokens
- Swagger & `.http` test suite

---

# Backend Task Distribution

## Member 1 (Leader) Smran

- ✅ Authentication (JWT, Refresh Tokens, Logout, Role-based policies)
- ✅ Student Verification (Cloudinary ID photo upload, Admin approval flow)
- ✅ User Management (Profile, List users, Role changes, Deletion)
- ✅ Club Application & Approval Flow (Apply, Pending queue, Admin Approve/Reject)
- ✅ Dashboard APIs (Admin, Club Admin, Student metrics)
- ✅ Database Schema & Seed Data (`Seed.cs`)
- ✅ API Documentation & `.http` test suite
- Next.js Frontend needed to complete

## Member 2 Araf

- Club Module
- Membership Module

## Member 3 Sharika

- Event Module
- Payment Module
- Announcement Module

---

# Database Entities

- User (with StudentId, IdCardImageUrl, Role, IsVerified)
- Club (with Status, RejectionReason, ApprovedAt, ApprovedBy)
- Membership
- Event
- EventRegistration
- Payment
- StudentVerification (with StudentId, DocumentPath, Status)
- Announcement

---

# Main APIs

## Authentication

| Method | Endpoint | Purpose |
|---|---|---|
|POST|/api/auth/register-student|Register student with ID number & ID photo (Pending Approval)|
|POST|/api/auth/register-club-admin|Register club admin account|
|POST|/api/auth/login|Login approved users|
|POST|/api/auth/logout|Logout|
|POST|/api/auth/refresh-token|Refresh JWT token|
|GET|/api/auth/me|Get current user profile|

## Student Verification

| Method | Endpoint | Purpose |
|---|---|---|
|POST|/api/student-verification/upload|Upload ID card photo to Cloudinary|
|GET|/api/student-verification/pending|List pending verifications (Admin only)|
|PATCH|/api/student-verification/{id}/approve|Approve student ID (Admin only)|
|PATCH|/api/student-verification/{id}/reject|Reject student ID with reason (Admin only)|
|GET|/api/student-verification/status|Get student verification status|

## Clubs

| Method | Endpoint | Purpose |
|---|---|---|
|POST|/api/clubs/apply|Apply for new club creation (Status: Pending)|
|GET|/api/clubs/pending|List pending club applications (Admin only)|
|PATCH|/api/clubs/{id}/approve|Approve & activate club (Admin only)|
|PATCH|/api/clubs/{id}/reject|Reject club application (Admin only)|
|GET|/api/clubs|List active approved clubs|
|GET|/api/clubs/{id}|Get club details|
|PATCH|/api/clubs/{id}|Update club|
|DELETE|/api/clubs/{id}|Delete club|

## Membership

| Method | Endpoint | Purpose |
|---|---|---|
|POST|/api/clubs/{id}/apply|Apply to join club|
|PATCH|/api/memberships/{id}/approve|Approve membership|
|PATCH|/api/memberships/{id}/reject|Reject membership|

## Events

| Method | Endpoint | Purpose |
|---|---|---|
|POST|/api/events|Create event|
|GET|/api/events|List events|
|POST|/api/events/{id}/register|Register for event|

## Payments

| Method | Endpoint | Purpose |
|---|---|---|
|POST|/api/payments/create-session|Start payment|
|POST|/api/payments/webhook|Receive payment callback|
|GET|/api/payments/{id}|Payment details|

## Announcements

| Method | Endpoint | Purpose |
|---|---|---|
|POST|/api/announcements|Create announcement|
|GET|/api/announcements|List announcements|

## Dashboard APIs

| Method | Endpoint | Purpose |
|---|---|---|
|GET|/api/dashboard/admin|System Admin dashboard statistics|
|GET|/api/dashboard/club-admin|Club Admin dashboard statistics|
|GET|/api/dashboard/student|Student dashboard statistics|

---

# Registration Workflow

1. Student registers via `/api/auth/register-student` providing Student ID number and uploading ID card photo.
2. Backend uploads ID card photo to **Cloudinary** and saves the returned image URL.
3. User verification status is set to **Pending** (`IsVerified = false`).
4. Admin reviews pending verifications at `/api/student-verification/pending` using the ID card photo.
5. Admin approves or rejects the student registration.
6. Upon approval, `IsVerified` becomes `true` and the student gains full access.

---

# Paid Event Workflow

1. Student selects paid event.
2. Payment session is created.
3. Student completes payment.
4. Payment is verified.
5. Registration is confirmed.

---

# Future Enhancements

- QR Check-in
- Email Verification
- SignalR Notifications
- Mobile App
- AI Event Recommendations
- Certificate Generation
