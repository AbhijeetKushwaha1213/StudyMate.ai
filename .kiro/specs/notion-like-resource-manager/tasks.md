# Implementation Plan: Notion-Like Resource Manager

## Overview

This implementation plan breaks down the Notion-like Resource Manager into incremental, testable steps. The approach follows a bottom-up strategy: build core data structures and APIs first, then add the block editor, then UI components, and finally advanced features like offline sync and collaboration.

## Tasks

- [x] 1. Set up database schema and core infrastructure
  - Create Supabase migrations for pages, files, page_shares, and templates tables
  - Set up Row Level Security policies for all tables
  - Configure full-text search with tsvector and triggers
  - Set up Supabase Storage bucket for file uploads
  - _Requirements: TR-2, TR-3_

- [x] 2. Implement core Page API and data layer
  - [x] 2.1 Create TypeScript interfaces for Page, Block, and related types
    - Define all block type interfaces (TextBlock, HeadingBlock, ImageBlock, etc.)
    - Define API input/output types (CreatePageInput, UpdatePageInput, etc.)
    - _Requirements: AC-1.1, AC-1.2_
  
  - [x] 2.2 Implement Page CRUD operations
    - Implement createPage, getPage, updatePage, deletePage functions
    - Implement soft delete (set deleted_at timestamp)
    - _Requirements: AC-1.1_
  
  - [ ]* 2.3 Write property test for page creation persistence
    - **Property 1: Page Creation Persistence**
    - **Validates: Requirements AC-1.1, AC-1.2**
  
  - [x] 2.4 Implement page hierarchy operations
    - Implement movePage function for changing parent and position
    - Implement getPageChildren to fetch child pages
    - Implement getPageAncestors for breadcrumb navigation
    - _Requirements: AC-1.2, AC-1.5_
  
  - [ ]* 2.5 Write property test for page hierarchy integrity
    - **Property 2: Page Hierarchy Integrity**
    - **Validates: Requirements AC-1.2**
  
  - [ ]* 2.6 Write property test for page reordering
    - **Property 4: Page Reordering Preserves All Pages**
    - **Validates: Requirements AC-1.5**

- [x] 3. Implement favorites and page metadata
  - [x] 3.1 Implement toggleFavorite and getFavorites functions
    - Add favorite toggle logic
    - Add query for fetching favorited pages
    - _Requirements: AC-12.1, AC-12.2, AC-12.3_
  
  - [x] 3.2 Implement page icon and cover image updates
    - Add updatePage support for icon and cover_image fields
    - _Requirements: AC-1.6, AC-1.7_
  
  - [ ]* 3.3 Write property test for favorite toggle persistence
    - **Property 35: Favorite Toggle Persistence**
    - **Validates: Requirements AC-12.1, AC-12.3**
  
  - [ ]* 3.4 Write property test for page metadata persistence
    - **Property 3: Page Metadata Persistence**
    - **Validates: Requirements AC-1.6, AC-1.7**

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


- [x] 5. Implement Block API and block operations
  - [x] 5.1 Implement block CRUD operations
    - Implement createBlock, updateBlock, deleteBlock functions
    - Blocks are stored in page.content JSONB array
    - _Requirements: AC-3.1, AC-3.2, AC-3.3, AC-3.4, AC-3.5, AC-3.6, AC-3.7_
  
  - [x] 5.2 Implement block reordering and duplication
    - Implement reorderBlocks to update block positions
    - Implement duplicateBlock to create a copy with new ID
    - _Requirements: AC-3.8, AC-3.10_
  
  - [ ]* 5.3 Write property test for block creation and retrieval
    - **Property 5: Block Creation and Retrieval**
    - **Validates: Requirements AC-3.1, AC-3.2, AC-3.3, AC-3.4, AC-3.5, AC-3.6, AC-3.7**
  
  - [ ]* 5.4 Write property test for block reordering
    - **Property 6: Block Reordering Preserves All Blocks**
    - **Validates: Requirements AC-3.8**
  
  - [ ]* 5.5 Write property test for block deletion
    - **Property 7: Block Deletion Removes Exactly One Block**
    - **Validates: Requirements AC-3.9**
  
  - [ ]* 5.6 Write property test for block duplication
    - **Property 8: Block Duplication Creates Independent Copy**
    - **Validates: Requirements AC-3.10**

- [x] 6. Implement rich text formatting and text blocks
  - [x] 6.1 Create RichText and TextMark interfaces
    - Define structure for text with formatting marks
    - Support bold, italic, underline, strikethrough, code, link, color marks
    - _Requirements: AC-2.1, AC-2.2, AC-2.9, AC-2.10_
  
  - [x] 6.2 Implement text block and heading block creation
    - Create TextBlock and HeadingBlock with RichText content
    - Support H1, H2, H3 heading levels
    - _Requirements: AC-2.1, AC-2.3_
  
  - [ ]* 6.3 Write property test for rich text marks preservation
    - **Property 9: Rich Text Marks Preservation**
    - **Validates: Requirements AC-2.2, AC-2.9, AC-2.10**
  
  - [ ]* 6.4 Write property test for text block content persistence
    - **Property 10: Text Block Content Persistence**
    - **Validates: Requirements AC-2.1**
  
  - [ ]* 6.5 Write property test for heading level preservation
    - **Property 11: Heading Level Preservation**
    - **Validates: Requirements AC-2.3**

- [x] 7. Implement list blocks
  - [x] 7.1 Create list block types (bulleted, numbered, checkbox)
    - Implement BulletListBlock, NumberedListBlock, CheckboxBlock
    - Store list items and their content
    - _Requirements: AC-2.4, AC-2.5, AC-2.6_
  
  - [ ]* 7.2 Write property test for list structure preservation
    - **Property 12: List Structure Preservation**
    - **Validates: Requirements AC-2.4, AC-2.5, AC-2.6**

- [x] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement table blocks
  - [x] 9.1 Create TableBlock with columns and rows
    - Implement TableColumn interface with types (text, number, date, select, etc.)
    - Implement TableRow interface with cell data
    - _Requirements: AC-4.1, AC-4.2, AC-4.3, AC-4.4_
  
  - [x] 9.2 Implement table operations (add/remove columns and rows)
    - Add functions to add/remove columns while preserving data
    - Add functions to add/remove rows
    - _Requirements: AC-4.2, AC-4.3_
  
  - [x] 9.3 Implement table sorting and filtering
    - Add sort function that reorders rows by column values
    - Add filter function that returns matching rows
    - _Requirements: AC-4.5, AC-4.6_
  
  - [ ]* 9.4 Write property test for table structure operations
    - **Property 13: Table Structure Operations Preserve Data**
    - **Validates: Requirements AC-4.2, AC-4.3**
  
  - [ ]* 9.5 Write property test for table sorting
    - **Property 15: Table Sorting Preserves Row Data**
    - **Validates: Requirements AC-4.5**
  
  - [ ]* 9.6 Write property test for table filtering
    - **Property 16: Table Filtering Returns Matching Subset**
    - **Validates: Requirements AC-4.6**

- [x] 10. Implement File API and file management
  - [x] 10.1 Implement file upload with validation
    - Validate file size (max 10MB)
    - Validate file type (PDF, DOCX, PPTX, TXT, JPG, PNG, GIF)
    - Upload to Supabase Storage
    - Store metadata in files table
    - _Requirements: AC-5.1, AC-5.2, AC-5.6_
  
  - [x] 10.2 Implement file download and deletion
    - Implement getFile to retrieve file blob from storage
    - Implement deleteFile to remove file and metadata
    - _Requirements: AC-5.4, AC-5.5_
  
  - [ ]* 10.3 Write property test for file size validation
    - **Property 17: File Size Validation**
    - **Validates: Requirements AC-5.1**
  
  - [ ]* 10.4 Write property test for file type validation
    - **Property 18: File Type Validation**
    - **Validates: Requirements AC-5.2**
  
  - [ ]* 10.5 Write property test for file upload-download round-trip
    - **Property 19: File Upload and Download Round-Trip**
    - **Validates: Requirements AC-5.4**
  
  - [ ]* 10.6 Write property test for file deletion
    - **Property 20: File Deletion Removes Metadata and Storage**
    - **Validates: Requirements AC-5.5**

- [x] 11. Implement search functionality
  - [x] 11.1 Set up PostgreSQL full-text search
    - Create search_vector column with tsvector type
    - Create trigger to update search_vector on page changes
    - Create GIN index for fast search
    - _Requirements: AC-6.1, AC-6.2_
  
  - [x] 11.2 Implement searchPages function
    - Query pages using full-text search
    - Return results with matched content snippets
    - Order by relevance score
    - _Requirements: AC-6.1, AC-6.2, AC-6.4_
  
  - [x] 11.3 Implement recent pages tracking
    - Track page views with timestamps
    - Implement getRecentPages to return recently viewed pages
    - _Requirements: AC-6.6_
  
  - [ ]* 11.4 Write property test for search returns matching pages
    - **Property 21: Search Returns Matching Pages**
    - **Validates: Requirements AC-6.1, AC-6.2**
  
  - [ ]* 11.5 Write property test for search results include context
    - **Property 22: Search Results Include Context**
    - **Validates: Requirements AC-6.4**
  
  - [ ]* 11.6 Write property test for recent pages tracking
    - **Property 23: Recent Pages Tracking**
    - **Validates: Requirements AC-6.6**

- [x] 12. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Implement React Query hooks for state management
  - [x] 13.1 Create usePages hook for fetching and managing pages
    - Use React Query for caching and optimistic updates
    - Implement createPage, updatePage, deletePage mutations
    - _Requirements: AC-1.1, AC-1.2_
  
  - [x] 13.2 Create usePage hook for single page operations
    - Fetch single page with caching
    - Implement optimistic updates for page edits
    - _Requirements: AC-1.1_
  
  - [x] 13.3 Create useBlocks hook for block operations
    - Implement createBlock, updateBlock, deleteBlock, reorderBlocks mutations
    - Use optimistic updates for smooth UX
    - _Requirements: AC-3.1, AC-3.8, AC-3.9_
  
  - [x] 13.4 Create useSearch and useFavorites hooks
    - Implement search with debouncing
    - Implement favorites toggle and fetch
    - _Requirements: AC-6.1, AC-12.1_

- [x] 14. Build PageTree sidebar component
  - [x] 14.1 Create PageTreeNode component for hierarchical display
    - Display page title and icon
    - Support expand/collapse for nested pages
    - Show loading states
    - _Requirements: AC-1.3, AC-1.4_
  
  - [x] 14.2 Implement drag and drop for page reordering
    - Use @dnd-kit for accessible drag and drop
    - Update page parent_id and position on drop
    - Show visual feedback during drag
    - _Requirements: AC-1.5_
  
  - [x] 14.3 Create FavoritesList component
    - Display favorited pages at top of sidebar
    - Support reordering favorites
    - _Requirements: AC-12.2, AC-12.4_
  
  - [ ]* 14.4 Write unit tests for PageTree component
    - Test rendering of nested pages
    - Test expand/collapse functionality
    - _Requirements: AC-1.3, AC-1.4_

- [x] 15. Build BlockEditor component
  - [x] 15.1 Set up Slate.js or TipTap editor
    - Configure editor with custom block types
    - Set up serialization/deserialization for blocks
    - _Requirements: AC-2.1, AC-3.1_
  
  - [x] 15.2 Implement BlockRenderer for different block types
    - Create renderers for text, heading, image, file, table, etc.
    - Support inline editing for text blocks
    - _Requirements: AC-3.1, AC-3.2, AC-3.3, AC-3.4_
  
  - [x] 15.3 Implement slash command menu
    - Show menu when user types "/"
    - Filter commands based on input
    - Insert selected block type
    - _Requirements: AC-3.1, AC-3.2_
  
  - [x] 15.4 Implement block hover menu
    - Show menu on block hover with actions (delete, duplicate, drag handle)
    - Support drag and drop for block reordering
    - _Requirements: AC-3.8, AC-3.9, AC-3.10, AC-3.11_
  
  - [ ]* 15.5 Write unit tests for BlockEditor
    - Test block rendering
    - Test slash command insertion
    - Test block reordering via drag and drop
    - _Requirements: AC-3.1, AC-3.8_

- [x] 16. Build PageView component
  - [x] 16.1 Create PageHeader with title, icon, and cover image
    - Editable title with auto-save
    - Icon picker for page icons
    - Cover image upload and display
    - _Requirements: AC-1.1, AC-1.6, AC-1.7_
  
  - [x] 16.2 Create PageBreadcrumb for navigation
    - Display ancestor pages as breadcrumb trail
    - Support clicking to navigate to parent pages
    - _Requirements: AC-1.2_
  
  - [x] 16.3 Integrate BlockEditor into PageView
    - Display page content using BlockEditor
    - Auto-save changes with debouncing
    - Show save status indicator
    - _Requirements: AC-2.1, AC-3.1_
  
  - [ ]* 16.4 Write unit tests for PageView
    - Test page header rendering
    - Test breadcrumb navigation
    - _Requirements: AC-1.1, AC-1.6_

- [x] 17. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 18. Implement search modal
  - [x] 18.1 Create SearchModal component with keyboard shortcut
    - Open with Cmd/Ctrl + K
    - Display search input and results
    - Support keyboard navigation
    - _Requirements: AC-6.3, AC-6.5_
  
  - [x] 18.2 Integrate search API and display results
    - Show search results with context/preview
    - Show recent pages when no query
    - Navigate to page on selection
    - _Requirements: AC-6.1, AC-6.4, AC-6.5, AC-6.6_
  
  - [ ]* 18.3 Write unit tests for SearchModal
    - Test keyboard shortcut opens modal
    - Test search results display
    - _Requirements: AC-6.3_

- [x] 19. Implement templates
  - [x] 19.1 Create system templates
    - Create templates for: Notes, Study Plan, Project Tracker, Reading List, Flashcard Set
    - Store in templates table with is_system=true
    - _Requirements: AC-7.1_
  
  - [x] 19.2 Implement template API functions
    - Implement getTemplates to fetch available templates
    - Implement createPageFromTemplate to create page from template
    - Implement createTemplate to save custom template
    - _Requirements: AC-7.2, AC-7.3_
  
  - [ ]* 19.3 Write property test for template creation
    - **Property 24: Template Creation Preserves Content**
    - **Validates: Requirements AC-7.3, AC-7.4**
  
  - [ ]* 19.4 Write property test for page creation from template
    - **Property 25: Page Creation from Template Copies Content**
    - **Validates: Requirements AC-7.2**

- [x] 20. Implement sharing functionality
  - [x] 20.1 Create Share API functions
    - Implement createShare to generate unique share link
    - Implement deleteShare to revoke access
    - Implement getShares to list page shares
    - _Requirements: AC-8.1, AC-8.2, AC-8.4_
  
  - [x] 20.2 Update RLS policies for shared pages
    - Allow viewing shared pages with view permission
    - Allow editing shared pages with edit permission
    - _Requirements: AC-8.2_
  
  - [x] 20.3 Create ShareModal component
    - Display share link and copy button
    - Show permission selector (view/edit)
    - List users with access
    - _Requirements: AC-8.1, AC-8.2, AC-8.3_
  
  - [ ]* 20.4 Write property test for share link uniqueness
    - **Property 26: Share Link Uniqueness**
    - **Validates: Requirements AC-8.1**
  
  - [ ]* 20.5 Write property test for share revocation
    - **Property 28: Share Revocation Removes Access**
    - **Validates: Requirements AC-8.4**

- [x] 21. Implement offline support with IndexedDB
  - [x] 21.1 Set up Dexie.js database schema
    - Create tables for pages, offlinePages, syncQueue
    - Configure indexes for efficient queries
    - _Requirements: AC-10.1, AC-10.2_
  
  - [x] 21.2 Implement CacheService for local storage
    - Implement cachePage to store pages locally
    - Implement getCachedPage to retrieve from cache
    - Implement markForOffline to persist pages
    - _Requirements: AC-10.1, AC-10.2_
  
  - [x] 21.3 Implement SyncService for offline operations
    - Queue operations when offline
    - Process queue when connectivity restored
    - Handle sync conflicts with last-write-wins
    - _Requirements: AC-10.3_
  
  - [x] 21.4 Add offline indicator to UI
    - Show sync status (online/offline/syncing)
    - Display pending operations count
    - _Requirements: AC-10.4_
  
  - [ ]* 21.5 Write property test for page view caching
    - **Property 29: Page View Caches Locally**
    - **Validates: Requirements AC-10.1**
  
  - [ ]* 21.6 Write property test for offline operations sync
    - **Property 31: Offline Operations Queue and Sync**
    - **Validates: Requirements AC-10.3**

- [ ] 22. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 23. Implement export functionality
  - [x] 23.1 Implement Markdown export
    - Convert blocks to Markdown format
    - Include nested pages if requested
    - _Requirements: AC-11.1, AC-11.5_
  
  - [x] 23.2 Implement HTML export
    - Convert blocks to HTML format
    - Include styling and structure
    - _Requirements: AC-11.3_
  
  - [x] 23.3 Implement PDF export
    - Use library like jsPDF or html2pdf
    - Generate PDF from page content
    - _Requirements: AC-11.2_
  
  - [ ]* 23.4 Write property test for Markdown round-trip
    - **Property 32: Markdown Export-Import Round-Trip**
    - **Validates: Requirements AC-11.1, AC-11.4**
  
  - [ ]* 23.5 Write property test for HTML export
    - **Property 33: HTML Export Contains Content**
    - **Validates: Requirements AC-11.3**
  
  - [ ]* 23.6 Write property test for export includes nested pages
    - **Property 34: Export Includes Nested Pages**
    - **Validates: Requirements AC-11.5**

- [x] 24. Implement import functionality
  - [x] 24.1 Implement Markdown import
    - Parse Markdown to blocks
    - Create page with imported content
    - _Requirements: AC-11.4_
  
  - [ ]* 24.2 Write unit tests for Markdown import
    - Test parsing various Markdown formats
    - Test block type detection
    - _Requirements: AC-11.4_

- [x] 25. Polish UI and add loading states
  - [x] 25.1 Add loading skeletons for pages and blocks
    - Show skeleton while loading page content
    - Show skeleton while loading sidebar
    - _Requirements: TR-1_
  
  - [x] 25.2 Add empty states with helpful guidance
    - Show empty state when no pages exist
    - Show empty state in search when no results
    - _Requirements: UI/UX Requirements_
  
  - [x] 25.3 Add animations and transitions
    - Smooth page transitions
    - Animated block insertion/deletion
    - Smooth drag and drop feedback
    - _Requirements: TR-1, UI/UX Requirements_

- [x] 26. Implement accessibility features
  - [x] 26.1 Add keyboard navigation
    - Support Tab navigation through blocks
    - Support arrow keys for block selection
    - Support keyboard shortcuts for common actions
    - _Requirements: TR-4_
  
  - [x] 26.2 Add ARIA labels and screen reader support
    - Add ARIA labels to interactive elements
    - Add screen reader announcements for actions
    - Test with screen readers
    - _Requirements: TR-4_

- [x] 27. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 28. Integration and final wiring
  - [x] 28.1 Replace ResourceSpace component with new PageView
    - Update App.tsx routing to use new components
    - Remove old ResourceSpace component
    - Test navigation between pages
    - _Requirements: All_
  
  - [x] 28.2 Add error boundaries and error handling
    - Wrap components in error boundaries
    - Display user-friendly error messages
    - Log errors for debugging
    - _Requirements: TR-3_
  
  - [ ]* 28.3 Write integration tests for critical flows
    - Test create page → add blocks → save flow
    - Test search → navigate to page flow
    - Test offline → make changes → sync flow
    - _Requirements: All_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation follows a bottom-up approach: data layer → API → UI components → advanced features
