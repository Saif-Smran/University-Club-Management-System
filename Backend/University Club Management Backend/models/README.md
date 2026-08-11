# 📦 Domain Models (`models/`)

This directory contains the C# entity models representing the core domain of the University Club Management System.

---

## 📋 Entity Inventory

| Model File | Entity Class | Description |
|------------|--------------|-------------|
| `user.cs` | `User` | Application user profile supporting Student, Club Admin, and System Admin roles with status verification. |
| `StudentVerification.cs` | `StudentVerification` | Student ID document uploads and approval history. |
| `Club.cs` | `Club` | Club metadata, advisor details, category, and active status. |
| `Membership.cs` | `Membership` | Student club membership application and approval record. |
| `Event.cs` | `Event` | Free and paid event listings, capacity constraints, location, and dates. |
| `EventRegistration.cs` | `EventRegistration` | Individual student event registrations and check-in records. |
| `Payment.cs` | `Payment` | Transaction details, payment gateway session IDs, and status. |
| `Announcement.cs` | `Announcement` | Official announcements posted by clubs with pinning support. |
