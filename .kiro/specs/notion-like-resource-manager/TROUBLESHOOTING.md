# Troubleshooting Guide

**Common issues and how to fix them**

---

## Issue: Can't Type in Text Blocks

### Symptoms
- Click in block but no cursor appears
- Typing doesn't produce text
- Block doesn't respond to clicks

### Solutions
1. **Refresh browser** with cache clear (Cmd/Ctrl + Shift + R)
2. **Check console** for JavaScript errors
3. **Verify** TipTap editor is loading (check Network tab)
4. **Try** clicking directly on the text area, not the block border

### If Still Broken
Check `BlockRenderer.tsx` - TextBlockRenderer component:
- Verify `editor` is not null
- Verify `editable` prop is true
- Check onClick handler is attached

---

## Issue: Slash Menu Doesn't Appear

### Symptoms
- Type `/` but menu doesn't show
- Menu appears but is empty
- Menu appears in wrong position

### Solutions
1. **Check** if you're in a text block (not list or checkbox)
2. **Verify** SlashCommandMenu component is rendering
3. **Check console** for errors
4. **Try** typing `/` at start of empty block

### If Still Broken
Check `BlockEditor.tsx`:
- Verify `showSlashMenu` state is being set
- Verify `onSlashCommand` prop is passed to BlockRenderer
- Check `SlashCommandMenu` position calculation

---

## Issue: Block Actions Don't Work

### Symptoms
- Hover over block but no buttons appear
- Buttons appear but don't respond to clicks
- Console shows errors when clicking

### Solutions
1. **Hover slowly** over block (buttons fade in)
2. **Check** if buttons are visible (might be hidden by z-index)
3. **Look for console errors** when clicking
4. **Try keyboard shortcuts** instead (Cmd+D, Cmd+Shift+Backspace)

### If Still Broken
Check `BlockHoverMenu.tsx`:
- Verify `onDelete` and `onDuplicate` props are functions
- Check console.log messages appear when clicking
- Verify buttons have `type="button"` attribute

---

## Issue: Drag & Drop Doesn't Work

### Symptoms
- Can't grab blocks to drag
- Blocks don't move when dragging
- Drag starts but blocks don't reorder

### Solutions
1. **Click and hold** grip icon (⋮⋮) for 200ms before dragging
2. **Drag slowly** - fast drags might not register
3. **Check** if @dnd-kit is loaded (Network tab)
4. **Try** on different browser

### If Still Broken
Check `BlockEditor.tsx`:
- Verify `DndContext` wraps blocks
- Verify `SortableContext` has correct items
- Check `handleDragEnd` is called (add console.log)

---

## Issue: List Items Not Editable

### Symptoms
- Click in list item but can't type
- List displays but is read-only
- Enter doesn't create new item

### Solutions
1. **Click directly on text** not the bullet point
2. **Verify** you're in edit mode (not view mode)
3. **Check** if input field is rendered (inspect element)

### If Still Broken
Check `BlockRenderer.tsx` - ListBlockRenderer:
- Verify `editable` prop is true
- Check if input elements are rendered
- Verify `handleItemChange` is called

---

## Issue: Checkboxes Don't Toggle

### Symptoms
- Click checkbox but nothing happens
- Checkbox doesn't show checked state
- Console shows errors

### Solutions
1. **Click directly on checkbox** not the text
2. **Check console** for "Checkbox changed: true/false" message
3. **Verify** Checkbox component from shadcn/ui is loaded

### If Still Broken
Check `BlockRenderer.tsx` - CheckboxBlockRenderer:
- Verify `onCheckedChange` handler exists
- Check `onUpdate` is called with correct data
- Verify `checked` prop is boolean

---

## Issue: Changes Don't Save

### Symptoms
- Make changes but they disappear on refresh
- "Saving..." indicator doesn't appear
- Console shows save errors

### Solutions
1. **Check** if "Saving..." appears in top-right
2. **Wait** 1-2 seconds after change (debounced save)
3. **Check console** for API errors
4. **Verify** Supabase connection (Network tab)

### If Still Broken
Check `PageView.tsx`:
- Verify `handleBlocksChange` is called
- Check `updatePage.mutateAsync` is working
- Verify Supabase RLS policies allow updates

---

## Issue: Blocks Don't Display Correctly

### Symptoms
- Blocks show as blank
- Block content is missing
- Blocks overlap or have wrong styling

### Solutions
1. **Refresh page** to reload styles
2. **Check** if CSS is loaded (Network tab)
3. **Inspect element** to see if content exists in DOM
4. **Try** different block type

### If Still Broken
Check `BlockRenderer.tsx`:
- Verify correct renderer is called for block type
- Check if block data has required properties
- Verify CSS classes are applied

---

## Issue: Performance Problems

### Symptoms
- Page is slow to load
- Typing has lag
- Scrolling is janky
- Browser becomes unresponsive

### Solutions
1. **Reduce number of blocks** (test with <20 blocks)
2. **Close other tabs** to free memory
3. **Check browser task manager** for memory leaks
4. **Try** in incognito mode (disable extensions)

### If Still Broken
- Consider implementing virtualization for long pages
- Check for memory leaks in React components
- Profile with React DevTools

---

## Issue: Database/RLS Errors

### Symptoms
- Console shows "infinite recursion" errors
- 500 errors from Supabase
- "Permission denied" errors

### Solutions
1. **Check** if migrations are applied (Supabase dashboard)
2. **Verify** RLS policies are correct
3. **Check** user is authenticated
4. **Run** `npx supabase db push` to apply latest migrations

### If Still Broken
Check migrations:
- `20260214000001_fix_rls_infinite_recursion.sql`
- `20260214000002_fix_pages_rls_recursion.sql`
- Verify security definer functions exist

---

## Issue: Empty State Doesn't Work

### Symptoms
- Click empty state but nothing happens
- Empty state doesn't show
- Can't create first block

### Solutions
1. **Click directly on text** "Click here to start typing"
2. **Try** pressing Enter or Space while focused
3. **Check console** for errors

### If Still Broken
Check `BlockEditor.tsx`:
- Verify `handleInsertBlock` is called
- Check if block is added to blocks array
- Verify `onBlocksChange` is called

---

## General Debugging Steps

### 1. Check Console
```javascript
// Look for these messages:
"Delete clicked for block: [id]"
"Duplicate clicked for block: [id]"
"Checkbox changed: true/false"
```

### 2. Check Network Tab
- Verify API calls to Supabase
- Check for 500/404 errors
- Verify authentication token

### 3. Check React DevTools
- Verify component props
- Check state values
- Look for unnecessary re-renders

### 4. Check Browser Compatibility
- Test in Chrome (recommended)
- Test in Firefox
- Test in Safari
- Note: IE not supported

---

## Getting Help

If you can't resolve an issue:

1. **Gather information**:
   - Browser and version
   - OS and version
   - Console errors (full stack trace)
   - Steps to reproduce
   - Screenshots/video

2. **Check documentation**:
   - TESTING_GUIDE.md
   - FEATURE_ANALYSIS.md
   - IMPLEMENTATION_SUMMARY.md

3. **Create bug report**:
   - Use template in TESTING_GUIDE.md
   - Include all gathered information
   - Note what you've tried

---

## Quick Fixes

### Reset Everything
```bash
# Clear browser cache
Cmd/Ctrl + Shift + R

# Reset database (CAUTION: deletes data)
npx supabase db reset

# Reinstall dependencies
npm install

# Restart dev server
npm run dev
```

### Check Versions
```bash
# Node version (should be 18+)
node --version

# npm version
npm --version

# Check package.json for dependency versions
```

### Verify Setup
```bash
# Check Supabase connection
npx supabase status

# Check migrations
npx supabase db diff

# Push migrations
npx supabase db push
```

---

## Known Limitations

These are expected behaviors, not bugs:

1. **Code blocks** are read-only (Phase 3 feature)
2. **Tables** are read-only (Phase 3 feature)
3. **No formatting toolbar** yet (Phase 3 feature)
4. **Images/Files** need upload UI (Phase 3 feature)
5. **Callouts** have basic styling only
6. **Embeds** not fully implemented

---

## Success Indicators

You'll know it's working when:

✅ Can type in text blocks immediately  
✅ Slash menu appears and works  
✅ Blocks can be deleted/duplicated  
✅ Blocks can be dragged to reorder  
✅ Lists are editable  
✅ Checkboxes toggle  
✅ Changes save automatically  
✅ No console errors  

---

## Still Having Issues?

Create a detailed bug report with:
- Exact steps to reproduce
- Expected vs actual behavior
- Console errors
- Screenshots
- Browser/OS info

Then we can investigate further!
