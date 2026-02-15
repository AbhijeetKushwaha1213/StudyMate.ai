# Testing Guide - Notion Resource Manager

**Date**: February 15, 2026  
**Purpose**: Systematic testing of all implemented features  
**Status**: Ready for Testing

---

## Pre-Testing Setup

### 1. Clear Browser Cache
```
Chrome/Edge: Cmd/Ctrl + Shift + R
Firefox: Cmd/Ctrl + Shift + Delete
Safari: Cmd + Option + E
```

### 2. Open Browser Console
```
Chrome/Edge/Firefox: F12 or Cmd/Ctrl + Shift + I
Safari: Cmd + Option + C
```

### 3. Check for Errors
- Look for red errors in console
- Note any warnings (yellow)
- Keep console open during testing

---

## Testing Checklist

### 🔴 CRITICAL FEATURES (Must Work)

#### Test 1: Page Creation & Navigation
- [ ] Click "New Page" button in sidebar
- [ ] Page is created with "Untitled" title
- [ ] Page appears in sidebar
- [ ] Page content area shows empty state
- [ ] Empty state shows instructions and icon

**Expected Result**: New page created successfully  
**If Failed**: Note error message and console output

---

#### Test 2: Text Block Creation
- [ ] Click on empty state message
- [ ] First text block is created
- [ ] Cursor appears in block (blinking)
- [ ] Type some text
- [ ] Text appears as you type
- [ ] Press Enter to create new paragraph
- [ ] New paragraph block is created below

**Expected Result**: Can type and create paragraphs  
**If Failed**: Check if cursor appears, if text shows, if Enter works

---

#### Test 3: Slash Command Menu
- [ ] In empty block, type `/`
- [ ] Slash menu appears
- [ ] Menu shows list of block types
- [ ] Type "head" to filter
- [ ] Only heading options show
- [ ] Press Escape to close menu
- [ ] Menu closes

**Expected Result**: Slash menu works and filters  
**If Failed**: Note if menu appears, if filtering works

---

#### Test 4: Block Type Creation
Test each block type via slash menu:

**Text Blocks**:
- [ ] Type `/` then select "Text" - creates paragraph
- [ ] Type `/` then select "Heading 1" - creates H1
- [ ] Type `/` then select "Heading 2" - creates H2
- [ ] Type `/` then select "Heading 3" - creates H3
- [ ] Verify headings have different sizes

**List Blocks**:
- [ ] Type `/` then select "Bulleted List" - creates bullet list
- [ ] Type `/` then select "Numbered List" - creates numbered list
- [ ] Type `/` then select "Checkbox" - creates checkbox

**Other Blocks**:
- [ ] Type `/` then select "Quote" - creates quote block
- [ ] Type `/` then select "Callout" - creates callout
- [ ] Type `/` then select "Code" - creates code block
- [ ] Type `/` then select "Divider" - creates horizontal line

**Expected Result**: All block types create successfully  
**If Failed**: Note which block types fail to create

---

#### Test 5: Block Hover Menu
- [ ] Hover over any block
- [ ] Three buttons appear in top-right corner
- [ ] Buttons are: Grip (⋮⋮), Copy, Trash
- [ ] Buttons are visible and clickable
- [ ] Move mouse away - buttons fade out

**Expected Result**: Hover menu appears and disappears  
**If Failed**: Note if buttons appear, if they're clickable

---

#### Test 6: Block Deletion
- [ ] Create 3 text blocks
- [ ] Hover over middle block
- [ ] Click trash icon (red)
- [ ] Block is removed
- [ ] Other blocks remain
- [ ] Check console for "Delete clicked for block: [id]"

**Expected Result**: Block is deleted  
**If Failed**: Note if button clicks, if block disappears

---

#### Test 7: Block Duplication
- [ ] Create a text block with some text
- [ ] Hover over block
- [ ] Click copy icon
- [ ] New block appears below with same content
- [ ] Both blocks are editable
- [ ] Check console for "Duplicate clicked for block: [id]"

**Expected Result**: Block is duplicated  
**If Failed**: Note if button clicks, if duplicate appears

---

#### Test 8: Block Drag & Drop
- [ ] Create 3 text blocks with different text (A, B, C)
- [ ] Hover over block B
- [ ] Click and hold grip icon (⋮⋮)
- [ ] Drag upward
- [ ] Block B moves above block A
- [ ] Release mouse
- [ ] Order is now: B, A, C
- [ ] Refresh page - order persists

**Expected Result**: Blocks can be reordered by dragging  
**If Failed**: Note if drag starts, if blocks move, if order persists

---

### 🟡 HIGH PRIORITY FEATURES

#### Test 9: List Item Editing
- [ ] Create a bulleted list
- [ ] Click in the list item text
- [ ] Type some text
- [ ] Text appears
- [ ] Press Enter
- [ ] New list item created below
- [ ] Cursor moves to new item
- [ ] Type in new item

**Expected Result**: Can edit list items and add new ones  
**If Failed**: Note if clicking works, if Enter creates new item

---

#### Test 10: List Item Deletion
- [ ] Create a list with 3 items
- [ ] Clear text from middle item (Backspace all text)
- [ ] Press Backspace again
- [ ] Item is deleted
- [ ] Cursor moves to previous item
- [ ] Hover over an item
- [ ] Small trash icon appears
- [ ] Click trash icon
- [ ] Item is deleted

**Expected Result**: Can delete list items  
**If Failed**: Note which deletion method fails

---

#### Test 11: List Item Addition
- [ ] Create a list with 2 items
- [ ] Scroll to bottom of list
- [ ] Click "+ Add item" button
- [ ] New empty item appears
- [ ] Can type in new item

**Expected Result**: Can add items via button  
**If Failed**: Note if button appears, if it works

---

#### Test 12: Checkbox Interaction
- [ ] Create a checkbox block
- [ ] Click the checkbox (square)
- [ ] Checkbox becomes checked (✓)
- [ ] Text shows strikethrough
- [ ] Click checkbox again
- [ ] Checkbox becomes unchecked
- [ ] Strikethrough disappears
- [ ] Check console for "Checkbox changed: true/false"

**Expected Result**: Checkbox toggles on/off  
**If Failed**: Note if checkbox clicks, if visual changes

---

#### Test 13: Checkbox Text Editing
- [ ] Create a checkbox block
- [ ] Click on the text (not checkbox)
- [ ] Cursor appears in text
- [ ] Type some text
- [ ] Text appears
- [ ] Check the checkbox
- [ ] Text shows strikethrough while editing

**Expected Result**: Can edit checkbox text  
**If Failed**: Note if clicking works, if typing works

---

### 🟢 MEDIUM PRIORITY FEATURES

#### Test 14: Page Title Editing
- [ ] Click on page title at top
- [ ] Title becomes editable
- [ ] Type new title
- [ ] Click outside title
- [ ] Title saves
- [ ] Check sidebar - title updated there too
- [ ] Refresh page - title persists

**Expected Result**: Page title can be edited  
**If Failed**: Note if title becomes editable, if it saves

---

#### Test 15: Auto-Save Indicator
- [ ] Make any change to page content
- [ ] Look at top-right corner
- [ ] "Saving..." indicator appears briefly
- [ ] Indicator disappears after ~1 second
- [ ] Refresh page
- [ ] Changes are persisted

**Expected Result**: Auto-save works  
**If Failed**: Note if indicator shows, if changes persist

---

#### Test 16: Multiple Block Types Together
- [ ] Create this sequence:
  1. Heading 1 with text
  2. Paragraph with text
  3. Bulleted list with 3 items
  4. Checkbox with text
  5. Quote with text
  6. Code block
  7. Divider
- [ ] All blocks display correctly
- [ ] Can edit each block
- [ ] Can reorder blocks
- [ ] Refresh page - all persist

**Expected Result**: Multiple block types work together  
**If Failed**: Note which blocks have issues

---

#### Test 17: Keyboard Shortcuts
- [ ] Create a text block
- [ ] Press Cmd/Ctrl + D
- [ ] Block is duplicated
- [ ] Press Cmd/Ctrl + Shift + Backspace
- [ ] Block is deleted
- [ ] Create 3 blocks
- [ ] Focus middle block
- [ ] Press Cmd/Ctrl + Shift + ↑
- [ ] Block moves up
- [ ] Press Cmd/Ctrl + Shift + ↓
- [ ] Block moves down

**Expected Result**: Keyboard shortcuts work  
**If Failed**: Note which shortcuts don't work

---

### 🔵 NICE TO HAVE FEATURES

#### Test 18: Page Icon
- [ ] Click on icon area (left of title)
- [ ] Icon picker appears (if implemented)
- [ ] Select an emoji
- [ ] Icon appears on page
- [ ] Icon appears in sidebar

**Expected Result**: Can add page icon  
**If Failed**: Note if icon picker appears

---

#### Test 19: Page Favorites
- [ ] Right-click on page in sidebar (or look for star icon)
- [ ] Click "Add to Favorites"
- [ ] Page appears in Favorites section
- [ ] Click "Remove from Favorites"
- [ ] Page removed from Favorites

**Expected Result**: Can favorite pages  
**If Failed**: Note if favorite option exists

---

#### Test 20: Search Functionality
- [ ] Press Cmd/Ctrl + K
- [ ] Search modal opens
- [ ] Type page title
- [ ] Page appears in results
- [ ] Click result
- [ ] Navigates to page

**Expected Result**: Search works  
**If Failed**: Note if modal opens, if search works

---

## Bug Report Template

When you find a bug, report it using this format:

```markdown
### Bug #[number]: [Short Description]

**Severity**: Critical / High / Medium / Low

**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected Behavior**:
What should happen

**Actual Behavior**:
What actually happens

**Console Errors**:
```
Paste any console errors here
```

**Screenshots**:
[Attach if helpful]

**Browser**: Chrome/Firefox/Safari [version]
**OS**: macOS/Windows/Linux

**Additional Notes**:
Any other relevant information
```

---

## Performance Testing

### Test 21: Large Page Performance
- [ ] Create a page with 50+ blocks
- [ ] Scroll through page - smooth scrolling?
- [ ] Edit a block - responsive?
- [ ] Add new block - quick?
- [ ] Delete block - quick?
- [ ] Drag block - smooth?

**Expected Result**: Page remains responsive  
**If Failed**: Note where performance degrades

---

### Test 22: Multiple Pages
- [ ] Create 10 pages
- [ ] Navigate between pages
- [ ] Each page loads quickly
- [ ] Sidebar updates correctly
- [ ] No memory leaks (check browser task manager)

**Expected Result**: Multiple pages work well  
**If Failed**: Note performance issues

---

## Edge Cases Testing

### Test 23: Empty States
- [ ] Create block with no content
- [ ] Try to save - works?
- [ ] Create list with empty items
- [ ] Try to save - works?
- [ ] Delete all blocks from page
- [ ] Empty state appears again

**Expected Result**: Empty states handled gracefully  
**If Failed**: Note what breaks

---

### Test 24: Special Characters
- [ ] Type special characters: @#$%^&*()
- [ ] Type emojis: 😀🎉✨
- [ ] Type unicode: 你好, مرحبا, Привет
- [ ] All characters display correctly
- [ ] All characters save correctly

**Expected Result**: Special characters work  
**If Failed**: Note which characters fail

---

### Test 25: Long Content
- [ ] Create text block
- [ ] Paste very long text (1000+ words)
- [ ] Block handles it gracefully
- [ ] Can scroll within block
- [ ] Can edit long text
- [ ] Saves correctly

**Expected Result**: Long content works  
**If Failed**: Note issues

---

## Accessibility Testing

### Test 26: Keyboard Navigation
- [ ] Use only keyboard (no mouse)
- [ ] Tab through interface
- [ ] Can reach all interactive elements
- [ ] Can create blocks
- [ ] Can edit blocks
- [ ] Can delete blocks

**Expected Result**: Fully keyboard accessible  
**If Failed**: Note where keyboard fails

---

### Test 27: Screen Reader (Optional)
- [ ] Enable screen reader (VoiceOver/NVDA/JAWS)
- [ ] Navigate through page
- [ ] Screen reader announces elements
- [ ] Can understand page structure
- [ ] Can perform actions

**Expected Result**: Screen reader friendly  
**If Failed**: Note accessibility issues

---

## Test Results Summary

After completing all tests, fill out this summary:

### Critical Features (Must Work)
- [ ] All critical tests passed
- [ ] Some critical tests failed (list below)
- [ ] Many critical tests failed (needs immediate attention)

**Failed Critical Tests**:
1. 
2. 
3. 

### High Priority Features
- [ ] All high priority tests passed
- [ ] Some high priority tests failed (list below)

**Failed High Priority Tests**:
1. 
2. 

### Overall Assessment
- [ ] Ready for production use
- [ ] Ready with minor issues
- [ ] Needs more work before production
- [ ] Significant issues found

### Top 3 Issues Found
1. 
2. 
3. 

### Top 3 Things That Work Well
1. 
2. 
3. 

### Recommendations
- [ ] Ship as-is
- [ ] Fix critical bugs first
- [ ] Add Phase 3 features
- [ ] Improve performance
- [ ] Improve UX/UI

---

## Next Steps After Testing

Based on test results:

**If 90%+ tests pass**:
→ Consider shipping or moving to Phase 3

**If 70-90% tests pass**:
→ Fix failed tests, then retest

**If <70% tests pass**:
→ Review implementation, fix major issues

---

## Notes Section

Use this space for any additional observations:

```
[Your notes here]
```

