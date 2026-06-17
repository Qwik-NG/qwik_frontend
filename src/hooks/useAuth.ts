/**
 * useAuth hook - provides auth utilities to components
 * 
 * Returns:
 * - isAuthenticated: boolean indicating if user has a valid token
 * - token: the current auth token (if exists)
 * - logout: function to clear all auth data and navigate to login
 */

import { useNavigate } from "react-router-dom";
import { getToken, clearAllAuthData, hasValidToken } from "../services/auth";
import { ROUTES } from "../constants/routes";
import { disconnectRealtimeSocket } from "../services/realtime";

export function useAuth() {
  const navigate = useNavigate();
  const token = getToken();
  const isAuthenticated = hasValidToken();

  const logout = () => {
    // TODO: Call api.logout() when backend implements logout endpoint
    // For now, just clear frontend state
    clearAllAuthData();
    disconnectRealtimeSocket();
    navigate(ROUTES.LOGIN);
  };

  return {
    isAuthenticated,
    token,
    logout
  };
}
