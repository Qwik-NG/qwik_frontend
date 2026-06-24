import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Toast } from "../components/ui/Toast";

export type ToastVariant = "success" | "error" | "info";

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastMessage = {
  id: number;
  title?: string;
  message: string;
  variant: ToastVariant;
  actions?: ToastAction[];
};

type ToastInput =
  | string
  | {
      title?: string;
      message: string;
      variant?: ToastVariant;
      actions?: ToastAction[];
      durationMs?: number;
    };

type ToastContextValue = {
  showToast: (message: ToastInput, variant?: ToastVariant) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);
const TOAST_DURATION = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextIdRef = useRef(0);
  const timeoutsRef = useRef<Map<number, number>>(new Map());

  const removeToast = useCallback((id: number) => {
    const timeoutId = timeoutsRef.current.get(id);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }

    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (input: ToastInput, variant: ToastVariant = "info") => {
      const id = nextIdRef.current + 1;
      nextIdRef.current = id;

      const toast =
        typeof input === "string"
          ? { id, message: input, variant }
          : {
              id,
              title: input.title,
              message: input.message,
              variant: input.variant ?? variant,
              actions: input.actions,
            };

      setToasts((currentToasts) => [...currentToasts, toast]);

      const timeoutDuration = typeof input === "string" ? TOAST_DURATION : (input.durationMs ?? TOAST_DURATION);
      if (timeoutDuration <= 0) return;

      const timeoutId = window.setTimeout(() => {
        removeToast(id);
      }, timeoutDuration);

      timeoutsRef.current.set(id, timeoutId);
    },
    [removeToast]
  );

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutsRef.current.clear();
    };
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast,
      success: (message: string) => showToast(message, "success"),
      error: (message: string) => showToast(message, "error"),
      info: (message: string) => showToast(message, "info"),
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}