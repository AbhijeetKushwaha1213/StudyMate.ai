# Quick Test Checklist

**Use this for rapid testing - detailed guide in TESTING_GUIDE.md**

## Before You Start
- [ ] Clear browser cache (Cmd/Ctrl + Shift + R)
- [ ] Open browser console (F12)
- [ ] Check for errors (red text in console)

---

## 5-Minute Smoke Test

### Basic Functionality
- [ ] Create new page
- [ ] Click empty state to add first block
- [ ] Type some text
- [ ] Press Enter to create new paragraph
- [ ] Type `/` to open slash menu
- [ ] Select "Bulleted List"
- [ ] Type in list item
- [ ] Press Enter to add new item

**If all above work → Continue to full test**  
**If any fail → Report bug immediately**

---

## 15-Minute Core Test

### Text Editing
- [ ] Can click and type in text blocks
- [ ] Can create new paragraphs with Enter
- [ ] Can create headings via slash menu

### Block Management
- [ ] Hover shows action buttons (grip, copy, trash)
- [ ] Delete button removes block
- [ ] Copy button duplicates block
- [ ] Drag grip icon reorders blocks

### Lists
- [ ] Can edit list items
- [ ] Enter adds new item
- [ ] Backspace on empty deletes item
- [ ] "+ Add item" button works

### Checkboxes
- [ ] Can check/uncheck checkbox
- [ ] Can edit checkbox text
- [ ] Checked items show strikethrough

---

## 30-Minute Full Test

Complete all tests in TESTING_GUIDE.md

---

## Quick Bug Report

**Bug**: [What's broken]  
**Steps**: [How to reproduce]  
**Expected**: [What should happen]  
**Actual**: [What actually happens]  
**Console**: [Any errors]

---

## Status

- [ ] 5-min test: PASS / FAIL
- [ ] 15-min test: PASS / FAIL
- [ ] 30-min test: PASS / FAIL

**Overall**: Ready / Needs Work / Broken

**Top Issue**: _______________

**Top Success**: _______________
