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
- Status & Stripe Receipt Link

---

### Notifications Center

```
/dashboard/notifications
```

Displays

- Notification List (Title, Message, Type, Time)
- Filter by All / Unread
- Mark as Read button
- Mark All as Read button
- Delete Notification

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
- Broadcast Notification to Members

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

# 4. API Integration & State Management

## Authentication State Management (AuthContext)
- **Provider**: `AuthContext.tsx` wraps the application with authentication state
- **Stored Data**: User profile, JWT token, refresh token, authentication status
- **Token Storage**: HTTP-only cookies (secure, httpOnly, sameSite flags)
- **Token Refresh**: Automatic refresh via Axios interceptor when token expires
- **Protected Routes**: Routes check `authContext.isAuthenticated` and redirect to `/login` if needed

## Data Fetching (TanStack Query)
- **Query Client**: Configured with default cache time and stale time
- **API Calls**: All data fetching uses TanStack Query hooks for:
  - Clubs list & details (`useQuery`)
  - Events listing & filtering (`useQuery`)
  - User profile & notifications (`useQuery`)
  - Dashboard statistics & analytics (`useQuery`)
- **Mutations**: Form submissions use `useMutation` for:
  - Login/Register (`/api/auth/login`, `/api/auth/register-student`)
  - Club application (`/api/clubs/apply`)
  - Membership approval/rejection
  - Event registration
  - Stripe payment session creation

## HTTP Client (Axios)
- **Base Configuration**: `lib/axios.ts` exports pre-configured Axios instance
- **JWT Interceptor**: Automatically adds Authorization header with JWT token
- **Error Handling**: Centralized error response handling & logging
- **Timeout**: 30 seconds default timeout for all API requests
- **Base URL**: Configured from environment variable `NEXT_PUBLIC_API_URL`

## Form Validation (React Hook Form + Zod)
- **Validation Schemas**: `lib/validation.ts` exports Zod schemas for:
  - Student registration form
  - Login form
  - Club creation form
  - Event creation form
  - Announcement creation
  - Profile update form
- **Error Display**: Real-time field-level validation errors
- **Submit Handling**: Form submission triggers API mutation via TanStack Query

## Theme Management (ThemeContext)
- **Provider**: `ThemeContext.tsx` manages light/dark mode state
- **Storage**: Theme preference persisted to localStorage
- **Tailwind Integration**: Uses `dark:` utility classes for dark mode styling

---

# 5. Component Organization

## Common Components (`/components/common`)
- Navigation sidebar & top navigation bar
- Footer
- Protected route wrapper
- Modals & dialogs
- Alert/Toast notifications
- Loading spinners & skeletons
- Pagination components

## Admin Components (`/components/admin`)
- Student verification queue UI
- User management table
- Club moderation panel
- Dashboard statistics widgets

## Club Components (`/components/clubs`)
- Club card display
- Club details view
- Membership application form
- Club search & filter UI
- Announcement display

## Event Components (`/components/events`)
- Event card display
- Event details modal
- Event registration form
- Event creation/edit forms
- Participant list table

## Payment Components (`/components/payment`)
- Stripe checkout redirect button
- Payment history table
- Payment status badge
- Stripe success/cancel handling

---

# 6. Type Definitions (`/types/index.ts`)

Exported TypeScript interfaces:
- `User` - User profile & authentication details
- `StudentVerification` - Verification document & approval status
- `Club` - Club entity & metadata
- `Membership` - Membership application & status
- `Event` - Event details & capacity tracking
- `EventRegistration` - Registration record & payment status
- `Payment` - Payment transaction & Stripe details
- `Announcement` - Bulletin & pinned post entity
- `Notification` - Notification feed entry
- `AdminDashboardStats` - Admin dashboard metrics
- `ClubAdminDashboardStats` - Club admin performance metrics
- `StudentDashboardStats` - Student profile & activity metrics
- `ApiResponse` - Standard API response wrapper

---

# 7. Implementation Status

## Completed Features
- ✅ Authentication flow (register, login, JWT handling)
- ✅ Student ID verification UI
- ✅ Club listing & discovery
- ✅ Club details page
- ✅ Event listing & search
- ✅ Dashboard layouts (student, club admin, system admin)
- ✅ User profile management
- ✅ Membership application workflow
- ✅ Notification center with read/unread toggle
- ✅ Payment history display
- ✅ Stripe payment integration
- ✅ Club admin management panels
- ✅ System admin control panels
- ✅ Form validation with Zod
- ✅ TanStack Query data fetching
- ✅ Theme switching (light/dark mode)

## UI Components Library Integration
- ✅ shadcn/ui components
- ✅ Tailwind CSS styling
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Accessibility features (ARIA labels, keyboard navigation)

---

# 8. API Endpoint Integration Map

| Frontend Page | HTTP Method | Endpoint | Purpose |
|---|---|---|---|
| /login | POST | /api/auth/login | Authenticate user |
| /register | POST | /api/auth/register-student | Register new student |
| /clubs | GET | /api/clubs | Fetch all active clubs |
| /clubs/[id] | GET | /api/clubs/{id} | Fetch club details |
| /events | GET | /api/events | Fetch all events |
| /dashboard | GET | /api/dashboard/student | Fetch student stats |
| /dashboard/notifications | GET | /api/notifications | Fetch user notifications |
| /club-admin | GET | /api/dashboard/club-admin | Fetch club admin stats |
| /admin | GET | /api/dashboard/admin | Fetch system admin stats |
| /admin/student-approvals | GET | /api/student-verification/pending | Fetch pending verifications |
| Apply to club | POST | /api/clubs/{clubId}/apply | Submit membership application |
| Register for event | POST | /api/events/{id}/register | Register for event |
| Create payment | POST | /api/payments/create | Create Stripe checkout session |
| Approve member | PATCH | /api/memberships/{id}/approve | Approve membership |
| Broadcast notification | POST | /api/notifications/broadcast | Send club-wide notification |

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

/dashboard/notifications

/payment/success

/payment/cancel

/club-admin

/club-admin/clubs

/club-admin/memberships

/club-admin/events

/club-admin/events/create

/club-admin/events/[eventId]

/club-admin/announcements

/club-admin/broadcast

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