import { useState, type FormEvent } from 'react';
import Cookies from 'js-cookie';
import type { ResourceFormData } from '../types/resource';

interface AddResourceFormProps {
  onSubmit: (data: ResourceFormData) => Promise<boolean>;
}

export function AddResourceForm({ onSubmit }: AddResourceFormProps) {
  const [formData, setFormData] = useState<ResourceFormData>({
    title: '',
    resourceUrl: '',
    sourceUrl: '',
    owner: '',
  });
  const [errors, setErrors] = useState<Partial<ResourceFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    if (text) {
      setFormData((prev) => ({ ...prev, resourceUrl: text }));
      setErrors((prev) => ({ ...prev, resourceUrl: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    if (!validate()) return;

    setIsSubmitting(true);
    const success = await onSubmit(formData);
    setIsSubmitting(false);

    if (success) {
      const name = Cookies.get('name') || ''
      setFormData({ title: '', resourceUrl: '', sourceUrl: '', owner: name });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1000);
    }
  };

  const handleChange = (field: keyof ResourceFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <section className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-slate-100 mb-4">Add New Resource</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="text-sm font-medium text-slate-300">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g., CSS Grid Guide"
            className="px-3 py-2 border border-slate-600 rounded text-base bg-slate-900 text-slate-100 placeholder-slate-500 transition-colors focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-end shrink-0" >
            <label htmlFor="resourceUrl" className="text-sm font-medium text-slate-300">
              Resource URL <span className="text-red-400">*</span>
            </label>
            <button
              onClick={handlePaste}
              className="p-1 text-slate-500 rounded hover:text-blue-400 hover:bg-blue-900/30 transition-colors"
              aria-label="Paste resource URL"
              title="Paste"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              </svg>
            </button>
          </div>
          <input
            type="url"
            id="resourceUrl"
            value={formData.resourceUrl}
            onChange={(e) => handleChange('resourceUrl', e.target.value)}
            placeholder="https://..."
            className={`px-3 py-2 border rounded text-base bg-slate-900 text-slate-100 placeholder-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/10 ${errors.resourceUrl ? 'border-red-400 focus:border-red-400' : 'border-slate-600 focus:border-blue-400'}`}
            required
          />
          {errors.resourceUrl && (
            <span className="text-sm text-red-400">{errors.resourceUrl}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="sourceUrl" className="text-sm font-medium text-slate-300">
            Source URL
          </label>
          <input
            type="url"
            id="sourceUrl"
            value={formData.sourceUrl}
            onChange={(e) => handleChange('sourceUrl', e.target.value)}
            placeholder="https://... (where you found it)"
            className={`px-3 py-2 border rounded text-base bg-slate-900 text-slate-100 placeholder-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/10 ${errors.sourceUrl ? 'border-red-400 focus:border-red-400' : 'border-slate-600 focus:border-blue-400'}`}
          />
          {errors.sourceUrl && (
            <span className="text-sm text-red-400">{errors.sourceUrl}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded font-medium transition-colors hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed w-full"
        >
          {isSubmitting ? 'Adding...' : 'Add Resource'}
        </button>

        {success && (
          <p className="text-sm text-emerald-400 text-center py-2 bg-emerald-900/30 rounded">
            Resource added successfully!
          </p>
        )}
      </form>
    </section>
  );
}
