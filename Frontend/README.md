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

---

## 🗺️ Planned Page Routes & Layouts

### Public Routes
- `/`: Landing Page (Club showcase, upcoming public events, features)
- `/clubs`: Public club directory with search & category filters
- `/clubs/[id]`: Club detail page & public events
- `/events`: Public event list & detail view
- `/login`: User login page
- `/register`: Student registration & ID document upload

### Student Portal (`/dashboard/student`)
- `/dashboard/student`: Student overview dashboard
- `/dashboard/student/applications`: Club membership application tracker
- `/dashboard/student/events`: Registered events & ticket passes
- `/dashboard/student/payments`: Payment history & receipts
- `/dashboard/student/profile`: Account settings & password change

### Club Admin Portal (`/dashboard/club-admin`)
- `/dashboard/club-admin`: Club performance overview
- `/dashboard/club-admin/members`: Member roster & pending applications
- `/dashboard/club-admin/events`: Create/edit free and paid events
- `/dashboard/club-admin/announcements`: Post and pin club announcements

### System Admin Portal (`/dashboard/admin`)
- `/dashboard/admin`: System-wide metrics & user statistics
- `/dashboard/admin/verifications`: Pending student ID approval queue
- `/dashboard/admin/users`: User management & role assignment
- `/dashboard/admin/clubs`: Club creation & moderation

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
