/**
 * useAuth hook - provides auth utilities to components
 * 
 * Returns:
 * - isAuthenticated: boolean indicating if user has a valid token
 * - token: the current auth token (if exists)
 * - logout: function to clear all auth data and navigate to home
 */

import { useNavigate } from "react-router-dom";
import { getToken, clearAllAuthData } from "../services/auth";
import { ROUTES } from "../constants/routes";

export function useAuth() {
  const navigate = useNavigate();
  const token = getToken();
  const isAuthenticated = !!token;

  const logout = () => {
    // TODO: Call api.logout() when backend implements logout endpoint
    // For now, just clear frontend state
    clearAllAuthData();
    navigate(ROUTES.HOME);
  };

  return {
    isAuthenticated,
    token,
    logout
  };
}
