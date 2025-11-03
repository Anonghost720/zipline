# DMCA Page Setup Guide

## Overview
A DMCA (Digital Millennium Copyright Act) page has been added to ShareHost. This page allows you to display your DMCA policy to users, providing them with information about copyright infringement procedures.

## Files Added

### 1. DMCA Page Component
- **Location:** `/src/client/pages/auth/dmca.tsx`
- **Route:** `/auth/dmca`
- **Purpose:** Displays the DMCA policy to users

### 2. Sample DMCA Policy
- **Location:** `/DMCA.md`
- **Purpose:** A template DMCA policy that you can customize with your contact information

## Configuration

### Admin Settings
1. Log in to your ShareHost instance as an administrator
2. Navigate to **Dashboard → Administrator → Settings**
3. Scroll to the **Website** section
4. Find the **DMCA Policy** field
5. Enter the path to your DMCA markdown file (e.g., `/root/zipline/DMCA.md`)
6. Click **Save**

### Environment Variable (Alternative)
You can also set the DMCA policy path via environment variable:
```bash
WEBSITE_DMCA=/path/to/your/DMCA.md
```

## Customizing Your DMCA Policy

1. Edit the `/root/zipline/DMCA.md` file (or create your own)
2. Update the following placeholders:
   - `[Insert your DMCA contact email]`
   - `[Insert your DMCA contact address]`
   - `[Insert your DMCA contact phone number]`
   - `[Insert Date]` (last updated date)
3. Customize the content to match your organization's policies
4. Save the file

## Database Migration

A database migration has been created to add the `websiteDmca` field to the Zipline settings table:
- **Migration:** `prisma/migrations/20251103214605_add_dmca_field/migration.sql`

To apply the migration (when you have a database connection):
```bash
npx prisma migrate deploy
```

Or during development:
```bash
npx prisma migrate dev
```

## Accessing the DMCA Page

Once configured, users can access the DMCA policy at:
```
https://your-domain.com/auth/dmca
```

## Features

- **Markdown Support:** The DMCA page supports full Markdown formatting
- **Automatic Caching:** The DMCA content is cached on the server for performance
- **Validation:** The system validates that the file path ends with `.md`
- **Optional:** If no DMCA file is configured, the page will simply show empty content

## Technical Details

### Changes Made:
1. **Frontend:**
   - New page component: `src/client/pages/auth/dmca.tsx`
   - Added route: `/auth/dmca` in `src/client/routes.tsx`

2. **Backend:**
   - Updated `src/server/routes/api/server/public.ts` to include DMCA content
   - Added DMCA field to API response type

3. **Configuration:**
   - Added `websiteDmca` to `src/lib/config/read/db.ts`
   - Added `WEBSITE_DMCA` to `src/lib/config/read/env.ts`
   - Added validation in `src/lib/config/validate.ts`

4. **Admin Panel:**
   - Added DMCA input field in `src/components/pages/serverSettings/parts/Website.tsx`

5. **Database:**
   - Added `websiteDmca` column to Zipline table in Prisma schema
   - Created migration: `20251103214605_add_dmca_field`

## Similar to Terms of Service (TOS)

The DMCA page follows the same pattern as the existing Terms of Service (TOS) page:
- Same rendering mechanism (Markdown component)
- Same configuration approach (file path in settings)
- Same caching strategy (server-side caching)
- Accessible at `/auth/dmca` (similar to `/auth/tos`)

## Next Steps

1. Apply the database migration
2. Customize the DMCA.md file with your information
3. Configure the DMCA path in admin settings
4. Test the page by visiting `/auth/dmca`
5. (Optional) Add a link to the DMCA page in your footer or legal section
