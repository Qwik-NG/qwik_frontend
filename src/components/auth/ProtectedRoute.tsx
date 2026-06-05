import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { hasValidToken } from "../../services/auth";
import { ROUTES } from "../../constants/routes";

export interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * ProtectedRoute component - wraps a route to require authentication
 * 
 * If user is not authenticated (no valid token), redirects to login page.
 * If authenticated, renders the protected component.
 * 
 * Usage:
 * <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
 */
export function ProtectedRoute({ children, redirectTo = ROUTES.LOGIN }: ProtectedRouteProps) {
  const isAuthenticated = hasValidToken();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
