import {
  useState,
  useEffect,
  useCallback,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";

/**
 * Persists state to localStorage with automatic synchronization.
 * Handles JSON serialization/deserialization and provides error handling for storage operations.
 *
 * @template T - The type of the value to store
 * @param key - The localStorage key to use for storage
 * @param initialValue - The initial value if no stored value exists
 * @returns A stateful value and setter function, similar to useState
 *
 * @example
 * const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
 * setTheme('dark'); // Automatically saves to localStorage
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback<Dispatch<SetStateAction<T>>>(
    (value) => {
      try {
        setStoredValue((currentValue) => {
          const valueToStore =
            value instanceof Function ? value(currentValue) : value;

          if (typeof window !== "undefined") {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }

          return valueToStore;
        });
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  return [storedValue, setValue];
};

/**
 * Detects clicks outside of a referenced element and triggers a callback.
 * Useful for closing dropdowns, modals, or menus when clicking outside.
 *
 * @template T - The type of HTML element to track (defaults to HTMLElement)
 * @param callback - Function to call when a click outside the element is detected
 * @returns A ref to attach to the element you want to track
 *
 * @example
 * const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));
 * return <div ref={dropdownRef}>Dropdown content</div>;
 */
export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  callback: () => void
): React.RefObject<T | null> => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [callback]);

  return ref;
};

/**
 * Debounces a value by delaying updates until after a specified delay period.
 * Useful for optimizing performance of expensive operations like API calls or search filtering.
 *
 * @template T - The type of the value to debounce
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds before updating the debounced value
 * @returns The debounced value that updates after the delay period
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 * // debouncedSearch only updates 500ms after user stops typing
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

interface WindowSize {
  width: number;
  height: number;
}

/**
 * Tracks the current window dimensions with automatic debouncing for performance.
 * Updates on window resize events and handles SSR environments safely.
 *
 * @param debounceDelay - Milliseconds to wait before updating after resize (default: 150ms)
 * @returns Object containing current window width and height in pixels
 *
 * @example
 * const { width, height } = useWindowSize(200);
 * const isMobile = width < 768;
 */
export const useWindowSize = (debounceDelay: number = 150): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, debounceDelay);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [debounceDelay]);

  return windowSize;
};

type ValidationRule<T> = (value: T) => string;

interface FormValidationReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleBlur: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  validateAll: () => boolean;
  resetForm: () => void;
  setValues: Dispatch<SetStateAction<T>>;
}

/**
 * Manages form state with built-in validation, error tracking, and field-touched status.
 * Handles common form operations like onChange, onBlur, validation, and reset.
 *
 * @template T - The shape of the form values object
 * @param initialValues - Initial values for all form fields
 * @param validationRules - Object mapping field names to arrays of validation functions
 * @returns Form state and handler functions for managing the form
 *
 * @example
 * const { values, errors, touched, handleChange, handleBlur, validateAll } = useFormValidation(
 *   { email: '', password: '' },
 *   {
 *     email: [(v) => !v ? 'Email required' : '', (v) => !v.includes('@') ? 'Invalid email' : ''],
 *     password: [(v) => v.length < 8 ? 'Must be 8+ characters' : '']
 *   }
 * );
 */
export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: Partial<Record<keyof T, ValidationRule<any>[]>>
): FormValidationReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validate = useCallback(
    (fieldName: keyof T, value: any): string => {
      const rules = validationRules[fieldName];
      if (!rules) return "";

      for (const rule of rules) {
        const error = rule(value);
        if (error) return error;
      }
      return "";
    },
    [validationRules]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));

      setTouched((prev) => {
        if (prev[name as keyof T]) {
          const error = validate(name as keyof T, value);
          setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
        }
        return prev;
      });
    },
    [validate]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      const error = validate(name as keyof T, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validate]
  );

  const validateAll = useCallback((): boolean => {
    let isValid = true;
    const newErrors: Partial<Record<keyof T, string>> = {};
    const newTouched: Partial<Record<keyof T, boolean>> = {};

    setValues((currentValues) => {
      Object.keys(validationRules).forEach((fieldName) => {
        const error = validate(
          fieldName as keyof T,
          currentValues[fieldName as keyof T]
        );
        newTouched[fieldName as keyof T] = true;
        if (error) {
          newErrors[fieldName as keyof T] = error;
          isValid = false;
        }
      });
      return currentValues;
    });

    setErrors(newErrors);
    setTouched(newTouched);
    return isValid;
  }, [validationRules, validate]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
    setValues,
  };
};

type AsyncStatus = "idle" | "pending" | "success" | "error";

interface AsyncReturn<T, P extends any[]> {
  execute: (...params: P) => Promise<T>;
  status: AsyncStatus;
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

/**
 * Manages async operations with loading, success, and error states.
 * Tracks operation status and provides an execute function to trigger the async call.
 *
 * @template T - The type of data returned by the async function
 * @template P - The parameter types accepted by the async function
 * @param asyncFunction - The async function to execute
 * @returns Object with execute function, status, data, error, and isLoading flag
 *
 * @example
 * const { execute, isLoading, data, error } = useAsync(async (userId: string) => {
 *   const response = await fetch(`/api/users/${userId}`);
 *   return response.json();
 * });
 * // Later: await execute('123');
 */
export const useAsync = <T, P extends any[] = any[]>(
  asyncFunction: (...params: P) => Promise<T>
): AsyncReturn<T, P> => {
  const [status, setStatus] = useState<AsyncStatus>("idle");
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...params: P): Promise<T> => {
      setStatus("pending");
      setData(null);
      setError(null);

      try {
        const response = await asyncFunction(...params);
        setData(response);
        setStatus("success");
        return response;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setStatus("error");
        throw error;
      }
    },
    [asyncFunction]
  );

  return { execute, status, data, error, isLoading: status === "pending" };
};

/**
 * Reveals elements on scroll using Intersection Observer API for scroll-triggered animations.
 * Element becomes visible once it enters the viewport, and the observer disconnects after first reveal.
 *
 * @param options - Optional IntersectionObserver configuration to override defaults
 * @returns Object with ref to attach to element and isVisible boolean state
 *
 * @example
 * const { ref, isVisible } = useScrollReveal();
 * return (
 *   <div ref={ref} className={isVisible ? 'fade-in' : 'opacity-0'}>
 *     Content revealed on scroll
 *   </div>
 * );
 */
export const useScrollReveal = (options?: IntersectionObserverInit) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px 200px 0px",
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options]);

  return { ref, isVisible };
};

export { useSnakeGame } from "./useSnakeGame";
export { useActiveTrip } from "./useActiveTrip";
export { useContactForm } from "./useContactForm";
export { usePageTracking } from "./usePageTracking";
export type { ContactFormValues } from "./useContactForm";
