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
    <header className="sticky top-0 z-40 h-16 border-b border-[#f4e8d8]/10 bg-gradient-to-br from-[#2d1f1a]/95 to-[#1a1412]/95 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
      <div className="flex h-full items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Left: Mobile Menu + Search */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-[#d4a373] hover:text-[#f4e8d8] hover:bg-[#3d3127]/40"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 rounded-xl bg-gradient-to-br from-[#3d3127] to-[#2d1f1a] border border-[#f4e8d8]/10 px-3 py-2 w-64 lg:w-96 hover:border-[#ff6b35]/30 transition-colors">
            <Search className="h-4 w-4 text-[#d4a373]" />
            <input
              type="text"
              placeholder="Search homes, systems, tasks..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#d4a373]/60 text-[#f4e8d8]"
            />
            <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-[#f4e8d8]/20 bg-[#3d3127] px-1.5 font-mono text-[10px] font-medium text-[#d4a373]">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right: Weather, Notifications, User */}
        <div className="flex items-center gap-3">
          {/* Weather Widget */}
          <div className="hidden lg:flex items-center gap-2 rounded-xl bg-gradient-to-br from-[#5b8fa3]/20 to-[#7ea88f]/10 border border-[#5b8fa3]/30 px-3 py-1.5">
            <span className="text-xl">🌡️</span>
            <div className="text-sm">
              <span className="font-semibold text-[#c4d7e0]">-18°C</span>
              <span className="text-[#d4a373] ml-1">Yellowknife</span>
            </div>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative text-[#d4a373] hover:text-[#f4e8d8] hover:bg-[#3d3127]/40">
            <Bell className="h-5 w-5" />
            <Badge
              variant="error"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-gradient-to-br from-[#d45d4e] to-[#d4734e] border-none text-[#f4e8d8] shadow-[0_2px_8px_rgba(212,93,78,0.5)]"
            >
              3
            </Badge>
          </Button>

          {/* Mobile Search Button */}
          <Button variant="ghost" size="icon" className="md:hidden text-[#d4a373] hover:text-[#f4e8d8] hover:bg-[#3d3127]/40">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
