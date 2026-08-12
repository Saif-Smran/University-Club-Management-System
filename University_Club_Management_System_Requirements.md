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

- Student registration requires **System Admin approval**.
- Students must upload their **University ID** (PDF/JPG/JPEG/PNG).
- Image uploads are automatically **converted to PDF** by the ASP.NET backend before storage.
- Students can only log in after approval.
- Clubs can create **free or paid events**.
- Paid events require successful payment before registration is confirmed.
- Club admins manage memberships, events, and announcements.
- System admins manage users, clubs, and platform moderation.

---

# User Roles

## Student

- Register account
- Upload University ID
- Wait for admin approval
- Login after approval
- Browse clubs
- Apply for membership
- Register for free or paid events
- View announcements
- Manage profile

## Club Admin

- Manage clubs
- Approve memberships
- Manage members
- Create/Edit/Delete events
- Create announcements
- View event registrations

## System Admin

- Approve or reject new student registrations
- Review uploaded ID documents
- Manage users
- Manage clubs
- Assign Club Admins
- View analytics

---

# Expected Features

## Authentication

- Registration
- Login
- Logout
- JWT Authentication
- Refresh Tokens
- Role Based Authorization
- Change Password
- Admin Approval Workflow

## Student Verification

- Upload ID Card
- Accept PDF/JPG/JPEG/PNG
- Convert images to PDF
- Store PDF
- Pending approval
- Approve/Reject

## Club Management

- CRUD Clubs
- Categories
- Search
- Member Management

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
- ASP.NET Identity
- JWT
- AutoMapper
- FluentValidation
- Serilog
- Swagger

---

# Backend Task Distribution

## Member 1 (Leader) Smran

- Authentication
- JWT
- Authorization
- Student Verification
- User Management
- Dashboard APIs
- Database Design done
- API Documentation done
- Complete Next.js Frontend

## Member 2 Araf

- Club Module
- Membership Module

## Member 3 Sharika

- Event Module
- Payment Module
- Announcement Module

---

# Database Entities

- User
- Club
- Membership
- Event
- EventRegistration
- Payment
- StudentVerification
- Announcement

---

# Main APIs

## Authentication

| Method | Endpoint | Purpose |
|---|---|---|
|POST|/api/auth/register|Register student (Pending Approval)|
|POST|/api/auth/login|Login approved users|
|POST|/api/auth/logout|Logout|
|POST|/api/auth/refresh-token|Refresh JWT|
|GET|/api/auth/me|Current user|

## Student Verification

| Method | Endpoint | Purpose |
|---|---|---|
|POST|/api/student-verification/upload|Upload ID (image/PDF)|
|GET|/api/student-verification/pending|Pending approvals|
|PATCH|/api/student-verification/{id}/approve|Approve student|
|PATCH|/api/student-verification/{id}/reject|Reject student|

## Clubs

| Method | Endpoint | Purpose |
|---|---|---|
|POST|/api/clubs|Create club|
|GET|/api/clubs|List clubs|
|GET|/api/clubs/{id}|Club details|
|PATCH|/api/clubs/{id}|Update club|
|DELETE|/api/clubs/{id}|Delete club|

## Membership

| Method | Endpoint | Purpose |
|---|---|---|
|POST|/api/clubs/{id}/apply|Apply to club|
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

---

# Registration Workflow

1. Student registers.
2. Uploads university ID.
3. Backend converts image to PDF if necessary.
4. Account status becomes **Pending**.
5. System Admin reviews the document.
6. Admin approves or rejects.
7. Approved students can log in.

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
