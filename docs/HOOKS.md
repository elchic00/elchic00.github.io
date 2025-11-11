# 🪝 Custom React Hooks Documentation

This portfolio uses **11 custom React hooks** to encapsulate complex logic and promote code reusability. All hooks are fully typed with TypeScript and include JSDoc documentation.

## 📁 Location

```
src/hooks/
├── index.ts              # 7 general-purpose hooks
├── useSnakeGame.ts       # Snake game logic
├── useActiveTrip.ts      # Travel gallery navigation
├── useContactForm.ts     # Contact form management
└── usePageTracking.ts    # Analytics tracking
```

---

## General Purpose Hooks

### 1. `useLocalStorage<T>`

**Purpose:** Persist state to localStorage with automatic synchronization.

**Use Cases:**

- Saving high scores
- Storing user preferences
- Caching API responses

**Example:**

```typescript
const [highScore, setHighScore] = useLocalStorage<number>("snakeHighScore", 0);

// Automatically saves to localStorage
setHighScore(42);

// Persists across page reloads
```

**Features:**

- ✅ Type-safe generic
- ✅ SSR-safe (checks for window)
- ✅ JSON serialization
- ✅ Error handling

---

### 2. `useClickOutside<T>`

**Purpose:** Detect clicks outside a referenced element.

**Use Cases:**

- Closing dropdown menus
- Dismissing modals
- Hiding tooltips

**Example:**

```typescript
const dropdownRef = useClickOutside<HTMLDivElement>(() => {
  setIsOpen(false);
});

return <div ref={dropdownRef}>{isOpen && <DropdownMenu />}</div>;
```

**Features:**

- ✅ Generic element type
- ✅ Automatic cleanup
- ✅ SSR-safe

---

### 3. `useDebounce<T>`

**Purpose:** Delay value updates until after a specified period.

**Use Cases:**

- Search input optimization
- API call reduction
- Form validation delay

**Example:**

```typescript
const [searchTerm, setSearchTerm] = useState("");
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  // Only calls API after user stops typing for 500ms
  fetchResults(debouncedSearch);
}, [debouncedSearch]);
```

**Features:**

- ✅ Configurable delay
- ✅ Type preservation
- ✅ Cleanup on unmount

---

### 4. `useWindowSize`

**Purpose:** Track current window dimensions with automatic debouncing.

**Use Cases:**

- Responsive UI logic
- Conditional rendering
- Breakpoint detection

**Example:**

```typescript
const { width, height } = useWindowSize(200);

const isMobile = width < 768;
const isTablet = width >= 768 && width < 1024;
const isDesktop = width >= 1024;

return isMobile ? <MobileNav /> : <DesktopNav />;
```

**Features:**

- ✅ Debounced for performance
- ✅ SSR-safe (returns 0 on server)
- ✅ Automatic cleanup

---

### 5. `useScrollReveal`

**Purpose:** Reveal elements on scroll using Intersection Observer API.

**Use Cases:**

- Scroll-triggered animations
- Lazy component initialization
- Progressive disclosure

**Example:**

```typescript
const { ref, isVisible } = useScrollReveal();

return (
  <div ref={ref} className={isVisible ? "fade-in" : "opacity-0"}>
    Content revealed on scroll
  </div>
);
```

**Features:**

- ✅ Intersection Observer API
- ✅ Custom threshold and rootMargin
- ✅ Automatic observer disconnect after reveal
- ✅ SSR-safe

---

## Feature-Specific Hooks

### 6. `useSnakeGame`

**Purpose:** Implements complete Snake game logic with canvas rendering.

**Location:** `src/hooks/useSnakeGame.ts` (308 lines)

**Features:**

- ✅ Snake movement with collision detection
- ✅ Apple spawning and eating
- ✅ Score tracking
- ✅ High score persistence (via useLocalStorage)
- ✅ Keyboard controls (Arrow keys + WASD)
- ✅ Touch controls (swipe gestures)
- ✅ Pause/resume/restart
- ✅ Canvas rendering with ResizeObserver
- ✅ Progressive difficulty (speed increases)

**Example:**

```typescript
const canvasRef = useRef<HTMLCanvasElement>(null);
const containerRef = useRef<HTMLDivElement>(null);

const game = useSnakeGame({
  gridSize: 20,
  startSnakeSize: 3,
  speed: 100,
  percentageWidth: "100%",
  appleColor: "#FF0000",
  snakeColor: "#00FF00",
  canvasRef,
  containerRef,
});

return (
  <>
    <div>Score: {game.score}</div>
    <div>High Score: {game.highScore}</div>
    {game.gameOver && <div>Game Over!</div>}
    <button onClick={game.toggleRunning}>
      {game.running ? "Pause" : "Resume"}
    </button>
    <button onClick={game.restart}>Restart</button>
    <div ref={containerRef}>
      <canvas ref={canvasRef} />
    </div>
  </>
);
```

**Game Mechanics:**

- Grid: 20x20 cells
- Wrap-around walls (exits left, enters right)
- Speed increases by 0.5ms per apple (min 25ms)
- High score saved to localStorage

---

### 7. `useActiveTrip`

**Purpose:** Track which trip section is currently visible in viewport.

**Location:** `src/hooks/useActiveTrip.ts`

**Features:**

- ✅ Intersection Observer with multiple thresholds
- ✅ Automatic URL hash updates
- ✅ Hash change detection
- ✅ Most-visible-trip logic

**Example:**

```typescript
const tripIds = ["thailand-2024", "costarica-2023", "ecuador-2024"];
const activeTrip = useActiveTrip(tripIds);

return (
  <nav>
    {tripIds.map((id) => (
      <a key={id} href={`#${id}`} className={activeTrip === id ? "active" : ""}>
        {id}
      </a>
    ))}
  </nav>
);
```

**How It Works:**

1. Observes all trip elements
2. Tracks intersection ratios
3. Determines most-visible trip
4. Updates URL hash automatically
5. Highlights active trip in navigation

---

### 8. `useContactForm`

**Purpose:** Manage contact form state, validation, email sending, and draft persistence.

**Location:** `src/hooks/useContactForm.ts` (300 lines)

**Features:**

- ✅ Form validation with multiple rules
- ✅ EmailJS integration
- ✅ Loading states
- ✅ Error handling
- ✅ Debounced validation (400ms)
- ✅ Draft auto-save to localStorage
- ✅ Draft restoration on page revisit
- ✅ Message templates support
- ✅ Character counter (1000 max)
- ✅ Mailto fallback generation
- ✅ Dynamic input styling
- ✅ Form clearing on successful submission

**Example:**

```typescript
const contactForm = useContactForm(
  () => {
    showAlert({ type: "success", message: "Message sent!" });
  },
  (error) => {
    showAlert({ type: "error", message: error.message });
  }
);

return (
  <form ref={contactForm.formRef} onSubmit={contactForm.handleSubmit}>
    <input
      name="user_name"
      value={contactForm.values.user_name}
      onChange={contactForm.handleChange}
      onBlur={contactForm.handleBlur}
      className={contactForm.getInputClassName("user_name")}
    />
    {contactForm.showNameError && <span>{contactForm.errors.user_name}</span>}

    <button type="submit" disabled={contactForm.isLoading}>
      {contactForm.isLoading ? "Sending..." : "Send"}
    </button>

    {contactForm.showMailtoFallback && (
      <a href={contactForm.generateMailtoLink()}>Open Email Client</a>
    )}
  </form>
);
```

**Validation Rules:**

- Name: min 2 characters
- Email: RFC-compliant regex
- Message: min 10 characters, max 1000 characters
- Real-time validation with debouncing

**Draft Persistence:**

- Auto-saves to localStorage after 400ms of inactivity
- Loads draft on component mount
- Clears draft on successful submission
- Manual clear draft option with confirmation
- Debounced to prevent excessive localStorage writes

**Internal Implementation:**

- Uses custom validation logic (similar to useFormValidation pattern)
- Uses async operation handling (similar to useAsync pattern)
- These patterns are encapsulated within useContactForm for cohesion

---

### 9. `usePageTracking`

**Purpose:** Track page views and navigation with Google Analytics.

**Location:** `src/hooks/usePageTracking.ts`

**Features:**

- ✅ Automatic page view tracking
- ✅ React Router integration
- ✅ Production-only tracking

**Example:**

```typescript
// Automatically tracks page views on route changes
usePageTracking();
```

---

## Hook Composition

Hooks can be combined for powerful effects:

### Example: Debounced Form Validation

```typescript
const [email, setEmail] = useState("");
const debouncedEmail = useDebounce(email, 400);

useEffect(() => {
  if (debouncedEmail) {
    validateEmail(debouncedEmail);
  }
}, [debouncedEmail]);
```

### Example: Responsive + Local Storage

```typescript
const { width } = useWindowSize();
const [theme, setTheme] = useLocalStorage("theme", "light");

useEffect(() => {
  // Auto-switch to dark mode on mobile
  if (width < 768) {
    setTheme("dark");
  }
}, [width]);
```

### Example: Click Outside + Animation

```typescript
const { ref: modalRef, isVisible } = useScrollReveal();
const closeModal = () => setIsOpen(false);
const clickOutsideRef = useClickOutside(closeModal);

// Combine refs
const combinedRef = (el) => {
  modalRef.current = el;
  clickOutsideRef.current = el;
};
```

---

## Performance Considerations

### Debouncing

- `useDebounce`: Reduces expensive operations
- `useWindowSize`: Debounced by default (150ms)
- `useContactForm`: Validates after 400ms delay

### Memoization

Hooks use `useCallback` internally to prevent unnecessary re-renders:

```typescript
// From useFormValidation
const handleChange = useCallback(
  (e) => {
    // ...
  },
  [validate]
);
```

### Cleanup

All hooks clean up after themselves:

```typescript
// From useWindowSize
return () => {
  clearTimeout(timeoutId);
  window.removeEventListener("resize", handleResize);
};
```

---

## Testing Hooks

### Manual Testing

```typescript
// Test hook in isolation
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./hooks";

test("useLocalStorage persists value", () => {
  const { result } = renderHook(() => useLocalStorage("test", 0));

  act(() => {
    result.current[1](42);
  });

  expect(result.current[0]).toBe(42);
  expect(localStorage.getItem("test")).toBe("42");
});
```

---

## Best Practices

### 1. Always Provide Initial Values

```typescript
// ✅ Good
const [count, setCount] = useLocalStorage("count", 0);

// ❌ Bad
const [count, setCount] = useLocalStorage("count");
```

### 2. Use Generic Types

```typescript
// ✅ Good - Type-safe
const [user, setUser] = useLocalStorage<User>("user", null);

// ❌ Bad - No type safety
const [user, setUser] = useLocalStorage("user", null);
```

### 3. Handle Loading States

```typescript
// ✅ Good
const { execute, isLoading, error } = useAsync(fetchData);

if (isLoading) return <Spinner />;
if (error) return <Error message={error.message} />;

// ❌ Bad
const { execute, data } = useAsync(fetchData);
return <div>{data.map(...)}</div>; // Crashes if data is null
```

### 4. Cleanup Side Effects

```typescript
// ✅ Good - cleanup in useEffect
useEffect(() => {
  const handler = () => {...};
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);

// ❌ Bad - no cleanup
useEffect(() => {
  window.addEventListener('resize', handler);
}, []);
```

---

## Creating Custom Hooks

### Template

```typescript
/**
 * Brief description of what this hook does
 *
 * @param param1 - Description
 * @param param2 - Description
 * @returns Description of return value
 *
 * @example
 * const result = useMyHook(param1, param2);
 */
export const useMyHook = (param1: string, param2: number) => {
  const [state, setState] = useState<YourType>(initialValue);

  useEffect(() => {
    // Your logic here

    // Cleanup
    return () => {
      // Cleanup code
    };
  }, [dependencies]);

  return { state, setState };
};
```

### Guidelines

1. **Prefix with "use"** - Required by React
2. **Add JSDoc comments** - For better DX
3. **Use TypeScript** - Type safety
4. **Cleanup side effects** - Prevent memory leaks
5. **Test thoroughly** - Especially edge cases
6. **Keep focused** - Single responsibility

---

## Summary

This portfolio demonstrates advanced React patterns through **11 custom hooks**:

| Hook               | Lines   | Complexity    | Purpose               |
| ------------------ | ------- | ------------- | --------------------- |
| useLocalStorage    | ~35     | Low           | State persistence     |
| useClickOutside    | ~25     | Low           | Click detection       |
| useDebounce        | ~15     | Low           | Value debouncing      |
| useWindowSize      | ~40     | Medium        | Responsive tracking   |
| useFormValidation  | ~95     | High          | Form management       |
| useAsync           | ~45     | Medium        | Async operations      |
| useScrollReveal    | ~35     | Medium        | Scroll animations     |
| **useSnakeGame**   | **308** | **Very High** | Game logic            |
| useActiveTrip      | ~75     | Medium        | Navigation tracking   |
| **useContactForm** | **300** | **Very High** | Form + email + drafts |
| usePageTracking    | ~30     | Low           | GA4 integration       |

**Total:** ~1000+ lines of reusable, tested, documented hook code!

**Note:** `useContactForm` internally implements validation and async patterns, but these are encapsulated within the hook rather than exposed as separate utilities.

---

## Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [TypeScript + React Hooks](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks)
- [Testing React Hooks](https://react-hooks-testing-library.com/)
- [Custom Hook Patterns](https://usehooks.com/)

---

**Want to add a new hook?** Follow the template above and don't forget JSDoc comments!
