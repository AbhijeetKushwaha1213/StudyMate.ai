# Notion-Like Resource Manager - Requirements

## Overview
Create a comprehensive resource management system similar to Notion that allows students (both college and exam prep) to organize their study materials, notes, files, and resources in a hierarchical, flexible structure.

## User Stories

### US-1: Workspace Organization
**As a** student  
**I want to** create and organize pages in a hierarchical structure  
**So that** I can keep my study materials organized by subject, topic, or project

**Acceptance Criteria:**
- AC-1.1: Users can create a new page with a title
- AC-1.2: Users can create nested sub-pages (unlimited depth)
- AC-1.3: Users can see a sidebar with page hierarchy
- AC-1.4: Users can expand/collapse page sections in sidebar
- AC-1.5: Users can drag and drop pages to reorder or change hierarchy
- AC-1.6: Users can add icons/emojis to pages
- AC-1.7: Users can add cover images to pages

### US-2: Rich Text Editing
**As a** student  
**I want to** write and format text content  
**So that** I can create well-structured notes and documents

**Acceptance Criteria:**
- AC-2.1: Users can type text in a page
- AC-2.2: Users can format text (bold, italic, underline, strikethrough)
- AC-2.3: Users can create headings (H1, H2, H3)
- AC-2.4: Users can create bulleted lists
- AC-2.5: Users can create numbered lists
- AC-2.6: Users can create checkboxes/to-do items
- AC-2.7: Users can add inline code and code blocks
- AC-2.8: Users can add quotes/callouts
- AC-2.9: Users can change text color and background color
- AC-2.10: Users can add links to text

### US-3: Block-Based Content
**As a** student  
**I want to** add different types of content blocks  
**So that** I can create rich, multimedia study materials

**Acceptance Criteria:**
- AC-3.1: Users can add text blocks
- AC-3.2: Users can add heading blocks
- AC-3.3: Users can add image blocks (upload or URL)
- AC-3.4: Users can add file attachments (PDF, DOCX, etc.)
- AC-3.5: Users can add divider/separator blocks
- AC-3.6: Users can add table of contents block
- AC-3.7: Users can add embed blocks (YouTube, etc.)
- AC-3.8: Users can reorder blocks via drag and drop
- AC-3.9: Users can delete blocks
- AC-3.10: Users can duplicate blocks
- AC-3.11: Each block has a hover menu with actions

### US-4: Database/Table Views
**As a** student  
**I want to** create tables and databases  
**So that** I can organize information in structured formats

**Acceptance Criteria:**
- AC-4.1: Users can create a table block
- AC-4.2: Users can add/remove columns
- AC-4.3: Users can add/remove rows
- AC-4.4: Users can set column types (text, number, date, select, multi-select, checkbox)
- AC-4.5: Users can sort table by columns
- AC-4.6: Users can filter table rows
- AC-4.7: Users can resize columns
- AC-4.8: Users can toggle between table, board (Kanban), and list views

### US-5: File Management
**As a** student  
**I want to** upload and manage files  
**So that** I can keep all my study materials in one place

**Acceptance Criteria:**
- AC-5.1: Users can upload files (max 10MB per file)
- AC-5.2: Supported file types: PDF, DOCX, PPTX, TXT, images (JPG, PNG, GIF)
- AC-5.3: Users can preview files inline
- AC-5.4: Users can download files
- AC-5.5: Users can delete files
- AC-5.6: Users can see file metadata (size, upload date)
- AC-5.7: Files are stored securely in cloud storage

### US-6: Search and Navigation
**As a** student  
**I want to** quickly find pages and content  
**So that** I can access information efficiently

**Acceptance Criteria:**
- AC-6.1: Users can search across all pages
- AC-6.2: Search includes page titles and content
- AC-6.3: Users can use keyboard shortcut (Cmd/Ctrl + K) to open search
- AC-6.4: Search shows results with context/preview
- AC-6.5: Users can navigate to pages from search results
- AC-6.6: Recent pages are shown in search

### US-7: Templates
**As a** student  
**I want to** use pre-built templates  
**So that** I can quickly create common page types

**Acceptance Criteria:**
- AC-7.1: System provides templates for: Notes, Study Plan, Project Tracker, Reading List, Flashcard Set
- AC-7.2: Users can create pages from templates
- AC-7.3: Users can create custom templates
- AC-7.4: Templates include pre-configured blocks and structure

### US-8: Collaboration Features
**As a** student  
**I want to** share pages with others  
**So that** I can collaborate on study materials

**Acceptance Criteria:**
- AC-8.1: Users can share pages via link
- AC-8.2: Users can set permissions (view only, can edit)
- AC-8.3: Users can see who has access to a page
- AC-8.4: Users can revoke access
- AC-8.5: Shared pages show last edited by and timestamp

### US-9: Version History
**As a** student  
**I want to** see page history and restore previous versions  
**So that** I can recover from mistakes or see changes over time

**Acceptance Criteria:**
- AC-9.1: System automatically saves page versions
- AC-9.2: Users can view version history
- AC-9.3: Users can see what changed in each version
- AC-9.4: Users can restore a previous version
- AC-9.5: Version history shows timestamp and author

### US-10: Offline Support
**As a** student  
**I want to** access my pages offline  
**So that** I can study without internet connection

**Acceptance Criteria:**
- AC-10.1: Recently viewed pages are cached locally
- AC-10.2: Users can mark pages for offline access
- AC-10.3: Changes made offline sync when online
- AC-10.4: Offline indicator shows sync status

### US-11: Export and Import
**As a** student  
**I want to** export and import content  
**So that** I can backup or migrate my data

**Acceptance Criteria:**
- AC-11.1: Users can export pages as Markdown
- AC-11.2: Users can export pages as PDF
- AC-11.3: Users can export pages as HTML
- AC-11.4: Users can import Markdown files
- AC-11.5: Export includes all nested pages and files

### US-12: Favorites and Quick Access
**As a** student  
**I want to** mark important pages as favorites  
**So that** I can quickly access frequently used materials

**Acceptance Criteria:**
- AC-12.1: Users can add pages to favorites
- AC-12.2: Favorites appear at top of sidebar
- AC-12.3: Users can remove pages from favorites
- AC-12.4: Users can reorder favorites

## Technical Requirements

### TR-1: Performance
- Pages should load in under 2 seconds
- Search results should appear in under 500ms
- File uploads should show progress indicator
- Smooth drag and drop with no lag

### TR-2: Data Storage
- Use Supabase for database storage
- Use Supabase Storage for file uploads
- Implement proper indexing for search performance
- Store page content as JSON for flexibility

### TR-3: Security
- All pages are private by default
- Implement row-level security in Supabase
- Validate file types and sizes on upload
- Sanitize user input to prevent XSS

### TR-4: Accessibility
- Keyboard navigation for all features
- Screen reader support
- ARIA labels on interactive elements
- Focus management for modals and menus

### TR-5: Mobile Responsiveness
- Responsive design for all screen sizes
- Touch-friendly drag and drop
- Mobile-optimized sidebar (drawer)
- Swipe gestures for navigation

## Database Schema

### Pages Table
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- parent_id (uuid, nullable, self-reference)
- title (text)
- icon (text, nullable)
- cover_image (text, nullable)
- content (jsonb) -- stores blocks
- position (integer) -- for ordering
- is_favorite (boolean)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp, nullable) -- soft delete
```

### Page_Versions Table
```sql
- id (uuid, primary key)
- page_id (uuid, foreign key)
- content (jsonb)
- created_by (uuid, foreign key)
- created_at (timestamp)
```

### Page_Shares Table
```sql
- id (uuid, primary key)
- page_id (uuid, foreign key)
- shared_by (uuid, foreign key)
- shared_with (uuid, foreign key, nullable) -- null for public links
- permission (enum: view, edit)
- share_link (text, unique)
- created_at (timestamp)
```

### Files Table
```sql
- id (uuid, primary key)
- page_id (uuid, foreign key)
- user_id (uuid, foreign key)
- filename (text)
- file_type (text)
- file_size (integer)
- storage_path (text)
- created_at (timestamp)
```

## UI/UX Requirements

### Layout
- Three-column layout: Sidebar | Main Content | Properties Panel (optional)
- Collapsible sidebar
- Breadcrumb navigation
- Floating action button for quick page creation

### Interactions
- Slash commands (/) to insert blocks
- @ mentions for linking pages
- Drag handles on blocks
- Hover menus for block actions
- Context menus (right-click)

### Visual Design
- Clean, minimal interface
- Consistent spacing and typography
- Smooth animations and transitions
- Loading states for async operations
- Empty states with helpful guidance

## Success Metrics
- Users create at least 5 pages in first week
- Average session time increases by 30%
- 80% of users use at least 3 different block types
- File upload success rate > 95%
- Search usage increases by 50%

## Out of Scope (Future Enhancements)
- Real-time collaboration (multiple users editing simultaneously)
- Comments and discussions
- Page analytics
- AI-powered content suggestions
- Integration with external tools (Google Drive, Dropbox)
- Custom domains for shared pages
- Advanced permissions (teams, groups)
