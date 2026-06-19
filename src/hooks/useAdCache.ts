import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";

// Short-lived in-memory cache (2 minute TTL)
const ADS_CACHE_TTL = 2 * 60 * 1000;
let adDetailCache: Record<string, { data: any; timestamp: number }> = {};

/**
 * Get cached ad detail if still valid
 */
function getCachedAdDetail(adId: string) {
  const cached = adDetailCache[adId];
  if (!cached) return null;
  
  const age = Date.now() - cached.timestamp;
  if (age > ADS_CACHE_TTL) {
    delete adDetailCache[adId];
    return null;
  }
  
  return cached.data;
}

/**
 * Set ad detail in cache
 */
function setCachedAdDetail(adId: string, data: any) {
  adDetailCache[adId] = {
    data,
    timestamp: Date.now(),
  };
  // Limit cache size to prevent memory leak
  if (Object.keys(adDetailCache).length > 50) {
    const oldestKey = Object.entries(adDetailCache).sort(
      ([, a], [, b]) => a.timestamp - b.timestamp
    )[0][0];
    delete adDetailCache[oldestKey];
  }
}

/**
 * Clear all ad caches
 */
export function clearAdCache() {
  adDetailCache = {};
}

/**
 * Prefetch ad detail data - starts fetch immediately
 * Useful for onHover, onTouchStart to have data ready before navigation
 */
export function usePrefetchAdDetail(adId: string) {
  const prefetch = useCallback(async () => {
    // Return immediately if already cached
    const cached = getCachedAdDetail(adId);
    if (cached) return;
    
    // Start fetch but don't wait
    api.adById(adId)
      .then((res) => {
        setCachedAdDetail(adId, res.data);
      })
      .catch(() => {
        // Silently ignore prefetch errors
      });
  }, [adId]);
  
  return prefetch;
}

/**
 * Hook to load single ad detail with caching
 */
export function useAdDetail(adId: string) {
  const [data, setData] = useState<any>(() => getCachedAdDetail(adId));
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    
    // Try cache first
    const cached = getCachedAdDetail(adId);
    if (cached && isMounted) {
      setData(cached);
      setLoading(false);
      return;
    }
    
    // Fetch fresh data
    setLoading(true);
    api.adById(adId)
      .then((res) => {
        if (isMounted) {
          setCachedAdDetail(adId, res.data);
          setData(res.data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load ad");
          setData(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    
    return () => {
      isMounted = false;
    };
  }, [adId]);
  
  return { data, loading, error };
}
