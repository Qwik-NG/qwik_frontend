import { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  headerAction?: ReactNode;
}

export default function AdminLayout({ children, title, description, headerAction }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-[#f3f3f5]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 ml-[240px] overflow-auto">
        <div className="min-h-screen p-8">
          {/* Header */}
          <div className="max-w-7xl mx-auto mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-normal text-[#1f1f29] mb-2">{title}</h1>
                {description && (
                  <p className="text-[#7f7e88] text-sm">{description}</p>
                )}
              </div>
              {headerAction && <div>{headerAction}</div>}
            </div>
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
