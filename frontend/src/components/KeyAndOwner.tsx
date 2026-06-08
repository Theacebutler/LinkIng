import { useKeyAndOwner } from '../hooks/useKeyAndOwner';
import { useToast } from '../hooks/useToast';

interface KeyAndOwnerProps {
  setShowKeyAndOwner: (showKeyAndOwner: boolean) => void;
}

export function KeyAndOwner({ setShowKeyAndOwner }: KeyAndOwnerProps) {
  const { key, owner, setKey, setOwner } = useKeyAndOwner();
  const { showToast } = useToast();

  const handleCopy = async (text: string | null, type: 'key' | 'owner') => {
    try {
      if (!text) throw new Error("No text to copy");
      await navigator.clipboard.writeText(text);
      showToast(`${type === 'key' ? 'API Key' : 'Owner Name'} copied to clipboard`);
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  return (
    <div className="relative w-full max-w-md card p-6 shadow-pop animate-slide-up z-10 flex flex-col gap-5 bg-bg-elevated border border-border">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-base font-semibold text-text">API Credentials</h3>
        <button
          onClick={() => {
            setShowKeyAndOwner(false);
          }}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-text-soft hover:text-text hover:bg-surface transition-colors"
          aria-label="Close credentials popup"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Owner Name */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-text-soft">Owner Name</span>
          <div className="flex items-center gap-2 bg-surface border border-border rounded-lg p-2.5">
            <span className="text-sm text-text font-medium flex-1 truncate">{owner}</span>
            <button
              onClick={() => handleCopy(owner, 'owner')}
              className="inline-flex items-center justify-center w-8 h-8 rounded-md text-text-soft hover:text-text hover:bg-border-strong transition-colors"
              title="Copy owner name"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* API Key */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-text-soft">API Key</span>
          <div className="flex items-center gap-2 bg-surface border border-border rounded-lg p-2.5">
            <span className="text-sm text-text font-mono flex-1 break-all select-all">{key}</span>
            <button
              onClick={() => handleCopy(key, 'key')}
              className="inline-flex items-center justify-center w-8 h-8 rounded-md text-text-soft hover:text-text hover:bg-border-strong transition-colors"
              title="Copy API key"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => {
            setShowKeyAndOwner(false);
            setKey(null);
            setOwner(null);
          }}
          className="btn btn-ghost px-4 py-2 border border-border rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  )
}
