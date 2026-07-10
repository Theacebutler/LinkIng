import { useState, useEffect } from 'react';
import type { Resource } from '../types/resource';
import { config } from '../../config';
import { fetchWithAuth } from '../utils/authClient';

const VITE_API_URL = config.VITE_API_URL


export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const offset = localStorage.getItem(config.LOCAL_STORAGE_KEY_NAME) || 0
      const response = await fetchWithAuth(`${VITE_API_URL}/resources/?offset=${offset}`)
      if (!response.ok) throw new Error('Failed to fetch resources');
      const data = await response.json() as { resources: Resource[], offset: number }
      localStorage.setItem(config.LOCAL_STORAGE_KEY_NAME, data.offset.toString())
      setResources((prev) => [...data.resources, ...prev]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addResource = async (resource: Omit<Resource, 'id' | 'createdAt'>) => {
    try {
      const response = await fetchWithAuth(`${VITE_API_URL}/resources`, 'POST', JSON.stringify(resource))
      if (!response.ok) throw new Error('Failed to add resource');
      const newResource = await response.json() as Resource;
      setResources((prev) => [newResource, ...prev]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add resource');
      return false;
    }
  };

  const updateResource = async (id: string, updatedData: { title: string; sourceUrl: string; tags?: string[] }) => {
    try {
      const response = await fetchWithAuth(
        `${VITE_API_URL}/resources`,
        'PATCH',
        JSON.stringify({ id, ...updatedData })
      );
      if (!response.ok) throw new Error('Failed to update resource');
      setResources((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updatedData } : r))
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update resource');
      return false;
    }
  };

  const deleteResource = async (id: string) => {
    try {
      const response = await fetchWithAuth(`${VITE_API_URL}/resources`, 'DELETE', JSON.stringify({ id }))
      if (!response.ok) throw new Error('Failed to delete resource');
      setResources((prev) => prev.filter((r) => r.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete resource');
      return false;
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return {
    resources,
    loading,
    error,
    addResource,
    deleteResource,
    updateResource,
    refetch: fetchResources,
  };
}
