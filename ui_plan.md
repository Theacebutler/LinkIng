# Resource Collection App - UI Plan

## Overview

A web application for collecting and organizing resources discovered online. Each resource tracks:

- The resource itself (link + title)
- Where the resource was found (source link)

## Tech Stack

- React for the frontend.
- An API for the backend - this will be created separately.
- use bun for the runtime environment, but-typescript for type checking
  and linting and bun's build tool for bundling.

## 1. Add Resource Form

### Fields

| Field          | Input Type | Required | Validation       |
| -------------- | ---------- | -------- | ---------------- |
| Resource Title | text       | No       | Min 1 character  |
| Resource URL   | url        | Yes      | Valid URL format |
| Source URL     | url        | No       | Valid URL format |

### UI Elements

- Section heading: "Add New Resource"
- Form container with:
  - Title input with placeholder: "e.g., CSS Grid Guide"
  - Resource URL input with placeholder: "https://..."
  - Source URL input with placeholder: "https://... (where you found it)"
  - Submit button: "Add Resource"
- Form validation feedback (inline errors)
- Success feedback (brief toast or message)

### States

- **Default**: Empty form, ready for input
- **Validation Error**: Red border on invalid fields, error message below
- **Submitting**: Button shows loading state, inputs disabled
- **Success**: Form clears, success message appears, list updates

---

## 2. Resource List

### Layout

- Section heading: "Your Resources" with count badge
- Optional: Search/filter input
- Grid or list of resource cards
- Empty state when no resources exist

### Resource Card

Each card displays:

```
┌─────────────────────────────────────┐
│ [Resource Title]           [Delete] │
│                                     │
│ 🔗 Resource URL        [Copy] [Open]│
│ 📌 Source: via URL     [Copy] [Open]│
│                                     │
│ Added: [date]                       │
└─────────────────────────────────────┘
```

### Card Actions

- **Open Resource**: Opens resource URL in new tab
- **Open Source**: Opens source URL in new tab
- **Copy Resource URL**: Copies to clipboard
- **Copy Source URL**: Copies to clipboard
- **Delete**: Removes resource (with confirmation)

### States

- **Empty**: "No resources yet. Add your first one above!"
- **With Resources**: Grid/list of cards
- **Filtered Empty**: "No resources match your search"

---

## 3. Data Model

### Resource Object

```javascript
{
  id: string,           // UUID or timestamp
  title: string,        // User-provided title
  resourceUrl: string,  // The actual resource link
  sourceUrl: string,    // Where resource was found
  createdAt: string     // ISO timestamp
}
```

---

## 4. Component Inventory

### Header

- App name: "Resource Collection"
- Tagline: "Your curated list of discovered resources"
- Clean, minimal styling

### Form Input

- States: default, focus, valid, invalid, disabled
- Label above input
- Helper text below
- Error message (red) when invalid

### Button (Primary)

- States: default, hover, active, disabled, loading
- Full-width on mobile, auto-width on desktop

### Resource Card

- Subtle shadow/border
- Hover effect (slight elevation)
- Truncate long URLs with ellipsis
- Show full URL on hover (tooltip) or in modal

### Toast Notification

- Position: bottom-right
- Auto-dismiss after 3 seconds
- Types: success (green), error (red), info (blue)

### Confirm Dialog

- Modal overlay
- "Are you sure?" message
- Cancel and Confirm buttons

---

## 5. User Flows

### Add Resource Flow

1. User fills in title, resource URL, source URL
2. User clicks "Add Resource"
3. Form validates inputs
4. If valid: send to API, clear form, show success toast, update list
5. If invalid: show error messages, keep form values

### Delete Resource Flow

1. User clicks delete button on card
2. Confirmation modal appears
3. User confirms deletion
4. Send a request to delete the resource
5. List updates, success toast shown

### Search/Filter Flow

1. User types in search input
2. A request is sent to the API to filter the resources
3. Matching resources displayed (title or URL contains query)

---

## 6. Acceptance Criteria

### Must Have

- [ ] Form accepts and validates resource title, URL, and source URL
- [ ] All resources display in a list/grid
- [ ] Each resource can be opened (new tab)
- [ ] Each source can be opened (new tab)
- [ ] Resources can be deleted
- [ ] Empty state shown when no resources exist
- [ ] Responsive design (works on mobile)
- [ ] Search/filter functionality

### Should Have

- [ ] URL validation with helpful error messages
- [ ] Success/error toast notifications
- [ ] Delete confirmation
- [ ] Copy URL to clipboard functionality

### Nice to Have

- [ ] Sort by date or title
- [ ] Keyboard shortcuts

---

## 7. Design Tokens

### Colors

```css
--color-primary: #3b82f6; /* Blue - buttons, links */
--color-primary-hover: #2563eb;
--color-success: #10b981; /* Green - success states */
--color-danger: #ef4444; /* Red - errors, delete */
--color-bg: #f8fafc; /* Light gray background */
--color-surface: #ffffff; /* Card background */
--color-text: #1e293b; /* Dark text */
--color-text-muted: #64748b; /* Secondary text */
--color-border: #e2e8f0; /* Subtle borders */
```

### Typography

- Font: System font stack (sans-serif)
- Headings: Bold, larger size
- Body: Regular weight, readable size (16px base)
- Monospace for URLs

### Spacing

- Base unit: 4px
- Common spacings: 8px, 16px, 24px, 32px
- Card padding: 16px
- Section gap: 24px

### Border Radius

- Small: 4px (inputs, buttons)
- Medium: 8px (cards)
- Large: 12px (modals)

---

## 8. Accessibility

- Semantic HTML elements
- ARIA labels for interactive elements
- Focus visible states
- Keyboard navigation support
- Color contrast meeting WCAG AA standards
- Form labels properly associated with inputs
