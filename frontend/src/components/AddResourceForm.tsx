import { useState, type FormEvent } from 'react';
import type { ResourceFormData } from '../types/resource';

interface AddResourceFormProps {
  onSubmit: (data: ResourceFormData) => Promise<boolean>;
}

const LinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export function AddResourceForm({ onSubmit }: AddResourceFormProps) {
  const [formData, setFormData] = useState<ResourceFormData>({
    title: '',
    resourceUrl: '',
    sourceUrl: '',
    tags: [],
    owner: '',
  });
  const [errors, setErrors] = useState<Partial<ResourceFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const validateUrl = (url: string): boolean => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<ResourceFormData> = {};
    if (!formData.resourceUrl) {
      newErrors.resourceUrl = 'Resource URL is required';
    } else if (!validateUrl(formData.resourceUrl)) {
      newErrors.resourceUrl = 'Please enter a valid URL';
    }
    if (formData.sourceUrl && !validateUrl(formData.sourceUrl)) {
      newErrors.sourceUrl = 'Please enter a valid URL';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    if (!validate()) return;

    setIsSubmitting(true);
    const ok = await onSubmit(formData);
    setIsSubmitting(false);

    if (ok) {
      setFormData({ title: '', resourceUrl: '', sourceUrl: '', tags: [] });
      setSuccess(true);
      setExpanded(false);
      setTimeout(() => setSuccess(false), 1800);
    }
  };

  const handleChange = (field: keyof ResourceFormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <section id="add-resource" className="card p-4 md:p-5">
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex items-center gap-2 mb-3">
          <div className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-primary-soft text-primary">
            <PlusIcon />
          </div>
          <h2 className="text-sm font-semibold text-text">Add a new resource</h2>
          <span className="ml-auto text-xs text-muted hidden sm:inline">
            Paste a link to save it to your collection
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
              <LinkIcon />
            </span>
            <input
              type="url"
              value={formData.resourceUrl}
              onChange={(e) => handleChange('resourceUrl', e.target.value)}
              placeholder="Paste a resource URL…"
              className={`input pl-10 ${errors.resourceUrl ? 'input-error' : ''}`}
              required
            />
          </div>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="btn btn-ghost text-xs"
            aria-expanded={expanded}
          >
            {expanded ? 'Hide details' : 'Add details'}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary px-5"
          >
            {isSubmitting ? 'Adding…' : 'Add resource'}
          </button>
        </div>

        {errors.resourceUrl && (
          <p className="mt-2 text-xs text-danger">{errors.resourceUrl}</p>
        )}

        {expanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-xs font-medium text-text-soft mb-1.5">
                Title <span className="text-muted">(optional)</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g., CSS Grid Guide"
                className="input"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-soft mb-1.5">
                Tags <span className="text-muted">(optional)</span>
              </label>
              <input
                type="text"
                value={formData.tags?.join(' ')}
                onChange={(e) => handleChange('tags', e.target.value.split(' '))}
                placeholder="#css"
                className="input"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-soft mb-1.5">
                Source URL <span className="text-muted">(optional)</span>
              </label>
              <input
                type="url"
                value={formData.sourceUrl}
                onChange={(e) => handleChange('sourceUrl', e.target.value)}
                placeholder="https://… (where you found it)"
                className={`input ${errors.sourceUrl ? 'input-error' : ''}`}
              />
              {errors.sourceUrl && (
                <p className="mt-1 text-xs text-danger">{errors.sourceUrl}</p>
              )}
            </div>
          </div>
        )}

        {success && (
          <div className="mt-3 flex items-center gap-2 text-sm text-success bg-success/10 border border-success/20 rounded-lg px-3 py-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
              <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Resource added successfully
          </div>
        )}
      </form>
    </section>
  );
}
