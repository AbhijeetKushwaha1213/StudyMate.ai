# Notion Resource Manager - Database Setup

## Files Created

1. `supabase/migrations/20260213051103_notion_resource_manager_schema.sql` - Migration file
2. `supabase/manual_migration_notion_resource_manager.sql` - Standalone SQL script
3. `supabase/migrations/README.md` - Migration instructions

## Manual Setup Required

Due to migration history conflicts in the Supabase project, the schema needs to be applied manually.

### Steps to Apply the Migration

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/cmcbkatdyhunlvlktwlv
   - Navigate to: SQL Editor

2. **Execute the Migration**
   - Copy the contents of `supabase/manual_migration_notion_resource_manager.sql`
   - Paste into the SQL Editor
   - Click "Run" to execute

3. **Verify the Setup**
   Run these queries to verify:
   ```sql
   -- Check tables exist
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('pages', 'files', 'page_shares', 'templates');
   
   -- Check storage bucket
   SELECT * FROM storage.buckets WHERE id = 'page-files';
   
   -- Check system templates
   SELECT name, is_system FROM templates WHERE is_system = true;
   ```

## What Was Created

### Tables
- **pages** - Hierarchical page structure with JSONB content
- **files** - File metadata with 10MB size limit
- **page_shares** - Sharing and collaboration
- **templates** - System and user templates

### Indexes
- Optimized indexes for user queries, hierarchy, favorites, and search
- GIN index for full-text search on pages

### RLS Policies
- Complete row-level security for all tables
- Users can only access their own pages or shared pages
- Proper permission checks for view/edit access

### Full-Text Search
- PostgreSQL tsvector with automatic updates
- Searches page titles (weight A) and content (weight B)
- Trigger automatically updates search vector on changes

### Storage Bucket
- **page-files** bucket with 10MB file size limit
- Allowed types: PDF, DOCX, PPTX, TXT, JPG, PNG, GIF
- RLS policies for user-specific file access

### System Templates
5 pre-built templates:
1. Notes - Simple note-taking
2. Study Plan - Study schedule organizer
3. Project Tracker - Task tracking
4. Reading List - Book and article tracking
5. Flashcard Set - Flashcard creation

### Helper Functions
- `generate_share_link()` - Generates unique 16-character share links
- `update_page_search_vector()` - Updates full-text search vector
- `update_updated_at_column()` - Auto-updates timestamps

## Next Steps

After applying the migration:

1. **Update TypeScript Types**
   - Run `supabase gen types typescript --linked > src/integrations/supabase/types.ts`
   - This will generate TypeScript types for the new tables

2. **Test the Setup**
   - Try creating a page via SQL:
   ```sql
   INSERT INTO pages (user_id, title, content)
   VALUES (auth.uid(), 'Test Page', '[]'::jsonb);
   ```

3. **Proceed to Task 2**
   - Implement the Page API and data layer
   - Create TypeScript interfaces for blocks and pages

## Troubleshooting

### If migration fails:
- Check if tables already exist: `\dt pages`
- Drop existing tables if needed (be careful with data loss)
- Check RLS is enabled: `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true;`

### If storage bucket fails:
- Check if bucket exists: `SELECT * FROM storage.buckets;`
- Manually create via Supabase Dashboard > Storage

### If types generation fails:
- Ensure Supabase CLI is linked: `supabase link --project-ref cmcbkatdyhunlvlktwlv`
- Update CLI: `brew upgrade supabase` (macOS)
