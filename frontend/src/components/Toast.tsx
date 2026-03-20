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

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const typeStyles = {
    success: 'border-l-4 border-emerald-400',
    error: 'border-l-4 border-red-400',
    info: 'border-l-4 border-blue-400',
  };

  return (
    <div 
      className={`fixed bottom-6 right-6 flex items-center gap-3 px-6 py-4 bg-slate-800 rounded-lg shadow-xl z-50 max-w-md animate-slide-in ${typeStyles[type]}`}
      role="alert"
    >
      <span className="flex-1 text-sm text-slate-200">{message}</span>
      <button 
        onClick={onClose} 
        className="p-1 text-slate-500 rounded hover:text-slate-300 hover:bg-slate-700 transition-colors"
        aria-label="Close"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
