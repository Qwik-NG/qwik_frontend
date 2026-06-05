import { useEffect, useMemo, useState } from "react";
import { buildCurrentUserDisplay } from "../lib/currentUser";
import { getToken, isTokenExpired } from "../services/auth";
import { api } from "../services/api";
import type { User } from "../types";

export function useCurrentUser() {
  const token = getToken();
  const shouldLoadUser = !!token && !isTokenExpired(token);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(shouldLoadUser);

  useEffect(() => {
    let isCancelled = false;

    if (!shouldLoadUser) {
      setUser(null);
      setLoading(false);
      return () => {
        isCancelled = true;
      };
    }

    setLoading(true);

    void api
      .me()
      .then((response) => {
        if (!isCancelled) {
          setUser(response.data);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setUser(null);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [shouldLoadUser]);

  const display = useMemo(() => buildCurrentUserDisplay(user), [user]);

  return {
    user,
    display,
    loading,
  };
}