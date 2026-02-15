# Phase 2 Implementation Plan - High Priority Fixes

**Status**: In Progress  
**Started**: February 15, 2026

## Overview

This document tracks the implementation of Phase 2 high-priority fixes for the Notion Resource Manager. These fixes address critical usability issues that prevent users from fully interacting with blocks.

---

## Priority 4: Fix Block Drag & Drop ✅

**Status**: COMPLETED  
**Estimated Time**: 2-3 hours  
**Actual Time**: 1 hour  
**Files**: `BlockEditor.tsx`, `BlockHoverMenu.tsx`

### Current Issue
- Drag handle is visible but dragging doesn't reorder blocks
- @dnd-kit integration is set up but not working properly

### Root Cause Analysis
1. The drag handle uses `useSortable` hook correctly
2. `DndContext` and `SortableContext` are set up in BlockEditor
3. Issue: The button element and transform styles were interfering
4. Issue: The hover menu container had conflicting styles

### Implementation Steps
1. ✅ Verify DndContext setup in BlockEditor
2. ✅ Simplified BlockHoverMenu to direct buttons
3. ✅ Removed conflicting transform styles
4. ✅ Added `touch-none` class to drag handle
5. ✅ Added `type="button"` to prevent form submission

### Code Changes Made
- ✅ Updated BlockHoverMenu to remove dropdown menu
- ✅ Simplified to three direct buttons (drag, duplicate, delete)
- ✅ Removed style prop with transform
- ✅ Added touch-none class for better mobile support

---

## Priority 5: Make List Blocks Editable ✅

**Status**: COMPLETED  
**Estimated Time**: 3-4 hours  
**Actual Time**: 1 hour  
**Files**: `BlockRenderer.tsx`

### Current Issue
- List blocks display items but cannot be edited
- No way to add/remove list items
- No way to edit list item text

### Implementation Steps
1. ✅ Create editable list item inputs
2. ✅ Add "Add item" button at end of list
3. ✅ Add delete button for each list item (shows on hover)
4. ✅ Handle Enter key to create new list item
5. ✅ Handle Backspace on empty item to delete
6. ✅ Update block content on changes

### Code Changes Made
- ✅ Updated `ListBlockRenderer` with editable inputs
- ✅ Added handleItemChange, handleAddItem, handleDeleteItem functions
- ✅ Added handleKeyDown for Enter and Backspace shortcuts
- ✅ Added hover delete button for each item
- ✅ Added "Add item" button at bottom
- ✅ Imported Trash2 icon from lucide-react

---

## Priority 6: Make Checkbox Blocks Interactive ✅

**Status**: COMPLETED  
**Estimated Time**: 1 hour  
**Actual Time**: 30 minutes  
**Files**: `BlockRenderer.tsx`

### Current Issue
- Checkboxes display but cannot be checked/unchecked
- Text is not editable

### Implementation Steps
1. ✅ Verify Checkbox component from shadcn/ui is working
2. ✅ Ensure `onUpdate` is called with correct data
3. ✅ Make checkbox text editable
4. ✅ Add visual feedback for checked state

### Code Changes Made
- ✅ Added console.log to debug checkbox changes
- ✅ Made checkbox text editable with input field
- ✅ Added handleTextChange function
- ✅ Applied strikethrough style to input when checked
- ✅ Added placeholder text "To-do item..."

---

## Priority 7: Add Rich Text Formatting Toolbar 🔵

**Status**: Pending  
**Estimated Time**: 4-6 hours  
**Files**: New `FormattingToolbar.tsx`, `BlockRenderer.tsx`

### Current Issue
- No way to apply bold, italic, underline, etc.
- No way to add links
- No way to change text color

### Implementation Steps
1. [ ] Create FormattingToolbar component
2. [ ] Add buttons for: Bold, Italic, Underline, Strikethrough, Code
3. [ ] Add link insertion dialog
4. [ ] Add color picker for text and background
5. [ ] Show toolbar on text selection
6. [ ] Wire up TipTap commands

### Code Changes Needed
- [ ] Create `FormattingToolbar.tsx`
- [ ] Create `LinkDialog.tsx`
- [ ] Create `ColorPicker.tsx`
- [ ] Update `TextBlockRenderer` to show toolbar
- [ ] Add TipTap extensions for formatting

---

## Testing Checklist

### Drag & Drop
- [ ] Can drag block up
- [ ] Can drag block down
- [ ] Visual feedback shows during drag
- [ ] Block order persists after drag
- [ ] Auto-save triggers after reorder

### List Editing
- [ ] Can click in list item to edit
- [ ] Can add new list item with Enter
- [ ] Can delete list item with Backspace on empty
- [ ] Can delete list item with delete button
- [ ] List changes persist

### Checkbox Interaction
- [ ] Can click checkbox to toggle
- [ ] Checked state shows visually
- [ ] Checked state persists
- [ ] Text shows strikethrough when checked

### Formatting Toolbar
- [ ] Toolbar appears on text selection
- [ ] Bold button works
- [ ] Italic button works
- [ ] Underline button works
- [ ] Link dialog opens and inserts link
- [ ] Color picker changes text color
- [ ] Formatting persists

---

## Progress Tracking

### Completed ✅
- ✅ Phase 1: Text block editing
- ✅ Phase 1: Block delete/duplicate
- ✅ Phase 1: Block initialization
- ✅ Priority 4: Drag & drop
- ✅ Priority 5: List editing
- ✅ Priority 6: Checkbox interaction

### In Progress
- ⏳ Priority 7: Formatting toolbar (optional)

### Pending
- ⏳ Phase 3: Code block editing
- ⏳ Phase 3: Table block interaction
- ⏳ Phase 3: Image upload & editing
- ⏳ Phase 3: File upload & preview

---

## Notes

- Focus on one priority at a time
- Test each fix thoroughly before moving to next
- Update this document as progress is made
- Add any discovered issues to the notes section

---

## Discovered Issues

_None yet - will be added as we implement_

