import { useEffect, useState } from 'react';
import type { Resource } from '../types/resource';
import ResourceImage from './ResourceImage';
import { config } from '../../config';
import { fetchWithAuth } from '../utils/authClient';

interface ResourceCardProps {
  resource: Resource;
  view: 'grid' | 'list';
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedData: { title: string; sourceUrl: string, tags?: string[] }) => Promise<boolean>;
  onCopy: (text: string, type: 'resource' | 'source') => void;
}

const getHostname = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

const getInitials = (s: string) => {
  if (!s) return '?';
  return s.trim().slice(0, 2).toUpperCase();
};

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export function ResourceCard({ resource, view, onDelete, onCopy, onUpdate }: ResourceCardProps) {
  const hostname = getHostname(resource.resourceUrl);
  const fallbackTitle = `Resource from ${hostname}`;
  const [imageUrl, setImageUrl] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageLoadingError, setImageLoadingError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(resource.title || fallbackTitle);
  const [editSourceUrl, setEditSourceUrl] = useState(resource.sourceUrl || '');
  const [editTags, setEditTags] = useState<string[]>(resource.tags || []);
  const [titleError, setTitleError] = useState(false);
  const [sourceUrlError, setSourceUrlError] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timeOutID: ReturnType<typeof setTimeout> | undefined;

    async function poll(attempt: number) {
      if (cancelled) return;
      setImageLoading(true);
      const url = `${config.VITE_API_URL}/resources/screenshots/${resource.id}`;
      const data = await fetchWithAuth(url);
      if (cancelled) return;
      if (data.ok) {
        setImageUrl(url);
        setImageLoading(false);
        setImageLoadingError(false);
      } else if (attempt >= config.MAX_IMAGE_POLLING_ATTEMPTS) {
        setImageLoadingError(true);
        setImageLoading(false);
      } else {
        timeOutID = setTimeout(() => poll(attempt + 1), 4000 + attempt * 1000);
      }
    }
    poll(1);
    return () => {
      cancelled = true;
      if (timeOutID) clearTimeout(timeOutID);
    };
  }, [resource.id]);

  const openResource = () => {
    window.open(resource.resourceUrl, '_blank', 'noopener,noreferrer');
  };

  const openSource = () => {
    if (resource.sourceUrl) {
      window.open(resource.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSave = async () => {
    let hasError = false;
    if (!editTitle.trim()) {
      setTitleError(true);
      hasError = true;
    }
    if (editSourceUrl.trim()) {
      try {
        new URL(editSourceUrl.trim());
        setSourceUrlError(false);
      } catch {
        setSourceUrlError(true);
        hasError = true;
      }
    }
    if (hasError) return;

    const success = await onUpdate(resource.id, {
      title: editTitle.trim(),
      sourceUrl: editSourceUrl.trim(),
      tags: editTags,
    });
    if (success) {
      setIsEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    }
  };

  const handleCancel = () => {
    setEditTitle(resource.title || '');
    setEditSourceUrl(resource.sourceUrl || '');
    setEditTags(resource.tags || []);
    setTitleError(false);
    setSourceUrlError(false);
    setIsEditing(false);
  };


  return (
    <article className={`card card-hover border hover:border-primary-hover overflow-hidden flex group ${view === 'list' ? 'flex-row' : 'flex-col'}`}>
      <div
        className={
          view === 'list'
            ? 'w-44 sm:w-52 shrink-0 self-stretch bg-surface relative cursor-pointer overflow-hidden ring-1 ring-inset ring-white/0.04'
            : 'aspect-2.5/1 w-full bg-surface relative cursor-pointer overflow-hidden ring-1 ring-inset ring-white/0.04'
        }
        onClick={openResource}
      >
        {!imageLoadingError ? (
          <ResourceImage imageUrl={imageUrl} imageLoading={imageLoading} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted text-xs">
            <span className="opacity-60">No preview</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-black/40 to-transparent pointer-events-none" />
        {saved && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-success/90 text-bg text-[10px] font-semibold uppercase tracking-wide">
            Saved
          </div>
        )}
      </div>

      <div className="flex-1 p-4 flex flex-col gap-3 min-w-0">
        <div className="flex items-start gap-2">
          <div className="w-7 h-7 rounded-md bg-primary-soft text-primary text-[11px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
            {getInitials(hostname)}
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => {
                  setEditTitle(e.target.value);
                  if (titleError && e.target.value.trim()) setTitleError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') handleCancel();
                }}
                className={`input text-sm ${titleError ? 'input-error' : ''}`}
                placeholder="Resource title"
                autoFocus
              />
            ) : (
              <h3
                onClick={openResource}
                className="text-sm md:text-[15px] font-semibold text-text leading-snug line-clamp-2 cursor-pointer hover:text-primary transition-colors"
              >
                {resource.title || fallbackTitle}
              </h3>
            )}
            <div className="flex flex-row gap-2">
              <p className="mt-0.5 text-[11px] text-shadow-muted truncate flex flex-row gap-1">
                {hostname} · {formatDate(resource.createdAt)}
              </p>
              <div>
                {resource.tags ? (
                  <div className="flex items-center gap-1.5 text-[11px] text-text-soft">
                    {
                      resource.tags.map((tag, i) => (
                        <button
                          key={i}
                          onClick={() => alert("Not implemented, this will filter the resources by tag")}
                          className="text-shadow-muted hover:underline truncate min-w-0 text-left"
                        >
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </button>
                      ))
                    }
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="icon-btn w-8 h-8 text-success hover:bg-success/10"
                  aria-label="Save"
                  title="Save"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} className="w-4 h-4">
                    <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={handleCancel}
                  className="icon-btn w-8 h-8"
                  aria-label="Cancel"
                  title="Cancel"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-4 h-4">
                    <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="icon-btn w-8 h-8"
                  aria-label="Edit"
                  title="Edit"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
                    <path d="M12 20h9" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(resource.id)}
                  className="icon-btn w-8 h-8 hover:text-danger"
                  aria-label="Delete"
                  title="Delete"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <div>
            <label className="block text-[11px] font-medium text-text-soft mb-1">
              Tags <span className="text-muted">(optional)</span>
            </label>
            <input
              type="text"
              value={editTags.join(' ')}
              onChange={(e) => {
                setEditTags(e.target.value.split(' '));
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
              // className={`input text-xs ${tagsError ? 'input-error' : ''}`}
              placeholder="#css #grid #guide"
            />
          </div>
        ) : null}
        {isEditing ? (
          <div>
            <label className="block text-[11px] font-medium text-text-soft mb-1">
              Source URL <span className="text-muted">(optional)</span>
            </label>
            <input
              type="url"
              value={editSourceUrl}
              onChange={(e) => {
                setEditSourceUrl(e.target.value);
                if (sourceUrlError) {
                  try {
                    if (!e.target.value.trim()) setSourceUrlError(false);
                    else {
                      new URL(e.target.value.trim());
                      setSourceUrlError(false);
                    }
                  } catch {
                    /* keep error */
                  }
                }
              }}
              className={`input text-xs ${sourceUrlError ? 'input-error' : ''}`}
              placeholder="https://… (where you found it)"
            />
          </div>
        ) : (
          resource.sourceUrl && (
            <div className="flex items-center gap-1.5 text-[11px] text-text-soft">
              <span className="text-muted">via</span>
              <button
                onClick={openSource}
                className="text-primary hover:underline truncate min-w-0 text-left"
              >
                {getHostname(resource.sourceUrl)}
              </button>
            </div>
          )
        )}

        <div className="mt-auto flex items-center gap-1 pt-2 border-t border-border">
          <button
            onClick={openResource}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] text-text-soft hover:text-text hover:bg-surface transition-colors"
            title="Open"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Open
          </button>
          <button
            onClick={() => onCopy(resource.resourceUrl, 'resource')}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] text-text-soft hover:text-text hover:bg-surface transition-colors"
            title="Copy URL"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy
          </button>
          {resource.sourceUrl && (
            <button
              onClick={() => onCopy(resource.sourceUrl, 'source')}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] text-text-soft hover:text-text hover:bg-surface transition-colors"
              title="Copy source URL"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              Source
            </button>
          )}
        </div>
      </div>
    </article >
  );
}
