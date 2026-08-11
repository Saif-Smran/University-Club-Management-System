# 🗄️ Database Data Layer (`data/`)

This directory contains the Entity Framework Core data context and migration files for the University Club Management System.

---

## 📂 Directory Contents

- **`ApplicationDbContext.cs`**: The main `DbContext` class configuring Entity Framework Core entity mappings, relationships, table names, and indexes for PostgreSQL.
- **`Migrations/`**: Auto-generated EF Core migration files tracking database schema changes over time.

---

## 💻 Useful EF Core CLI Commands

```bash
# Add a new migration after modifying entity models
dotnet ef migrations add <MigrationName> --project "Backend/University Club Management Backend"

# Apply pending migrations to PostgreSQL database
dotnet ef database update --project "Backend/University Club Management Backend"

# Remove the latest unapplied migration
dotnet ef migrations remove --project "Backend/University Club Management Backend"
```
