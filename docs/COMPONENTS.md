# 🧩 Shared Components Documentation

This portfolio uses **10 reusable shared components** to maintain consistency and reduce code duplication. All components are fully typed with TypeScript and follow React best practices.

## 📁 Location

```
src/components/shared/
├── Alert.tsx           # Toast notifications system
├── Button.tsx          # Reusable button component
├── ConfirmDialog.tsx   # Themed confirmation dialogs
├── ImageWithLoader.tsx # Image component with skeleton loader + lazy loading
├── Modal.tsx           # Base modal with Portal rendering
├── MonogramLogo.tsx    # Brand logo SVG component
├── ScrollToTopButton.tsx # Floating scroll-to-top button
├── SocialLinks.tsx     # Social media links
├── ToastContainer.tsx  # Toast notification container
└── VideoPlayer.tsx     # Lazy-loaded video player
```

---

## Modal System

### `Modal` - Base Modal Component

**Purpose:** Reusable modal foundation with Portal rendering, providing consistent behavior across the app.

**Features:**
- ✅ React Portal rendering to `document.body`
- ✅ Escape key handling
- ✅ Backdrop click to close
- ✅ Body scroll locking
- ✅ Configurable max width
- ✅ Optional close button
- ✅ Full accessibility (ARIA labels, focus management)

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  showCloseButton?: boolean;      // Default: true
  closeOnBackdropClick?: boolean; // Default: true
  closeOnEscape?: boolean;        // Default: true
  maxWidth?: "sm" | "md" | "lg" | "xl"; // Default: "lg"
  ariaLabel?: string;             // Default: "Modal dialog"
}
```

**Example:**
```typescript
import { Modal } from './shared/Modal';

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="md"
        ariaLabel="Settings dialog"
      >
        <div className="p-6">
          <h2>Modal Content</h2>
          <p>Your content here...</p>
        </div>
      </Modal>
    </>
  );
};
```

**Implementation Details:**
- Uses `createPortal` from `react-dom` to render outside component tree
- Prevents body scroll when open via `document.body.style.overflow = 'hidden'`
- Cleans up event listeners and styles on unmount
- Centers content with flexbox
- Backdrop with blur effect (`backdrop-blur-sm`)

---

### `ConfirmDialog` - Themed Confirmation Dialog

**Purpose:** Pre-styled confirmation dialogs built on the Modal base, replacing native `confirm()` for better UX.

**Features:**
- ✅ Three themed variants (danger, warning, info)
- ✅ Customizable button text
- ✅ Icon support with themed colors
- ✅ Consistent styling with portfolio theme
- ✅ Automatic modal management

**Props:**
```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;  // Default: "Confirm"
  cancelText?: string;   // Default: "Cancel"
  variant?: "danger" | "warning" | "info"; // Default: "warning"
}
```

**Variants:**

| Variant | Icon Color | Button Color | Use Case |
|---------|-----------|--------------|----------|
| `danger` | Red | Red | Destructive actions (delete, clear) |
| `warning` | Amber | Amber | Potentially risky actions |
| `info` | Cyan | Cyan | Informational confirmations |

**Example:**
```typescript
import { ConfirmDialog } from './shared/ConfirmDialog';

const MyComponent = () => {
  const [showDialog, setShowDialog] = useState(false);

  const handleDelete = () => {
    // Deletion logic here
    console.log('Item deleted');
  };

  return (
    <>
      <button onClick={() => setShowDialog(true)}>
        Delete Item
      </button>

      <ConfirmDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={handleDelete}
        title="Delete Item?"
        message="This action cannot be undone. Are you sure you want to proceed?"
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
};
```

**Real-World Usage:**

In the Contact component, it replaces native `confirm()`:

```typescript
// Before: Native browser confirm
onClick={() => {
  if (confirm("Clear draft?")) {
    clearDraft();
  }
}}

// After: Custom ConfirmDialog
<ConfirmDialog
  isOpen={showClearDraftDialog}
  onClose={() => setShowClearDraftDialog(false)}
  onConfirm={() => {
    contactForm.clearDraft();
    showAlert({ type: 'success', message: 'Draft cleared!' });
  }}
  title="Clear Draft?"
  message="This will remove all saved information. This action cannot be undone."
  confirmText="Clear Draft"
  cancelText="Keep Draft"
  variant="danger"
/>
```

**Benefits over Native `confirm()`:**
- ✅ Matches site design (consistent colors, typography)
- ✅ Better mobile UX (larger touch targets)
- ✅ Customizable button text
- ✅ Icon support for visual clarity
- ✅ Smooth animations
- ✅ Accessibility improvements

---

## Alert System

### `Alert` - Toast Notifications

**Purpose:** Display non-blocking toast notifications for success, error, warning, and info messages.

**Features:**
- ✅ Four message types with themed colors
- ✅ Auto-dismiss with configurable duration
- ✅ Optional footer content (HTML support)
- ✅ Manual dismiss button
- ✅ Smooth slide-in/fade-out animations
- ✅ Portal rendering for z-index management

**Usage via Hook:**
```typescript
import { useAlert } from './shared/Alert';

const MyComponent = () => {
  const { fire: showAlert, AlertComponent } = useAlert();

  const handleSuccess = () => {
    showAlert({
      type: 'success',
      title: 'Success!',
      message: 'Your changes have been saved.',
      duration: 3000 // Optional, default: 5000ms
    });
  };

  return (
    <>
      {AlertComponent}
      <button onClick={handleSuccess}>Save</button>
    </>
  );
};
```

**Alert Types:**
- `success` - Green theme, checkmark icon
- `error` - Red theme, X icon
- `warning` - Amber theme, exclamation icon
- `info` - Cyan theme, info icon

---

## Button Component

### `Button` - Reusable Button

**Purpose:** Consistent button styling with variants, sizes, and loading states.

**Props:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}
```

**Example:**
```typescript
<Button
  variant="primary"
  size="lg"
  loading={isSubmitting}
  onClick={handleSubmit}
>
  Submit
</Button>
```

---

## Social Links

### `SocialLinks` - Social Media Icons

**Purpose:** Consistent social media link display with icons and hover effects.

**Example:**
```typescript
import { SocialLinks } from './shared/SocialLinks';

<SocialLinks />
```

Renders LinkedIn, GitHub, and Email links with appropriate icons and styling.

---

## Video Player

### `VideoPlayer` - Lazy-Loaded Video Component

**Purpose:** Optimized video playback with lazy loading and accessibility.

**Features:**
- ✅ Lazy loading (only loads when in viewport)
- ✅ Custom controls
- ✅ Autoplay with muted option
- ✅ Responsive sizing
- ✅ Accessibility labels

**Example:**
```typescript
<VideoPlayer
  src="/videos/demo.mp4"
  poster="/images/poster.jpg"
  autoPlay
  muted
  loop
/>
```

---

## Design Patterns

### Portal Rendering

Modal and Alert components use React Portals to render outside the component hierarchy:

```typescript
import { createPortal } from 'react-dom';

return createPortal(
  <div className="modal-content">
    {children}
  </div>,
  document.body
);
```

**Benefits:**
- ✅ Avoids z-index conflicts
- ✅ Consistent stacking context
- ✅ Easier event management

### Body Scroll Locking

Modals prevent background scrolling:

```typescript
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }

  return () => {
    document.body.style.overflow = '';
  };
}, [isOpen]);
```

### Compound Component Pattern

The Alert system uses a compound pattern with a custom hook:

```typescript
// Hook provides both the fire function and component
const { fire: showAlert, AlertComponent } = useAlert();

// Component must be rendered in JSX
return (
  <>
    {AlertComponent}
    <button onClick={() => showAlert({ type: 'success', message: 'Done!' })}>
      Click me
    </button>
  </>
);
```

---

## Accessibility Considerations

### ARIA Labels

All modals include proper ARIA attributes:

```typescript
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Dialog Title</h2>
  <p id="modal-description">Dialog content...</p>
</div>
```

### Keyboard Navigation

- **Escape key** - Closes modals and dialogs
- **Tab** - Focus moves through interactive elements
- **Enter/Space** - Activates buttons

### Focus Management

Modals trap focus within the dialog:

```typescript
// Focus first interactive element when modal opens
useEffect(() => {
  if (isOpen && modalRef.current) {
    const firstButton = modalRef.current.querySelector('button');
    firstButton?.focus();
  }
}, [isOpen]);
```

---

## Styling Guidelines

### Color Themes

Components follow the portfolio's color scheme:

| Color | Usage | Tailwind Class |
|-------|-------|----------------|
| Cyan | Primary actions, info | `bg-cyan-600` |
| Emerald | Success messages | `bg-emerald-500` |
| Red | Danger, errors | `bg-red-600` |
| Amber | Warnings | `bg-amber-600` |
| Slate | Neutral UI | `bg-slate-900` |

### Responsive Design

All components are mobile-first:

```typescript
// Mobile: Full width button
// Desktop: Auto width button
<button className="w-full sm:w-auto">
  Submit
</button>
```

---

## Testing Components

### Manual Testing Checklist

For each modal/dialog:
- [ ] Opens and closes correctly
- [ ] Escape key closes modal
- [ ] Backdrop click closes modal (if enabled)
- [ ] Body scroll is locked when open
- [ ] Focus is managed properly
- [ ] Animations are smooth
- [ ] Responsive on mobile
- [ ] Accessible with screen reader

### Example Test

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

test('Modal closes on escape key', () => {
  const onClose = jest.fn();

  render(
    <Modal isOpen={true} onClose={onClose}>
      <div>Content</div>
    </Modal>
  );

  fireEvent.keyDown(window, { key: 'Escape' });
  expect(onClose).toHaveBeenCalled();
});
```

---

## Best Practices

### 1. Always Provide ARIA Labels

```typescript
// ✅ Good
<Modal isOpen={isOpen} onClose={onClose} ariaLabel="User settings">
  ...
</Modal>

// ❌ Bad
<Modal isOpen={isOpen} onClose={onClose}>
  ...
</Modal>
```

### 2. Clean Up Side Effects

```typescript
// ✅ Good - cleanup in useEffect
useEffect(() => {
  const handler = () => {...};
  document.addEventListener('keydown', handler);
  return () => document.removeEventListener('keydown', handler);
}, []);

// ❌ Bad - no cleanup
useEffect(() => {
  document.addEventListener('keydown', handler);
}, []);
```

### 3. Use Semantic HTML

```typescript
// ✅ Good
<button type="button" onClick={onClose}>Close</button>

// ❌ Bad
<div onClick={onClose}>Close</div>
```

### 4. Handle Loading States

```typescript
// ✅ Good
<Button loading={isSubmitting} onClick={handleSubmit}>
  Submit
</Button>

// ❌ Bad
<button onClick={handleSubmit}>
  {isSubmitting ? 'Loading...' : 'Submit'}
</button>
```

---

## Component Composition

Components can be composed for powerful effects:

### Modal with Alert

```typescript
const MyComponent = () => {
  const { fire: showAlert, AlertComponent } = useAlert();
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    // Do something
    setIsOpen(false);
    showAlert({ type: 'success', message: 'Saved!' });
  };

  return (
    <>
      {AlertComponent}
      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        title="Save Changes?"
        message="Your changes will be saved."
      />
    </>
  );
};
```

---

## Summary

The shared components library provides **8 reusable, accessible components** that maintain consistency across the portfolio:

| Component | Purpose | Lines | Key Feature |
|-----------|---------|-------|-------------|
| Modal | Base modal foundation | ~80 | Portal rendering |
| ConfirmDialog | Themed confirmations | ~110 | 3 variants |
| Alert | Toast notifications | ~150 | Auto-dismiss |
| Button | Reusable buttons | ~60 | Loading states |
| SocialLinks | Social media links | ~40 | Icon support |
| VideoPlayer | Lazy-loaded video | ~70 | Intersection Observer |

**Total:** ~510 lines of reusable UI code!

---

## Resources

- [React Portal Documentation](https://react.dev/reference/react-dom/createPortal)
- [ARIA Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [Tailwind CSS Components](https://tailwindui.com/components)
- [Heroicons](https://heroicons.com/)

---

**Want to add a new shared component?** Follow the patterns above and ensure full accessibility!
