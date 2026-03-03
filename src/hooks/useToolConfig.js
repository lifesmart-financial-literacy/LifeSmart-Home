import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/initFirebase';
import { DEFAULT_TOOL_CONFIG } from '../lib/toolConfig';

const CACHE_MS = 5 * 60 * 1000; // 5 minutes
const TOOL_CONFIG_REF = { collection: 'SystemSettings', id: 'toolConfig' };

let cachedData = null;
let cachedAt = 0;

/**
 * Hook to fetch tool config from Firestore with caching.
 * Returns { tools, loading, error, refetch }.
 * Tools are sorted by order.
 */
export function useToolConfig() {
  const [tools, setTools] = useState(cachedData || DEFAULT_TOOL_CONFIG);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState(null);

  const fetchConfig = useCallback(async (bypassCache = false) => {
    if (!bypassCache && cachedData && Date.now() - cachedAt < CACHE_MS) {
      setTools(cachedData);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ref = doc(db, TOOL_CONFIG_REF.collection, TOOL_CONFIG_REF.id);
      const snap = await getDoc(ref);

      if (snap.exists() && Array.isArray(snap.data().tools) && snap.data().tools.length > 0) {
        const sorted = [...snap.data().tools].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        cachedData = sorted;
        cachedAt = Date.now();
        setTools(sorted);
      } else {
        // No config yet - use defaults and optionally seed Firestore
        setTools(DEFAULT_TOOL_CONFIG);
      }
    } catch (err) {
      console.error('useToolConfig:', err);
      setError(err.message);
      setTools(DEFAULT_TOOL_CONFIG);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const refetch = useCallback(() => {
    cachedData = null;
    cachedAt = 0;
    return fetchConfig(true);
  }, [fetchConfig]);

  return { tools, loading, error, refetch };
}

/**
 * Save tool config to Firestore. For use in admin only.
 */
export async function saveToolConfig(tools) {
  const ref = doc(db, TOOL_CONFIG_REF.collection, TOOL_CONFIG_REF.id);
  await setDoc(ref, { tools, updatedAt: new Date().toISOString() });
  cachedData = null;
  cachedAt = 0;
}
