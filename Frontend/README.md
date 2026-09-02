# 💻 UCMS Frontend Workspace

This directory contains the user interface application workspace and frontend requirements for the **University Club Management System (UCMS)**.

---

## 📂 Workspace Structure

```text
Frontend/
├── README.md                                  # Workspace overview & setup guide (this file)
├── UCMS_Fronted_Requirements.md               # Detailed UI/UX specifications, page routes & component maps
├── DESIGM.md                                  # Design system & visual language (colors, typography, components)
├── package.json                               # npm dependencies & scripts
├── tsconfig.json                              # TypeScript configuration
├── next.config.mjs                            # Next.js configuration
├── postcss.config.mjs                         # Tailwind CSS configuration
├── app/                                       # Next.js App Router pages
│   ├── layout.tsx                             # Root layout & providers
│   ├── page.tsx                               # Landing page (/)
│   ├── login/                                 # Login page (/login)
│   ├── register/                              # Student registration (/register)
│   ├── clubs/                                 # Club directory (/clubs)
│   │   └── [clubId]/                          # Club details (/clubs/[clubId])
│   ├── events/                                # Events listing (/events)
│   ├── dashboard/                             # Student portal (/dashboard)
│   │   ├── my-clubs/                          # Joined clubs view
│   │   ├── profile/                           # Student profile
│   │   ├── payments/                          # Payment history
│   │   └── notifications/                     # Notification center
│   ├── club-admin/                            # Club Admin portal (/club-admin)
│   │   ├── clubs/                             # Manage clubs
│   │   ├── memberships/                       # Membership approvals
│   │   ├── events/                            # Event management
│   │   ├── announcements/                     # Announcements
│   │   └── broadcast/                         # Broadcast notifications
│   ├── admin/                                 # System Admin portal (/admin)
│   │   ├── student-approvals/                 # Verify student IDs
│   │   ├── users/                             # User management
│   │   ├── clubs/                             # Club management
│   │   └── assign-admin/                      # Assign club admins
│   ├── payment/                               # Payment pages
│   │   ├── success/                           # Stripe success page
│   │   └── cancel/                            # Stripe cancel page
│   └── unauthorized/                          # Access denied page (/unauthorized)
├── components/                                # Reusable React components
│   ├── admin/                                 # Admin UI components
│   ├── clubs/                                 # Club-related components
│   ├── common/                                # Shared layout & navigation components
│   ├── events/                                # Event-related components
│   └── payment/                               # Payment flow components
├── context/                                   # React Context providers
│   ├── AuthContext.tsx                        # Authentication state & JWT handling
│   └── ThemeContext.tsx                       # Theme switching (light/dark mode)
├── lib/                                       # Utility functions & clients
│   ├── axios.ts                               # Axios HTTP client with JWT interceptors
│   └── validation.ts                          # Zod schemas & form validation rules
├── providers/                                 # TanStack Query & Context providers wrapper
│   └── Providers.tsx                          # QueryClientProvider & context providers
├── services/                                  # API service functions
│   ├── api.ts                                 # Mock data & backend API integration
│   └── mockData.ts                            # Development mock data
├── types/                                     # TypeScript type definitions
│   └── index.ts                               # Global type exports
├── globals.css                                # Global Tailwind CSS imports
└── lib/axios.ts                               # HTTP client for API requests
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui component library
- **State Management & Data Fetching**: TanStack Query (React Query) + Axios
- **HTTP Client**: Axios with JWT interceptors for authentication
- **Form Management & Validation**: React Hook Form + Zod
- **Data Visualization**: Recharts (for admin dashboards & analytics)
- **Payments Integration**: Stripe Sandbox Checkout Redirection
- **Authentication**: JWT Token + HTTP-only Cookies + Refresh Token mechanism

---

## 🗺️ Page Routes & Layouts

### Public Routes
- `/`: Landing Page (Club showcase, upcoming public events, features)
- `/clubs`: Public club directory with search & category filters
- `/clubs/[id]`: Club detail page & public events
- `/events`: Public event list & detail view
- `/login`: User login page
- `/register`: Student registration with Student ID number & ID card photo upload (Cloudinary)
- `/payment/success`: Stripe payment success landing & confirmation
- `/payment/cancel`: Stripe payment cancellation fallback page
- `/unauthorized`: Access denied page (shown when user lacks permissions)

### Student Portal (`/dashboard`)
- `/dashboard`: Student overview dashboard with unread notification badge
- `/dashboard/profile`: Account settings & profile info
- `/dashboard/my-clubs`: Joined clubs & club membership tracker
- `/dashboard/my-events`: Registered events & ticket passes
- `/dashboard/payments`: Payment transaction history & Stripe receipts
- `/dashboard/notifications`: In-app notification center & read/unread toggle

### Club Admin Portal (`/club-admin`)
- `/club-admin`: Club performance overview & statistics
- `/club-admin/clubs`: Club details management & logo update
- `/club-admin/memberships`: Pending membership applications & approval/rejection modal
- `/club-admin/events`: Create/edit free and paid events
- `/club-admin/announcements`: Post and pin club announcements
- `/club-admin/broadcast`: Broadcast notification center to send messages to all active club members

### System Admin Portal (`/admin`)
- `/admin`: System-wide metrics & overall statistics
- `/admin/student-approvals`: Pending student ID card verification queue (Cloudinary preview & approval)
- `/admin/users`: User management, search & role modification
- `/admin/clubs`: Pending club creation applications & active club moderation
- `/admin/assign-admin`: Assign users as Club Admins

---

## 🚀 Getting Started

Once the Next.js application template is initialized in this folder:

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build

# Start production server
npm run start
```

**Frontend will be available at:** `http://localhost:3000`

**Backend API:** `http://localhost:5000` (default) or configured in environment variables

---

## 🔐 Authentication Flow

1. **Register**: Student submits registration form with Student ID & ID card photo upload
2. **Pending Verification**: Frontend displays "Awaiting Admin Review" message
3. **Admin Approval**: System Admin reviews ID photo on `/admin/student-approvals`
4. **Login**: Upon approval, student logs in via `/login`
5. **JWT Storage**: Access token stored in HTTP-only cookie, refresh token handled automatically
6. **Protected Routes**: Protected pages redirect to `/login` if user is not authenticated
7. **Token Refresh**: Axios interceptor automatically refreshes token when expired

---

## 📖 Specifications Reference

For the detailed page layout specs, state management flows, and API integration mappings, refer to:
- [UCMS Frontend Requirements Document](file:///e:/University%20Club%20Management%20system/Frontend/UCMS_Fronted_Requirements.md)
- [Design System & Visual Language](file:///e:/University%20Club%20Management%20system/Frontend/DESIGM.md)
