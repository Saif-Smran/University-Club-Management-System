# University Club Management System (UCMS)

# Frontend Requirements Document

**Framework:** Next.js 16 (App Router)  
**Language:** TypeScript  
**Styling:** Tailwind CSS + shadcn/ui  
**State Management:** TanStack Query + React Context  
**Form Validation:** React Hook Form + Zod  
**Authentication:** JWT + HTTP Only Cookies  
**Deployment:** Vercel

---

# 1. Frontend Overview

The frontend is responsible for providing an intuitive, responsive, and secure user experience for all users of the University Club Management System.

The application will communicate with the ASP.NET Core 10 REST API.

The frontend will:

- Authenticate users
- Display clubs
- Manage memberships
- Handle payments
- Display dashboards
- Allow admins to manage clubs
- Display announcements
- Register students for events
- Upload Student ID cards
- Handle protected routes

---

# 2. User Roles

There are three user roles.

## Student

Permissions

- Register
- Login
- Browse Clubs
- Apply for Clubs
- Register for Events
- Pay Event Fees
- View Announcements
- Update Profile

---

## Club Admin

Everything Student can do plus

- Manage Clubs
- Manage Members
- Create Events
- Manage Events
- Create Announcements
- View Payments
- View Registrations

---

## System Admin

Everything Club Admin can do plus

- Approve Student Registrations
- Review Student ID PDFs
- Manage Users
- Assign Club Admins
- View System Statistics

---

# 3. Frontend Pages

---

## Public Pages

### Landing Page

Route

```
/
```

Contains

- Hero Section
- About UCMS
- Featured Clubs
- Upcoming Events
- Statistics
- CTA Buttons
- Footer

---

### Clubs

```
/clubs
```

Displays

- Club Cards
- Search
- Categories
- Filters
- Pagination

Each card shows

- Logo
- Name
- Description
- Member Count
- Category

---

### Club Details

```
/clubs/[clubId]
```

Contains

- Club Banner
- Club Information
- Members
- Upcoming Events
- Announcements
- Join Button

---

### Events

```
/events
```

Contains

- Upcoming Events
- Search
- Filter
- Event Cards

---

### Event Details

```
/events/[eventId]
```

Displays

- Banner
- Description
- Organizer
- Registration Fee
- Seats Remaining
- Register Button

---

## Authentication Pages

### Login

```
/login
```

Contains

- Email
- Password
- Remember Me
- Forgot Password

---

### Register

```
/register
```

Contains

- Full Name
- Email
- Student ID (Card Number)
- Password
- Upload Student ID Card Image (Cloudinary)

Note: No role selection parameter is required (defaults automatically to Student role).

Accepted image formats

- JPG
- PNG
- JPEG
- WEBP

After submission

Display

```
Your account and student ID photo have been submitted for review.

Please wait for admin verification approval.
```

---

### Unauthorized

```
/unauthorized
```

Shown when user tries accessing protected pages.

---

## Student Pages

### Dashboard

```
/dashboard
```

Contains

Cards

- Joined Clubs
- Upcoming Events
- Pending Applications
- Registered Events

Recent Activities

Upcoming Events

Announcements

---

### Profile

```
/dashboard/profile
```

Contains

- Profile Picture
- Student Information
- Department
- Student ID
- Joined Clubs

---

### My Clubs

```
/dashboard/my-clubs
```

Displays

- Joined Clubs
- Membership Status

---

### My Events

```
/dashboard/my-events
```

Displays

- Registered Events
- Payment Status

---

### Payment History

```
/dashboard/payments
```

Displays

- Transaction ID
- Amount
- Event
- Date
- Status

---

## Club Admin Pages

### Club Dashboard

```
/club-admin
```

Cards

- Members
- Pending Requests
- Events
- Announcements

---

### Manage Clubs

```
/club-admin/clubs
```

CRUD

---

### Membership Requests

```
/club-admin/memberships
```

Actions

- Approve
- Reject

---

### Manage Events

```
/club-admin/events
```

CRUD

---

### Create Event

```
/club-admin/events/create
```

Fields

- Title
- Description
- Banner
- Date
- Venue
- Free/Paid
- Registration Fee
- Capacity

---

### Event Participants

```
/club-admin/events/[eventId]
```

Shows

- Registered Students
- Payment Status

---

### Announcements

```
/club-admin/announcements
```

CRUD

---

## System Admin Pages

### Admin Dashboard

```
/admin
```

Statistics

- Users
- Clubs
- Events
- Revenue

---

### Pending Student Approvals

```
/admin/student-approvals
```

Displays

Table

- Name
- Email
- Student ID (Card Number)
- ID Card Photo (Cloudinary Image Preview URL)

Buttons

- View ID Photo (Enlarge/Modal)
- Approve
- Reject (with reason dialog)

---

### User Management

```
/admin/users
```

CRUD

---

### Club Management

```
/admin/clubs
```

CRUD

---

### Assign Club Admin

```
/admin/assign-admin
```

Assign users as Club Admin.

---

# 4. Route Structure

```
/

/login

/register

/clubs

/clubs/[clubId]

/events

/events/[eventId]

/dashboard

/dashboard/profile

/dashboard/my-clubs

/dashboard/my-events

/dashboard/payments

/club-admin

/club-admin/clubs

/club-admin/memberships

/club-admin/events

/club-admin/events/create

/club-admin/events/[eventId]

/club-admin/announcements

/admin

/admin/users

/admin/clubs

/admin/student-approvals

/admin/assign-admin

/unauthorized

/not-found
```

Total Pages

Approximately **22-25 pages**

---

# 5. Application Flow

## Student Registration

```
Landing

↓

Register

↓

Upload Student ID

↓

Backend converts Image → PDF

↓

Pending Approval

↓

Admin Reviews

↓

Approved

↓

Login

↓

Dashboard
```

---

## Joining Club

```
Dashboard

↓

Browse Clubs

↓

Club Details

↓

Apply

↓

Club Admin

↓

Approve

↓

Student becomes Member
```

---

## Paid Event Flow

```
Dashboard

↓

Events

↓

Event Details

↓

Register

↓

Payment Gateway

↓

Payment Success

↓

Registration Complete

↓

My Events
```

---

## Club Admin Flow

```
Login

↓

Club Dashboard

↓

Manage Club

↓

Approve Members

↓

Create Events

↓

Create Announcements
```

---

## System Admin Flow

```
Login

↓

Admin Dashboard

↓

Student Approvals

↓

Review PDF

↓

Approve

↓

Student Can Login
```

---

# 6. Layout Structure

```
Root Layout

├── Navbar
├── Main Content
└── Footer
```

Dashboard

```
Dashboard Layout

├── Sidebar
├── Topbar
├── Breadcrumb
├── Page Content
└── Footer
```

---

# 7. Components

## Shared Components

- Navbar
- Footer
- Sidebar
- User Avatar
- Search Bar
- Pagination
- Data Table
- Loading Spinner
- Empty State
- Modal
- Confirmation Dialog
- Breadcrumb
- Card
- Badge
- Toast

---

## Club Components

- Club Card
- Member Card
- Join Button
- Club Banner

---

## Event Components

- Event Card
- Registration Button
- Payment Badge
- Participant List

---

## Admin Components

- Approval Table
- User Table
- Statistics Cards
- Charts

---

# 8. State Management

## React Context

Store

- Current User
- Theme
- Sidebar State

---

## TanStack Query

Handles

- Clubs
- Events
- Members
- Announcements
- Payments
- Dashboard Data

---

# 9. Form Validation

React Hook Form

+

Zod

Forms

- Login
- Register
- Club
- Event
- Announcement
- Profile
- Payment

---

# 10. File Upload Flow

Student uploads

```
student-id.jpg
```

↓

Frontend Preview

↓

POST API

↓

ASP.NET

↓

Convert to PDF

↓

Save

↓

Pending Approval

---

# 11. Suggested File Structure

```text
src/

├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── clubs/
│   │   ├── events/
│   │   ├── login/
│   │   └── register/
│   │
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── my-clubs/
│   │   ├── my-events/
│   │   └── payments/
│   │
│   ├── (club-admin)/
│   │   ├── club-admin/
│   │   ├── clubs/
│   │   ├── memberships/
│   │   ├── events/
│   │   └── announcements/
│   │
│   ├── (admin)/
│   │   ├── admin/
│   │   ├── users/
│   │   ├── clubs/
│   │   ├── student-approvals/
│   │   └── assign-admin/
│   │
│   ├── api/
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
│
├── components/
│   ├── common/
│   ├── ui/
│   ├── forms/
│   ├── clubs/
│   ├── events/
│   ├── dashboard/
│   ├── admin/
│   └── charts/
│
├── lib/
│   ├── axios.ts
│   ├── auth.ts
│   ├── constants.ts
│   └── utils.ts
│
├── hooks/
├── services/
├── providers/
├── context/
├── types/
├── schemas/
├── middleware.ts
└── assets/
```

---

# 12. Expected UI

The UI should follow a modern dashboard design using **shadcn/ui** with:

- Responsive layouts
- Light and Dark mode
- Clean cards and tables
- Dashboard charts
- Toast notifications
- Skeleton loading states
- Consistent spacing and typography
- Accessible form components
- Mobile-friendly navigation

The overall design should resemble a modern SaaS dashboard, providing an intuitive experience for students, club administrators, and system administrators.