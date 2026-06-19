import { useEffect, useState, useRef } from "react";
import { api } from "../services/api";
import { getToken } from "../services/auth";
import type { User } from "../types";

// Cache to store current user data with TTL
interface CacheEntry {
  data: User;
  timestamp: number;
}

const USER_CACHE_KEY = "qwik_user_cache";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let memoryCache: CacheEntry | null = null;

function getCachedUser(): User | null {
  // Check memory cache first
  if (memoryCache && Date.now() - memoryCache.timestamp < CACHE_TTL) {
    return memoryCache.data;
  }

  // Check localStorage
  try {
    const stored = localStorage.getItem(USER_CACHE_KEY);
    if (stored) {
      const entry: CacheEntry = JSON.parse(stored);
      if (Date.now() - entry.timestamp < CACHE_TTL) {
        memoryCache = entry;
        return entry.data;
      }
    }
  } catch {
    // Ignore storage errors
  }

  return null;
}

function setCachedUser(user: User): void {
  const entry: CacheEntry = { data: user, timestamp: Date.now() };
  memoryCache = entry;
  try {
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(entry));
  } catch {
    // Ignore storage errors
  }
}

function clearCache(): void {
  memoryCache = null;
  try {
    localStorage.removeItem(USER_CACHE_KEY);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Hook to get current user data with caching
 * Returns cached data if available and valid, otherwise fetches fresh data
 */
export function useUserCache() {
  const [user, setUser] = useState<User | null>(() => getCachedUser());
  const [loading, setLoading] = useState(!user && !!getToken());
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const refreshUser = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      clearCache();
      return null;
    }

    // Check cache first
    const cached = getCachedUser();
    if (cached) {
      setUser(cached);
      setLoading(false);
      return cached;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.me();
      const userData = response.data;

      if (isMountedRef.current) {
        setCachedUser(userData);
        setUser(userData);
        setLoading(false);
      }

      return userData;
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : "Failed to load user");
        setLoading(false);
        setUser(null);
        clearCache();
      }
      return null;
    }
  };

  // Only fetch if we don't have cached data
  useEffect(() => {
    const cached = getCachedUser();
    if (cached) {
      setUser(cached);
      setLoading(false);
      return;
    }

    if (getToken()) {
      void refreshUser();
    } else {
      setLoading(false);
    }
  }, []);

  return { user, loading, error, refreshUser };
}

export { clearCache as clearUserCache };
