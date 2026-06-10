import { useMemo, useState } from 'react';
import type { Resource } from '../types/resource';
import { ResourceCard } from './ResourceCard';
import { ConfirmDialog } from './ConfirmDialog';
import { Toast } from './Toast';
import { useToast } from '../hooks/useToast';

interface ResourceListProps {
  resources: Resource[];
  onDelete: (id: string) => Promise<boolean>;
  onUpdate: (id: string, updatedData: { title: string; sourceUrl: string }) => Promise<boolean>;
  loading?: boolean;
  domainFilter: string | null;
  onClearDomainFilter: () => void;
  tagFilter: string | null;
  handleTagFilter: (tag: string | null) => void;
  onClearTagFilter: () => void;
}

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const GridIcon = ({ active }: { active?: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const ListIcon = ({ active }: { active?: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M8 6h13M8 12h13M8 18h13" />
    <circle cx="3.5" cy="6" r="1" />
    <circle cx="3.5" cy="12" r="1" />
    <circle cx="3.5" cy="18" r="1" />
  </svg>
);

type SortKey = 'newest' | 'oldest' | 'title';

export function ResourceList({ resources, onDelete, loading, onUpdate, domainFilter, onClearDomainFilter, tagFilter, handleTagFilter, onClearTagFilter }: ResourceListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState<SortKey>('newest');
  const { showToast, toast, setToast } = useToast();

  const handleCopy = async (text: string, type: 'resource' | 'source') => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${type === 'resource' ? 'Resource' : 'Source'} URL copied to clipboard`);
    } catch {
      showToast('Failed to copy URL', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const success = await onDelete(deleteId);
    showToast(success ? 'Resource deleted' : 'Failed to delete resource', success ? 'success' : 'error');
    setDeleteId(null);
  };

  const filteredResources = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const list = resources.filter((r) => {
      if (domainFilter) {
        try {
          if (new URL(r.resourceUrl).hostname.replace(/^www\./, '') !== domainFilter) return false;
        } catch {
          return false;
        }
      }
      if (q) {
        return (
          r.title.toLowerCase().includes(q) ||
          r.resourceUrl.toLowerCase().includes(q) ||
          r.sourceUrl.toLowerCase().includes(q)
        );
      }
      return true;
    });
    list.sort((a, b) => {
      if (sort === 'title') return (a.title || '').localeCompare(b.title || '');
      if (sort === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return list;
  }, [resources, searchQuery, sort, domainFilter]);

  if (loading) {
    return (
      <section className="card p-10 text-center text-text-soft text-sm">
        Loading resources…
      </section>
    );
  }

  return (
    <>
      <section id="resources-section" className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-base md:text-lg font-semibold text-text">Your resources</h2>
          {resources.length > 0 && (
            <span className="chip">{resources.length} total</span>
          )}
          {resources.length > 0 && (
            <span className="ml-auto flex items-center gap-1">
              <div className="hidden sm:flex items-center bg-surface border border-border rounded-lg p-0.5">
                <button
                  onClick={() => setView('grid')}
                  className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-bg-elevated text-text' : 'text-text-soft hover:text-text'}`}
                  aria-label="Grid view"
                  title="Grid view"
                >
                  <GridIcon active={view === 'grid'} />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-bg-elevated text-text' : 'text-text-soft hover:text-text'}`}
                  aria-label="List view"
                  title="List view"
                >
                  <ListIcon active={view === 'list'} />
                </button>
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="text-xs bg-surface border border-border rounded-lg px-2.5 py-1.5 text-text-soft hover:text-text focus:outline-none focus:border-primary"
                aria-label="Sort resources"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="title">By title</option>
              </select>
            </span>
          )}
        </div>

        {resources.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {/* tag and domain filter */}
              {tagFilter && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-full bg-primary-soft text-black text-xs font-medium border border-primary/30">
                    {tagFilter}
                    <button
                      onClick={onClearTagFilter}
                      className="w-5 h-5 rounded-full hover:bg-primary/20 inline-flex items-center justify-center"
                      aria-label="Clear domain filter"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-3 h-3">
                        <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                      </svg>
                    </button>
                  </span>
                </div>
              )}
              {domainFilter && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-full bg-primary-soft text-black text-xs font-medium border border-primary/30">
                    {domainFilter}
                    <button
                      onClick={onClearDomainFilter}
                      className="w-5 h-5 rounded-full hover:bg-primary/20 inline-flex items-center justify-center"
                      aria-label="Clear domain filter"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-3 h-3">
                        <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                      </svg>
                    </button>
                  </span>
                </div>
              )}
              {/* show number of matches */}
              {
                <span className="text-xs text-text-soft">
                  {
                    tagFilter || domainFilter && filteredResources.length > 0 ?
                      filteredResources.length + ' match' + (filteredResources.length !== 1 ? 'es' : '') :
                      null
                  }
                </span>
              </div>
            )}
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                <SearchIcon />
              </span>
              <input
                type="search"
                placeholder="Search your resources…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
        )}

        {resources.length === 0 ? (
          <div className="card p-10 text-center text-text-soft">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary-soft text-primary flex items-center justify-center mb-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-text font-medium">No resources yet</p>
            <p className="text-sm text-muted mt-1">Add your first resource using the form above.</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="card p-10 text-center text-text-soft">
            <p>No resources match your search.</p>
          </div>
        ) : (
          <div
            className={
              view === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
                : 'flex flex-col gap-3'
            }
          >
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                view={view}
                tagFilter={tagFilter}
                onTagSelect={handleTagFilter}
                onDelete={(id) => setDeleteId(id)}
                onUpdate={async (id, updatedData) => {
                  const success = await onUpdate(id, updatedData);
                  showToast(success ? 'Resource updated' : 'Failed to update resource', success ? 'success' : 'error');
                  return success;
                }}
                onCopy={handleCopy}
              />
            ))}
          </div>
        )}
      </section>

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete resource"
        message="Are you sure you want to delete this resource? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      <Toast
        message={toast?.message || ''}
        type={toast?.type || 'success'}
        onClose={() => setToast(null)}
      />
    </>
  );
}
