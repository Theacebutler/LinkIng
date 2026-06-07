import { getUserKey } from '../utils/userRequests';
import { useState } from 'react';
import useToast from '../hooks/useToast';
import { Toast } from './Toast';

export function GetUserKey() {
  const { showToast, toast, setToast } = useToast();
  const [key, setKey] = useState<string | null>(null);
  const [owner, setOwner] = useState<string | null>(null);

  function handleClick() {
    try {
      getUserKey()
        .then((data) => {
          setKey(data.key);
          setOwner(data.owner);
        })
        .catch((e) => {
          showToast('Failed to get your API key', 'error');
          console.log("Error attempting to get API key", e);
        });
    } catch (e) {
      showToast('Failed to get your API key', 'error');
      console.log("Error attempting to get API key", e);
    }
  }

  const handleCopy = async (text: string, type: 'key' | 'owner') => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${type === 'key' ? 'key' : 'owner'}  copied to clipboard`);
    } catch {
      showToast('Failed to copy URL', 'error');
    }
  };

  return (
    <>
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-text mb-3">Get your API key</h3>
        <button
          onClick={handleClick}
          className="w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-text-soft transition-colors hover:bg-primary hover:text-primary-soft"
        >
          Get your API key
        </button>
      </div>
      {key && owner ?
        <>
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-text mb-3">API key</h3>
            <p className="text-sm text-text-soft">{key}</p>
            <button
              onClick={() => handleCopy(key, 'key')}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] text-text-soft hover:text-text hover:bg-surface transition-colors"
              title="Copy key"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </button>
          </div>
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-text mb-3">API owner</h3>
            <p className="text-sm text-text-soft">{owner}</p>
            <button
              onClick={() => handleCopy(key, 'owner')}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] text-text-soft hover:text-text hover:bg-surface transition-colors"
              title="Copy key"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </button>
          </div>
        </>
        : null
      }
      <Toast
        message={toast?.message || ''}
        type={toast?.type || 'success'}
        onClose={() => setToast(null)}
      />
    </>
  );
}
