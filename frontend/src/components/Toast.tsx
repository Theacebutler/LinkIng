import { useEffect } from 'react';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps {
  message: string;
  type: ToastMessage['type'];
  onClose: () => void;
  duration?: number;
}

const SuccessIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} className="w-4 h-4">
    <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ErrorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} className="w-4 h-4">
    <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
  </svg>
);

const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-4 h-4">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5M12 16h.01" strokeLinecap="round" />
  </svg>
);

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const styles = {
    success: 'border-success/30 text-success bg-bg-elevated',
    error: 'border-danger/30 text-danger bg-bg-elevated',
    info: 'border-primary/30 text-primary bg-bg-elevated',
  } as const;

  return (
    <div
      className={`fixed bottom-5 right-5 flex items-center gap-3 px-4 py-3 border rounded-xl shadow-pop z-50 max-w-sm animate-slide-up ${styles[type]}`}
      role="alert"
    >
      {type === 'success' ? <SuccessIcon /> : type === 'error' ? <ErrorIcon /> : <InfoIcon />}
      <span className="flex-1 text-sm text-text">{message}</span>
      <button
        onClick={onClose}
        className="text-muted hover:text-text transition-colors p-0.5"
        aria-label="Close"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
          <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
