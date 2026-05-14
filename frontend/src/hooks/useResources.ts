import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import type { Resource } from '../types/resource';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const name = Cookies.get('name') || ''
      const response = await fetch(`${API_BASE}/${name}/resources`);
      if (!response.ok) throw new Error('Failed to fetch resources');
      const data = await response.json();
      setResources(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addResource = async (resource: Omit<Resource, 'id' | 'createdAt'>) => {
    try {
      resource = { ...resource, owner: Cookies.get('name') || '' }
      // console.log(resource);

      const response = await fetch(`${API_BASE}/${resource.owner}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resource),
      });
      if (!response.ok) throw new Error('Failed to add resource');
      const newResource = await response.json();
      setResources((prev) => [newResource, ...prev]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add resource');
      return false;
    }
  };

  const deleteResource = async (id: string) => {
    try {
      const name = Cookies.get('name') || ''
      const response = await fetch(`${API_BASE}/${name}/resources/${id}`, {
        method: 'DELETE',
      });
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
    refetch: fetchResources,
  };
}
