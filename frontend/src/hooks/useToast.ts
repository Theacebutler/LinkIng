import type { ToastMessage } from '../components/Toast';
import { useState } from 'react';

export default function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    setToast({ message, type });
  };

  return {
    toast,
    showToast,
    setToast
  };
}
