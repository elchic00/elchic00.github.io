import { useState, useEffect, useCallback, useRef, Dispatch, SetStateAction } from 'react';

/**
 * Hook for managing localStorage with type safety and SSR compatibility
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback<Dispatch<SetStateAction<T>>>((value) => {
    try {
      setStoredValue((currentValue) => {
        const valueToStore = value instanceof Function ? value(currentValue) : value;

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }

        return valueToStore;
      });
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
};

/**
 * Hook for detecting clicks outside an element (SSR-safe)
 */
export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  callback: () => void
): React.RefObject<T | null> => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    // SSR guard - only run in browser
    if (typeof document === 'undefined') return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [callback]);

  return ref;
};

/**
 * Hook for debouncing values
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
 * Hook for window resize with debouncing (SSR-safe)
 */
export const useWindowSize = (debounceDelay: number = 150): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    // SSR guard - only run in browser
    if (typeof window === 'undefined') return;

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

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [debounceDelay]);

  return windowSize;
};

type ValidationRule<T> = (value: T) => string;

interface FormValidationReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  validateAll: () => boolean;
  resetForm: () => void;
  setValues: Dispatch<SetStateAction<T>>;
}

/**
 * Hook for form validation
 */
export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: Partial<Record<keyof T, ValidationRule<any>[]>>
): FormValidationReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validate = useCallback((fieldName: keyof T, value: any): string => {
    const rules = validationRules[fieldName];
    if (!rules) return '';

    for (const rule of rules) {
      const error = rule(value);
      if (error) return error;
    }
    return '';
  }, [validationRules]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));

    setTouched(prev => {
      if (prev[name as keyof T]) {
        const error = validate(name as keyof T, value);
        setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
      }
      return prev;
    });
  }, [validate]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validate(name as keyof T, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validate]);

  const validateAll = useCallback((): boolean => {
    let isValid = true;
    const newErrors: Partial<Record<keyof T, string>> = {};
    const newTouched: Partial<Record<keyof T, boolean>> = {};

    // Use functional state update to get latest values
    setValues(currentValues => {
      Object.keys(validationRules).forEach(fieldName => {
        const error = validate(fieldName as keyof T, currentValues[fieldName as keyof T]);
        newTouched[fieldName as keyof T] = true;
        if (error) {
          newErrors[fieldName as keyof T] = error;
          isValid = false;
        }
      });
      return currentValues; // Don't modify values
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

type AsyncStatus = 'idle' | 'pending' | 'success' | 'error';

interface AsyncReturn<T, P extends any[]> {
  execute: (...params: P) => Promise<T>;
  status: AsyncStatus;
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

/**
 * Hook for managing async operations
 */
export const useAsync = <T, P extends any[] = any[]>(
  asyncFunction: (...params: P) => Promise<T>
): AsyncReturn<T, P> => {
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (...params: P): Promise<T> => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction(...params);
      setData(response);
      setStatus('success');
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setStatus('error');
      throw error;
    }
  }, [asyncFunction]);

  return { execute, status, data, error, isLoading: status === 'pending' };
};

export { useSnakeGame } from './useSnakeGame';
export { useActiveTrip } from './useActiveTrip';
