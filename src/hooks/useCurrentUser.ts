import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { buildCurrentUserDisplay } from "../lib/currentUser";
import { getToken, isTokenExpired } from "../services/auth";
import { api } from "../services/api";
import type { User } from "../types";

const currentUserListeners = new Set<(user: User | null) => void>();
let currentUserSnapshot: User | null = null;
let currentUserToken: string | null = null;

function publishCurrentUser(user: User | null, token: string | null = currentUserToken) {
  currentUserToken = token;
  currentUserSnapshot = user;
  currentUserListeners.forEach((listener) => listener(user));
}

export function useCurrentUser() {
  const token = getToken();
  const shouldLoadUser = !!token && !isTokenExpired(token);
  const activeToken = shouldLoadUser ? token : null;
  const [user, setUserState] = useState<User | null>(activeToken && activeToken === currentUserToken ? currentUserSnapshot : null);
  const [loading, setLoading] = useState(shouldLoadUser);

  useEffect(() => {
    currentUserListeners.add(setUserState);
    return () => {
      currentUserListeners.delete(setUserState);
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    if (!shouldLoadUser) {
      publishCurrentUser(null, null);
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
          publishCurrentUser(response.data, activeToken);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          publishCurrentUser(null, activeToken);
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
  }, [activeToken, shouldLoadUser]);

  const display = useMemo(() => buildCurrentUserDisplay(user), [user]);
  const setUser: Dispatch<SetStateAction<User | null>> = (nextUser) => {
    publishCurrentUser(typeof nextUser === "function" ? nextUser(currentUserSnapshot) : nextUser, activeToken);
  };

  return {
    user,
    setUser,
    display,
    loading,
  };
}