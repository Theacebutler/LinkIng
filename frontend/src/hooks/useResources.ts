import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import type { Resource } from '../types/resource';
import { parseCookies } from '../utils/cookies';
import { config } from '../../config';

const VITE_API_BASE = config.VITE_API_URL
const cookie = Cookies.get('accessToken')

const cookiePartes = parseCookies(cookie as string)
const ACCESS_TOKEN = cookiePartes.get('access_token')

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = async () => {

    try {
      setLoading(true);
      const response = await fetch(`${VITE_API_BASE}/resources`, {
        headers: {
          "Authorization": `Bearer ${ACCESS_TOKEN}`,
          "Access-Control-Allow-Origin": "*",
        }
      });
      if (!response.ok) throw new Error('Failed to fetch resources');
      const data = await response.json() as Resource[];
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

      const response = await fetch(`${VITE_API_BASE}/resources`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${ACCESS_TOKEN}`,
          "Access-Control-Allow-Origin": "*",
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resource),
      });
      if (!response.ok) throw new Error('Failed to add resource');
      const newResource = await response.json() as Resource;
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
      const response = await fetch(`${VITE_API_BASE}/${name}/resources/${id}`, {
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
