import type { ToastMessage } from '../components/Toast';
import { useState, useEffect } from 'react';

let globalToast: ToastMessage | null = null;
const toastListeners = new Set<(toast: ToastMessage | null) => void>();

export function useToast() {
  const [toast, setToastState] = useState<ToastMessage | null>(globalToast);

  useEffect(() => {
    const listener = (newToast: ToastMessage | null) => {
      setToastState(newToast);
    };
    toastListeners.add(listener);
    return () => {
      toastListeners.delete(listener);
    };
  }, []);

  const setToast = (newToast: ToastMessage | null) => {
    globalToast = newToast;
    toastListeners.forEach((listener) => listener(newToast));
  };

  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    setToast({ message, type });
  };

  return {
    toast,
    showToast,
    setToast
  };
}
