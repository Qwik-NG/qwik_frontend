import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../AppShell";

type PageLayoutProps = {
  children: ReactNode;
  hideHeaderOnMobile?: boolean;
  hideFooterOnMobile?: boolean;
  className?: string;
  contentClassName?: string;
};

export default function PageLayout({
  children,
  hideHeaderOnMobile = false,
  hideFooterOnMobile = false,
  className = "",
  contentClassName = "",
}: PageLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen bg-page text-ink ${className}`.trim()}>
      <div className={hideHeaderOnMobile ? "hidden md:block" : ""}>
        <SiteHeader navigate={navigate} />
      </div>

      <main className={`page-layout-transition ${contentClassName}`.trim()}>{children}</main>

      <div className={hideFooterOnMobile ? "hidden md:block" : ""}>
        <SiteFooter navigate={navigate} />
      </div>
    </div>
  );
}