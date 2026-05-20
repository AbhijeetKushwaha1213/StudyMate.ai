# Fix Flashcard Generation - Complete Guide

## Issues Found:

1. ❌ `study_materials` table missing from database (404 error)
2. ❌ Edge function needs redeployment (500 error)

## Quick Fix (2 steps):

### Step 1: Fix Database Table

Go to your Supabase SQL Editor:
https://supabase.com/dashboard/project/cmcbkatdyhunlvlktwlv/sql

Copy and paste the contents of `fix-database.sql` and click "Run".

This will create the missing `study_materials` table.

### Step 2: Redeploy Edge Function

```bash
supabase functions deploy ai-assistant --no-verify-jwt
```

### Step 3: Restart Dev Server

```bash
npm run dev
```

## Test It:

1. Go to AI Flashcard Generator
2. Enter a topic (e.g., "Photosynthesis")
3. Click "Generate Flashcards"
4. Should work now! ✅

## Alternative: Push All Migrations

If you want to ensure all tables are created:

```bash
# Push all migrations to your hosted database
supabase db push
```

This will create all missing tables from your migrations folder.

## What Each Error Means:

### 404 Error on study_materials
- **Cause**: Table doesn't exist in your hosted Supabase database
- **Fix**: Run the SQL script in Step 1

### 500 Error on ai-assistant
- **Cause**: Edge function has old code or hasn't been deployed
- **Fix**: Redeploy in Step 2

## Verify Tables Exist:

Run this in Supabase SQL Editor to check:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('study_materials', 'flashcards', 'user_profiles');
```

You should see all three tables listed.

---

**Quick Commands:**

```bash
# 1. Fix database (run SQL in Supabase dashboard)
# 2. Deploy function
supabase functions deploy ai-assistant --no-verify-jwt

# 3. Restart
npm run dev
```
