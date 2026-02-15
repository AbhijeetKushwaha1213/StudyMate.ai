# Notion-Like Resource Manager - Design Document

## Overview

The Notion-Like Resource Manager is a comprehensive content management system that replaces the simple resource vault with a hierarchical, block-based editor similar to Notion. The system enables students to organize study materials in nested pages with rich text editing, multimedia content blocks, file management, and collaboration features.

### Key Design Principles

1. **Block-Based Architecture**: All content is composed of discrete, reusable blocks that can be reordered, nested, and transformed
2. **Hierarchical Organization**: Pages can be nested infinitely, creating a tree structure for organizing content
3. **Offline-First**: Local caching and synchronization ensure the app works without internet connectivity
4. **Performance**: Lazy loading, virtualization, and optimistic updates for smooth user experience
5. **Extensibility**: Plugin-like block system allows easy addition of new content types

### Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Components**: Radix UI primitives with shadcn/ui
- **State Management**: React Query for server state, React Context for UI state
- **Rich Text Editor**: Slate.js or TipTap for block-based editing
- **Drag & Drop**: @dnd-kit for accessible drag and drop
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Storage**: Supabase Storage for file uploads
- **Offline Support**: IndexedDB via Dexie.js for local caching
- **Search**: PostgreSQL full-text search with pg_trgm extension

## Architecture

### High-Level System Flow

1. User interacts with React UI components
2. UI triggers API calls through React Query hooks
3. React Query manages caching and optimistic updates
4. Sync engine handles offline/online state
5. API layer communicates with Supabase
6. IndexedDB stores local cache for offline access

### Component Hierarchy

```
App
├── Sidebar
│   ├── PageTree (hierarchical page list)
│   ├── FavoritesList
│   └── SearchModal
├── PageView
│   ├── PageHeader (title, icon, cover)
│   ├── PageBreadcrumb
│   └── BlockEditor
│       ├── BlockRenderer (for each block)
│       ├── BlockMenu (hover actions)
│       └── SlashCommandMenu
└── PropertiesPanel (optional)
```

## Components and Interfaces

### Core Data Structures

```typescript
// Page entity
interface Page {
  id: string;
  user_id: string;
  parent_id: string | null;
  title: string;
  icon: string | null;
  cover_image: string | null;
  content: Block[];
  position: number;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Block types
type BlockType = 
  | 'text'
  | 'heading1' | 'heading2' | 'heading3'
  | 'bulletList' | 'numberedList' | 'checkbox'
  | 'quote' | 'callout' | 'code'
  | 'image' | 'file' | 'embed'
  | 'divider' | 'toc'
  | 'table';

// Base block interface
interface BaseBlock {
  id: string;
  type: BlockType;
  position: number;
  created_at: string;
  updated_at: string;
}

// Specific block implementations
interface TextBlock extends BaseBlock {
  type: 'text';
  content: RichText;
}

interface HeadingBlock extends BaseBlock {
  type: 'heading1' | 'heading2' | 'heading3';
  content: RichText;
}

interface ImageBlock extends BaseBlock {
  type: 'image';
  url: string;
  caption: string;
  width: number;
  height: number;
}

interface FileBlock extends BaseBlock {
  type: 'file';
  file_id: string;
  filename: string;
  file_type: string;
  file_size: number;
}

interface TableBlock extends BaseBlock {
  type: 'table';
  columns: TableColumn[];
  rows: TableRow[];
}

// Rich text formatting
interface RichText {
  text: string;
  marks: TextMark[];
}

interface TextMark {
  type: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'link' | 'color';
  attrs?: {
    href?: string;
    color?: string;
    backgroundColor?: string;
  };
}

// Table structures
interface TableColumn {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiSelect' | 'checkbox';
  width: number;
  options?: string[];
}

interface TableRow {
  id: string;
  cells: Record<string, any>;
}
```

### API Interfaces

```typescript
// Page API
interface PageAPI {
  createPage(data: CreatePageInput): Promise<Page>;
  getPage(id: string): Promise<Page>;
  updatePage(id: string, data: UpdatePageInput): Promise<Page>;
  deletePage(id: string): Promise<void>;
  movePage(id: string, newParentId: string | null, position: number): Promise<Page>;
  getPageChildren(parentId: string | null): Promise<Page[]>;
  toggleFavorite(id: string): Promise<Page>;
  getFavorites(): Promise<Page[]>;
}

// Block API
interface BlockAPI {
  createBlock(pageId: string, block: CreateBlockInput): Promise<Block>;
  updateBlock(pageId: string, blockId: string, data: UpdateBlockInput): Promise<Block>;
  deleteBlock(pageId: string, blockId: string): Promise<void>;
  reorderBlocks(pageId: string, blockIds: string[]): Promise<void>;
  duplicateBlock(pageId: string, blockId: string): Promise<Block>;
}

// File API
interface FileAPI {
  uploadFile(file: File, pageId: string): Promise<FileMetadata>;
  getFile(id: string): Promise<Blob>;
  deleteFile(id: string): Promise<void>;
}

// Search API
interface SearchAPI {
  searchPages(query: string): Promise<SearchResult[]>;
  getRecentPages(limit: number): Promise<Page[]>;
}

// Share API
interface ShareAPI {
  createShare(pageId: string, permission: 'view' | 'edit'): Promise<PageShare>;
  deleteShare(shareId: string): Promise<void>;
}
```

## Data Models

### Database Schema

```sql
-- Pages table
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled',
  icon TEXT,
  cover_image TEXT,
  content JSONB NOT NULL DEFAULT '[]'::jsonb,
  position INTEGER NOT NULL DEFAULT 0,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_pages_user_id ON pages(user_id);
CREATE INDEX idx_pages_parent_id ON pages(parent_id);
CREATE INDEX idx_pages_favorites ON pages(user_id, is_favorite) WHERE is_favorite = true;

-- Full-text search
ALTER TABLE pages ADD COLUMN search_vector tsvector;
CREATE INDEX idx_pages_search ON pages USING gin(search_vector);

-- Files table
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  filename TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT files_size_check CHECK (file_size > 0 AND file_size <= 10485760)
);

-- Page shares table
CREATE TABLE page_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL REFERENCES auth.users(id),
  shared_with UUID REFERENCES auth.users(id),
  permission TEXT NOT NULL CHECK (permission IN ('view', 'edit')),
  share_link TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Templates table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  content JSONB NOT NULL,
  is_system BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Core Data Properties

**Property 1: Page Creation Persistence**
*For any* valid page title and optional parent ID, creating a page should result in a page object that can be retrieved with the same title and parent relationship.
**Validates: Requirements AC-1.1, AC-1.2**

**Property 2: Page Hierarchy Integrity**
*For any* page hierarchy of arbitrary depth, all ancestor-descendant relationships should be preserved and retrievable through parent_id references.
**Validates: Requirements AC-1.2**

**Property 3: Page Metadata Persistence**
*For any* page, setting icon or cover_image fields should persist those values and make them retrievable on subsequent queries.
**Validates: Requirements AC-1.6, AC-1.7**

**Property 4: Page Reordering Preserves All Pages**
*For any* set of sibling pages, reordering them should preserve all pages (no additions or deletions) and update their position values to reflect the new order.
**Validates: Requirements AC-1.5**

**Property 5: Block Creation and Retrieval**
*For any* valid block type and content, creating a block on a page should result in that block being present in the page's content array with the correct type and data.
**Validates: Requirements AC-3.1, AC-3.2, AC-3.3, AC-3.4, AC-3.5, AC-3.6, AC-3.7**

**Property 6: Block Reordering Preserves All Blocks**
*For any* page with multiple blocks, reordering the blocks should preserve all blocks (no additions or deletions) and update their position values to reflect the new order.
**Validates: Requirements AC-3.8**

**Property 7: Block Deletion Removes Exactly One Block**
*For any* page with N blocks, deleting a specific block should result in a page with N-1 blocks, where the deleted block is no longer present and all other blocks remain unchanged.
**Validates: Requirements AC-3.9**

**Property 8: Block Duplication Creates Independent Copy**
*For any* block, duplicating it should create a new block with the same content but a different ID, and both blocks should exist independently in the page content.
**Validates: Requirements AC-3.10**

### Rich Text Properties

**Property 9: Rich Text Marks Preservation**
*For any* text content with formatting marks (bold, italic, underline, strikethrough, code, link, color), storing and retrieving the text should preserve all marks and their attributes.
**Validates: Requirements AC-2.2, AC-2.9, AC-2.10**

**Property 10: Text Block Content Persistence**
*For any* text string, creating a text block with that content should allow retrieval of the exact same text content.
**Validates: Requirements AC-2.1**

**Property 11: Heading Level Preservation**
*For any* heading block created with a specific level (H1, H2, or H3), the block type should match the specified level when retrieved.
**Validates: Requirements AC-2.3**

**Property 12: List Structure Preservation**
*For any* list block (bulleted, numbered, or checkbox), the list structure and item content should be preserved when stored and retrieved.
**Validates: Requirements AC-2.4, AC-2.5, AC-2.6**

### Table Properties

**Property 13: Table Structure Operations Preserve Data**
*For any* table block, adding or removing columns or rows should preserve all existing cell data that is not in the removed column/row.
**Validates: Requirements AC-4.2, AC-4.3**

**Property 14: Table Column Type Persistence**
*For any* table column, setting its type (text, number, date, select, multi-select, checkbox) should persist that type and make it retrievable.
**Validates: Requirements AC-4.4**

**Property 15: Table Sorting Preserves Row Data**
*For any* table and sort criteria, sorting rows should reorder them according to the criteria while preserving all row data and cell values.
**Validates: Requirements AC-4.5**

**Property 16: Table Filtering Returns Matching Subset**
*For any* table and filter criteria, the filtered result should contain only rows that match the criteria, and all matching rows should be included.
**Validates: Requirements AC-4.6**

### File Management Properties

**Property 17: File Size Validation**
*For any* file upload attempt, files under or equal to 10MB should succeed, and files over 10MB should be rejected with an error.
**Validates: Requirements AC-5.1**

**Property 18: File Type Validation**
*For any* file upload attempt, supported file types (PDF, DOCX, PPTX, TXT, JPG, PNG, GIF) should succeed, and unsupported types should be rejected with an error.
**Validates: Requirements AC-5.2**

**Property 19: File Upload and Download Round-Trip**
*For any* valid file, uploading it and then downloading it should return a blob with the same content and size as the original file.
**Validates: Requirements AC-5.4**

**Property 20: File Deletion Removes Metadata and Storage**
*For any* uploaded file, deleting it should remove both its metadata record and make the file unretrievable from storage.
**Validates: Requirements AC-5.5**

### Search Properties

**Property 21: Search Returns Matching Pages**
*For any* search query, all returned pages should contain the query string in either their title or content, and all pages containing the query should be included in results.
**Validates: Requirements AC-6.1, AC-6.2**

**Property 22: Search Results Include Context**
*For any* search result, the result should include the matched content snippet showing where the query was found.
**Validates: Requirements AC-6.4**

**Property 23: Recent Pages Tracking**
*For any* page that is viewed, it should appear in the recent pages list ordered by view time (most recent first).
**Validates: Requirements AC-6.6**

### Template Properties

**Property 24: Template Creation Preserves Content**
*For any* page, creating a template from it should result in a template with the same block structure and content as the original page.
**Validates: Requirements AC-7.3, AC-7.4**

**Property 25: Page Creation from Template Copies Content**
*For any* template, creating a page from it should result in a new page with the same block structure and content as the template, but with a unique page ID.
**Validates: Requirements AC-7.2**

### Collaboration Properties

**Property 26: Share Link Uniqueness**
*For any* page share creation, the generated share_link should be unique across all shares.
**Validates: Requirements AC-8.1**

**Property 27: Share Permission Persistence**
*For any* page share, setting the permission level (view or edit) should persist that value and make it retrievable.
**Validates: Requirements AC-8.2**

**Property 28: Share Revocation Removes Access**
*For any* active share, deleting it should make the share_link invalid and prevent access to the page through that link.
**Validates: Requirements AC-8.4**

### Offline Support Properties

**Property 29: Page View Caches Locally**
*For any* page that is viewed, it should be stored in the local IndexedDB cache and be retrievable from cache.
**Validates: Requirements AC-10.1**

**Property 30: Offline Marking Persists**
*For any* page marked for offline access, it should be stored in the offline pages list and remain there until unmarked.
**Validates: Requirements AC-10.2**

**Property 31: Offline Operations Queue and Sync**
*For any* operation performed while offline, it should be added to the sync queue and processed when connectivity is restored, resulting in the same final state as if performed online.
**Validates: Requirements AC-10.3**

### Export/Import Properties

**Property 32: Markdown Export-Import Round-Trip**
*For any* page, exporting it as Markdown and then importing that Markdown should produce a page with equivalent content structure (text content and block types preserved).
**Validates: Requirements AC-11.1, AC-11.4**

**Property 33: HTML Export Contains Content**
*For any* page, exporting it as HTML should produce valid HTML that contains all the page's text content.
**Validates: Requirements AC-11.3**

**Property 34: Export Includes Nested Pages**
*For any* page with child pages, exporting it with includeChildren=true should include content from all descendant pages in the export.
**Validates: Requirements AC-11.5**

### Favorites Properties

**Property 35: Favorite Toggle Persistence**
*For any* page, toggling its is_favorite flag should persist the new value and make it retrievable on subsequent queries.
**Validates: Requirements AC-12.1, AC-12.3**

**Property 36: Favorites Query Returns Favorited Pages**
*For any* user, querying favorites should return exactly the set of pages where is_favorite is true for that user.
**Validates: Requirements AC-12.2**

**Property 37: Favorite Reordering Preserves All Favorites**
*For any* set of favorited pages, reordering them should preserve all favorites (no additions or deletions) and update their position values to reflect the new order.
**Validates: Requirements AC-12.4**

## Error Handling

### Error Categories

1. **Validation Errors**: Invalid input data (empty titles, invalid file types, oversized files)
2. **Authorization Errors**: Insufficient permissions to access or modify resources
3. **Network Errors**: Failed API calls, timeout errors
4. **Sync Errors**: Conflicts during offline sync, failed operations
5. **Storage Errors**: File upload failures, quota exceeded

### Error Handling Strategy

```typescript
// Error types
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

class NetworkError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'NetworkError';
  }
}

// User-facing error messages
const errorMessages = {
  'page.title.required': 'Page title is required',
  'file.too_large': 'File size must be less than 10MB',
  'file.invalid_type': 'File type not supported',
  'auth.unauthorized': 'You do not have permission to perform this action',
  'network.offline': 'You are offline. Changes will be synced when you reconnect',
  'sync.conflict': 'This page was modified by another user. Please refresh and try again',
};
```

### Graceful Degradation

- Offline mode: Queue operations and sync when online
- Failed file uploads: Retry with exponential backoff
- Search unavailable: Fall back to client-side filtering
- Missing images: Show placeholder with retry option

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit tests and property-based tests to ensure comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, error conditions, and integration points
- **Property tests**: Verify universal properties across all inputs through randomization

Both approaches are complementary and necessary. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Property-Based Testing

We will use **fast-check** (for TypeScript/JavaScript) as our property-based testing library. Each property test will:
- Run a minimum of 100 iterations with randomized inputs
- Reference its corresponding design document property via a comment tag
- Tag format: `// Feature: notion-like-resource-manager, Property {number}: {property_text}`

Example property test structure:

```typescript
import fc from 'fast-check';

// Feature: notion-like-resource-manager, Property 1: Page Creation Persistence
test('page creation persists title and parent relationship', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.string({ minLength: 1, maxLength: 255 }),
      fc.option(fc.uuid()),
      async (title, parentId) => {
        const page = await pageAPI.createPage({ title, parent_id: parentId });
        const retrieved = await pageAPI.getPage(page.id);
        
        expect(retrieved.title).toBe(title);
        expect(retrieved.parent_id).toBe(parentId);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing

Unit tests focus on:
- Specific examples demonstrating correct behavior
- Edge cases (empty inputs, boundary values, special characters)
- Error conditions (invalid inputs, authorization failures)
- Integration between components
- UI interactions and state management

Example unit test structure:

```typescript
describe('PageAPI', () => {
  it('creates a page with valid title', async () => {
    const page = await pageAPI.createPage({ title: 'Test Page' });
    expect(page.title).toBe('Test Page');
    expect(page.id).toBeDefined();
  });
  
  it('rejects empty title', async () => {
    await expect(
      pageAPI.createPage({ title: '' })
    ).rejects.toThrow(ValidationError);
  });
});
```

### Test Coverage Goals

- **Unit test coverage**: Minimum 80% code coverage
- **Property test coverage**: All 37 correctness properties implemented
- **Integration tests**: Critical user flows (create page → add blocks → save)
- **E2E tests**: Key scenarios (offline sync, file upload, search)

### Testing Tools

- **Unit Testing**: Vitest
- **Property-Based Testing**: fast-check
- **React Testing**: @testing-library/react
- **E2E Testing**: Playwright (for critical flows)
- **Mocking**: MSW (Mock Service Worker) for API mocking

### Continuous Integration

All tests run on every pull request:
1. Unit tests (fast, run first)
2. Property tests (slower, run in parallel)
3. Integration tests
4. E2E tests (critical paths only)

Property tests with 100 iterations ensure thorough validation while maintaining reasonable CI times.
