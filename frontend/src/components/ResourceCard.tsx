import { useEffect, useState } from 'react';
import type { Resource } from '../types/resource';

import ResourceImage from "./ResourceImage"
import { config } from '../../config';
import { fetchWithAuth } from '../utils/authClient';

interface ResourceCardProps {
  resource: Resource;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedData: { title: string; sourceUrl: string }) => Promise<boolean>;
  onCopy: (text: string, type: 'resource' | 'source') => void;
}


export function ResourceCard({ resource, onDelete, onCopy, onUpdate }: ResourceCardProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageLoadingError, setImageLoadingError] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(resource.title || '');
  const [editSourceUrl, setEditSourceUrl] = useState(resource.sourceUrl || '');
  const [titleError, setTitleError] = useState(false);
  const [sourceUrlError, setSourceUrlError] = useState(false);

  useEffect(() => {
    (() => {
      setEditTitle(resource.title || '');
      setEditSourceUrl(resource.sourceUrl || '');
      setTitleError(false);
      setSourceUrlError(false);
    })()
  }, [resource]);

  useEffect(() => {
    let cancelled = false;
    let timeOutID: ReturnType<typeof setTimeout>

    async function poll(attempt: number) {
      if (cancelled) return
      setImageLoading(true)
      const url = `${config.VITE_API_URL}/resources/screenshots/${resource.id}`
      const data = await fetchWithAuth(url)
      if (data.ok) {
        setImageUrl(url)
        setImageLoading(false)
        setImageLoadingError(false)
      } else if (attempt >= config.MAX_IMAGE_POLLING_ATTEMPTS) {
        setImageLoadingError(true)
        return
      } else {
        timeOutID = setTimeout(() => poll(attempt + 1), 4000 + (attempt * 1000))
      }
    }
    poll(1)
    return () => {
      cancelled = true
      clearTimeout(timeOutID)
    }
  }, [resource.id])

  const openResource = () => {
    window.open(resource.resourceUrl, '_blank', 'noopener,noreferrer');
  };

  const openSource = () => {
    if (resource.sourceUrl) {
      window.open(resource.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
  };

  const truncateUrl = (url: string, maxLength = 40) => {
    try {
      const urlObj = new URL(url);
      const display = urlObj.hostname + urlObj.pathname;
      return display.length > maxLength ? display.slice(0, maxLength) + '...' : display;
    } catch {
      return url.length > maxLength ? url.slice(0, maxLength) + '...' : url;
    }
  };

  const handleSave = async () => {
    let hasError = false;
    if (!editTitle.trim()) {
      setTitleError(true);
      hasError = true;
    } else {
      setTitleError(false);
    }

    if (editSourceUrl.trim()) {
      try {
        new URL(editSourceUrl.trim());
        setSourceUrlError(false);
      } catch {
        setSourceUrlError(true);
        hasError = true;
      }
    } else {
      setSourceUrlError(false);
    }

    if (hasError) return;

    const success = await onUpdate(resource.id, {
      title: editTitle.trim(),
      sourceUrl: editSourceUrl.trim(),
    });

    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(resource.title || '');
    setEditSourceUrl(resource.sourceUrl || '');
    setTitleError(false);
    setSourceUrlError(false);
    setIsEditing(false);
  };

  return (
    <article className="bg-slate-800 border border-slate-700 rounded-lg p-4 transition-shadow hover:shadow-md">
      <div className="flex justify-between items-start gap-2 mb-4">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onKeyUp={(e) => (e.key === 'ENTER') && handleSave()}
            onChange={(e) => {
              setEditTitle(e.target.value);
              if (titleError && e.target.value.trim()) setTitleError(false);
            }}
            className={`flex-1 text-sm font-semibold text-slate-100 bg-slate-900 border rounded px-2 py-1 focus:outline-none ${titleError ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-blue-400'
              }`}
            placeholder="Resource Title"
          />
        ) : (
          <h3 className="text-base font-semibold text-slate-100 flex-1 min-w-0">
            {resource.title || `Added ${new Date(resource.createdAt).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' })}`}
          </h3>
        )}
        <div className="flex items-center gap-1 shrink-0">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="p-1 text-emerald-500 rounded hover:text-emerald-400 hover:bg-emerald-900/30 transition-colors"
                aria-label="Save changes"
                title="Save"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
              <button
                onClick={handleCancel}
                className="p-1 text-slate-500 rounded hover:text-slate-400 hover:bg-slate-700/50 transition-colors"
                aria-label="Cancel editing"
                title="Cancel"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-slate-500 rounded hover:text-green-400 hover:bg-green-900/30 transition-colors"
                aria-label="Update resource"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(resource.id)}
                className="p-1 text-slate-500 rounded hover:text-red-400 hover:bg-red-900/30 transition-colors"
                aria-label="Delete resource"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500 shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
          </span>
          <button onClick={openResource} className="text-blue-400 text-left truncate hover:underline">
            {truncateUrl(resource.resourceUrl)}
          </button>
          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => onCopy(resource.resourceUrl, 'resource')}
              className="p-1 text-slate-500 rounded hover:text-blue-400 hover:bg-blue-900/30 transition-colors"
              aria-label="Copy resource URL"
              title="Copy"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            </button>
            <button
              onClick={openResource}
              className="p-1 text-slate-500 rounded hover:text-blue-400 hover:bg-blue-900/30 transition-colors"
              aria-label="Open resource URL"
              title="Open"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </button>
          </div>
        </div>

        {(isEditing || resource.sourceUrl) && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500 shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </span>
            <span className="text-slate-500 shrink-0">via</span>
            {isEditing ? (
              <input
                type="url"
                value={editSourceUrl}
                onChange={(e) => {
                  setEditSourceUrl(e.target.value);
                  if (sourceUrlError) {
                    try {
                      if (!e.target.value.trim()) {
                        setSourceUrlError(false);
                      } else {
                        new URL(e.target.value.trim());
                        setSourceUrlError(false);
                      }
                    } catch {
                      // ignore
                    }
                  }
                }}
                className={`flex-1 text-xs text-slate-100 bg-slate-900 border rounded px-2 py-1 focus:outline-none ${sourceUrlError ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-blue-400'
                  }`}
                placeholder="https://... (Source URL)"
              />
            ) : (
              <>
                <button onClick={openSource} className="text-blue-400 text-left truncate hover:underline flex-1 min-w-0">
                  {truncateUrl(resource.sourceUrl)}
                </button>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => onCopy(resource.sourceUrl, 'source')}
                    className="p-1 text-slate-500 rounded hover:text-blue-400 hover:bg-blue-900/30 transition-colors"
                    aria-label="Copy source URL"
                    title="Copy"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                  </button>
                  <button
                    onClick={openSource}
                    className="p-1 text-slate-500 rounded hover:text-blue-400 hover:bg-blue-900/30 transition-colors"
                    aria-label="Open source URL"
                    title="Open"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        {
          imageLoadingError ?
            <div></div>
            : <button onClick={openResource} className="text-blue-400 text-left truncate hover:underline block w-full">
              <ResourceImage imageUrl={imageUrl} imageLoading={imageLoading} />
            </button>
        }
      </div>

      <div className="mt-4 pt-3 border-t border-slate-700">
        <span className="text-xs text-slate-500">Added: {formatDate(resource.createdAt)}</span>
      </div>
    </article>
  );
}
