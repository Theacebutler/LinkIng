import { useState, useEffect } from 'react';
import type { Resource } from '../types/resource';
import { config } from '../../config';
import { fetchWithAuth } from '../utils/authClient';

const VITE_API_URL = config.VITE_API_URL


export function useResources() {
  const [MOCK_RESOURCES, setMOCK_RESOURCES] = useState<Resource[]>(
    [{
      id: '1',
      title: 'CSS Grid Guide',
      resourceUrl: 'https://github.com/theacebutler/theacebutler/',
      sourceUrl: 'https://avi.im/css-grid-guide',
      imageUrl: 'https://avi.im/css-grid-guide/image.png',
      createdAt: '2023-01-01T00:00:00.000Z',
      tags: ['css', 'grid', 'guide'],
    },
    {
      id: '2',
      title: 'CSS Tricks',
      resourceUrl: 'https://github.com/theacebutler/linking',
      sourceUrl: 'https://avi.im/css-tricks',
      imageUrl: 'https://avi.im/css-tricks/image.png',
      createdAt: '2023-01-02T00:00:00.000Z',
      tags: ['css', 'tricks'],
    },
    {
      id: '3',
      title: 'CSS Tricks',
      resourceUrl: 'https://github.com/theacebutler/linking#apple-screenshots-integration',
      sourceUrl: 'https://avi.im/css-tricks',
      imageUrl: 'https://avi.im/css-tricks/image.png',
      createdAt: '2023-01-03T00:00:00.000Z',
      tags: ['css', 'tricks'],
    },
    ]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = async () => {

    try {
      setLoading(true);
      const response = await fetchWithAuth(`${VITE_API_URL}/resources`)
      if (!response.ok) throw new Error('Failed to fetch resources');
      // const data = await response.json() as Resource[];
      setResources(MOCK_RESOURCES);
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
      setMOCK_RESOURCES((prev) => [...prev, newResource]);
      setResources((prev) => [newResource, ...prev]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add resource');
      return false;
    }
  };

  const updateResource = async (id: string, updatedData: { title: string; sourceUrl: string; tags?: string[] }) => {
    setMOCK_RESOURCES((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updatedData } : r))
    );
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
