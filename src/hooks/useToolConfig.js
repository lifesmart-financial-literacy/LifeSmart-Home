import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/initFirebase';
import { DEFAULT_GROUP_CONFIG, migrateToGroups } from '../lib/toolConfig';

const CACHE_MS = 5 * 60 * 1000; // 5 minutes
const TOOL_CONFIG_REF = { collection: 'SystemSettings', id: 'toolConfig' };

let cachedData = null;
let cachedAt = 0;

/**
 * Hook to fetch tool config from Firestore with caching.
 * Returns { groups, loading, error, refetch }.
 * Supports legacy flat tools format - migrates to groups automatically.
 */
export function useToolConfig() {
  const [groups, setGroups] = useState(cachedData || DEFAULT_GROUP_CONFIG);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState(null);

  const fetchConfig = useCallback(async (bypassCache = false) => {
    if (!bypassCache && cachedData && Date.now() - cachedAt < CACHE_MS) {
      setGroups(cachedData);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ref = doc(db, TOOL_CONFIG_REF.collection, TOOL_CONFIG_REF.id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        const migrated = migrateToGroups(data);
        cachedData = migrated;
        cachedAt = Date.now();
        setGroups(migrated);
      } else {
        setGroups(DEFAULT_GROUP_CONFIG);
      }
    } catch (err) {
      console.error('useToolConfig:', err);
      setError(err.message);
      setGroups(DEFAULT_GROUP_CONFIG);
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

  return { groups, loading, error, refetch };
}

/**
 * Save tool config (groups) to Firestore. For use in admin only.
 */
export async function saveToolConfig(groups) {
  const ref = doc(db, TOOL_CONFIG_REF.collection, TOOL_CONFIG_REF.id);
  await setDoc(ref, { groups, updatedAt: new Date().toISOString() });
  cachedData = null;
  cachedAt = 0;
}
