import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { BellIcon, BoxIcon, InfoIcon, LogoutIcon, PhoneIcon, TicketIcon, UserIcon } from "../components/icons/SettingsIcons";
import { clearToken } from "../services/auth";

export type SettingsMenuItem = {
  label: string;
  icon: ReactNode;
  active?: boolean;
  onClick: () => void;
};

export function getSettingsNavItems(navigate: ReturnType<typeof useNavigate>, activePage: string): SettingsMenuItem[] {
  return [
    { label: "Profile", icon: <UserIcon />, active: activePage === "profile", onClick: () => navigate("/profile-settings") },
    { label: "Ads", icon: <BoxIcon />, active: activePage === "ads", onClick: () => navigate("/ads-dashboard") },
    { label: "Make money", icon: <TicketIcon />, active: activePage === "promote", onClick: () => navigate("/promote-ad") },
    { label: "Notification", icon: <BellIcon />, active: activePage === "notification", onClick: () => navigate("/notification-settings") },
    { label: "Help", icon: <PhoneIcon />, active: activePage === "help", onClick: () => navigate("/messages") },
    { label: "About", icon: <InfoIcon />, active: activePage === "about", onClick: () => navigate("/") },
    { label: "Log out", icon: <LogoutIcon />, onClick: () => { clearToken(); navigate("/signin"); } },
  ];
}
