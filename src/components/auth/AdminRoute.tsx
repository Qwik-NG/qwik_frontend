import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getRole, getToken } from "../../services/auth";

export interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const token = getToken();
  const role = getRole();

  if (!token || role !== "ADMIN") {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}