import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/furnacelog/Logo';

interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-fl-card-border bg-fl-card-bg/95 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
      <div className="flex h-full items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Left: Logo + Mobile Menu + Search */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-fl-text-secondary hover:text-white hover:bg-fl-card-border/40"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo - hidden on mobile, visible on larger screens */}
          <div className="hidden lg:block">
            <Logo size="sm" />
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 rounded-xl bg-fl-card-bg border border-fl-card-border px-3 py-2 w-64 lg:w-96 hover:border-furnace-primary/30 transition-colors">
            <Search className="h-4 w-4 text-fl-text-secondary" />
            <input
              type="text"
              placeholder="Search homes, systems, tasks..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-fl-text-secondary/60 text-white"
            />
            <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-fl-card-border bg-fl-card-bg px-1.5 text-[10px] font-medium text-fl-text-secondary">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right: Weather, Notifications, User */}
        <div className="flex items-center gap-3">
          {/* Weather Widget */}
          <div className="hidden lg:flex items-center gap-2 rounded-xl bg-furnace-primary/10 border border-furnace-primary/30 px-3 py-1.5">
            <span className="text-xl">🌡️</span>
            <div className="text-sm">
              <span className="font-semibold text-white">-18°C</span>
              <span className="text-fl-text-secondary ml-1">Yellowknife</span>
            </div>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative text-fl-text-secondary hover:text-white hover:bg-fl-card-border/40">
            <Bell className="h-5 w-5" />
            <Badge
              variant="error"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-furnace-primary border-none text-white shadow-[0_2px_8px_rgba(201,74,6,0.5)]"
            >
              3
            </Badge>
          </Button>

          {/* Mobile Search Button */}
          <Button variant="ghost" size="icon" className="md:hidden text-fl-text-secondary hover:text-white hover:bg-fl-card-border/40">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
