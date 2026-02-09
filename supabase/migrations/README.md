# Supabase Migrations

This folder contains your database migration files. Migrations are SQL scripts that run sequentially to update your database schema.

## How to use

1.  **Create a migration file**:
    Create a new `.sql` file in this directory with a timestamp prefix, e.g., `20240209120000_create_users_table.sql`.

2.  **Add your SQL**:
    Write the SQL commands to change your database schema (e.g., `CREATE TABLE`, `ALTER TABLE`).

3.  **Apply Migrations**:
    - **Local Development**: If you have the Supabase CLI installed, run `supabase db reset` or `supabase migration up`.
    - **Production**: You can copy the contents of your migration file and run it in the SQL Editor of your Supabase Dashboard.

## Naming Convention

Use the format `YYYYMMDDHHMMSS_description.sql` to keep migrations ordered chronologically.

Example:
- `20240209143000_add_profiles.sql`
- `20240209150000_add_rls_policies.sql`
