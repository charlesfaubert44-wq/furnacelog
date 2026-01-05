import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';

export const AppShell: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 hidden lg:block transition-all duration-300',
          sidebarOpen ? 'w-60' : 'w-20'
        )}
      >
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-60 transform transition-transform duration-300 lg:hidden',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Sidebar
          isOpen={true}
          onToggle={() => setMobileMenuOpen(false)}
          isMobile
        />
      </aside>

      {/* Main Content Area */}
      <div
        className={cn(
          'transition-all duration-300',
          sidebarOpen ? 'lg:pl-60' : 'lg:pl-20'
        )}
      >
        {/* Header */}
        <Header
          onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          sidebarOpen={sidebarOpen}
        />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8 bg-black">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-fl-card-border bg-fl-card-bg px-4 py-6 md:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-fl-text-secondary">
                © 2026 FurnaceLog. Built for Canada's North.
              </p>
              <div className="flex gap-4 text-sm text-fl-text-secondary">
                <a href="#" className="hover:text-furnace-primary transition-colors">
                  Documentation
                </a>
                <a href="#" className="hover:text-furnace-primary transition-colors">
                  Support
                </a>
                <a href="#" className="hover:text-furnace-primary transition-colors">
                  Privacy
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
