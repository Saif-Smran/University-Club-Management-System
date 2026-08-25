# 💻 UCMS Frontend Workspace

This directory contains the user interface application workspace and frontend requirements for the **University Club Management System (UCMS)**.

---

## 📂 Workspace Structure

```text
Frontend/
├── README.md                          # Workspace overview & setup guide (this file)
└── UCMS_Fronted_Requirements.md       # Detailed UI/UX specifications, page routes & component maps
```

---

## 🛠️ Planned Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management & Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Form Management & Validation**: React Hook Form + Zod
- **Data Visualization**: Recharts (for admin dashboards & analytics)
- **Payments Integration**: Stripe Sandbox Checkout Redirection

---

## 🗺️ Planned Page Routes & Layouts

### Public Routes
- `/`: Landing Page (Club showcase, upcoming public events, features)
- `/clubs`: Public club directory with search & category filters
- `/clubs/[id]`: Club detail page & public events
- `/events`: Public event list & detail view
- `/login`: User login page
- `/register`: Student registration with Student ID number & ID card photo upload (Cloudinary)
- `/payment/success`: Stripe payment success landing & confirmation
- `/payment/cancel`: Stripe payment cancellation fallback page

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

---

## 📖 Specifications Reference

For the detailed page layout specs, state management flows, and API integration mappings, refer to:
- [UCMS Frontend Requirements Document](file:///e:/University%20Club%20Management%20system/Frontend/UCMS_Fronted_Requirements.md)
