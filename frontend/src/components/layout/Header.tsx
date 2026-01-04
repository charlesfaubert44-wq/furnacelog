import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-aluminum-200 bg-white/80 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Left: Mobile Menu + Search */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 rounded-lg bg-aluminum-50 px-3 py-2 w-64 lg:w-96">
            <Search className="h-4 w-4 text-aluminum-400" />
            <input
              type="text"
              placeholder="Search homes, systems, tasks..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-aluminum-400"
            />
            <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-aluminum-200 bg-white px-1.5 font-mono text-[10px] font-medium text-aluminum-500">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right: Weather, Notifications, User */}
        <div className="flex items-center gap-3">
          {/* Weather Widget */}
          <div className="hidden lg:flex items-center gap-2 rounded-lg bg-ice-blue-50 px-3 py-1.5">
            <span className="text-xl">🌡️</span>
            <div className="text-sm">
              <span className="font-semibold text-ice-blue-700">-18°C</span>
              <span className="text-aluminum-500 ml-1">Yellowknife</span>
            </div>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge
              variant="error"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
            >
              3
            </Badge>
          </Button>

          {/* Mobile Search Button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
