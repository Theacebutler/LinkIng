import { useState } from 'react';
import type { Resource } from '../types/resource';
import { ResourceCard } from './ResourceCard';
import { ConfirmDialog } from './ConfirmDialog';
import { Toast, type ToastMessage } from './Toast';

interface ResourceListProps {
  resources: Resource[];
  onDelete: (id: string) => Promise<boolean>;
  loading?: boolean;
}

export function ResourceList({ resources, onDelete, loading }: ResourceListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    setToast({ message, type });
  };

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
    if (success) {
      showToast('Resource deleted');
    } else {
      showToast('Failed to delete resource', 'error');
    }
    setDeleteId(null);
  };

  const filteredResources = resources.filter((resource) => {
    const query = searchQuery.toLowerCase();
    return (
      resource.title.toLowerCase().includes(query) ||
      resource.resourceUrl.toLowerCase().includes(query) ||
      resource.sourceUrl.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <section className="mb-6">
        <div className="text-center py-10 text-slate-400">Loading resources...</div>
      </section>
    );
  }

  return (
    <>
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            Your Resources
            {resources.length > 0 && (
              <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 bg-blue-600 text-white text-xs font-semibold rounded-full">
                {resources.length}
              </span>
            )}
          </h2>
        </div>

        {resources.length > 0 && (
          <input
            type="search"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-slate-700 rounded text-base mb-4 bg-slate-800 text-slate-100 placeholder-slate-500 transition-colors focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10"
          />
        )}

        {resources.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-600 rounded-lg text-slate-400">
            <p>No resources yet. Add your first one above!</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-600 rounded-lg text-slate-400">
            <p>No resources match your search.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onDelete={(id) => setDeleteId(id)}
                onCopy={handleCopy}
              />
            ))}
          </div>
        )}
      </section>

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Resource"
        message="Are you sure you want to delete this resource? This action cannot be undone."
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
