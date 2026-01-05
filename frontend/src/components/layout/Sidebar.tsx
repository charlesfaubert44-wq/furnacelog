import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Wrench,
  Calendar,
  FileText,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  Flame,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Systems', href: '/systems', icon: Wrench },
  { name: 'Maintenance', href: '/maintenance', icon: Calendar },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Providers', href: '/providers', icon: Users },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Knowledge Center', href: '/wiki', icon: BookOpen },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, isMobile }) => {
  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#1a1a1a] text-[#f4e8d8] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {/* Logo & Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-[#f4e8d8]/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff4500] to-[#ff6a00] shadow-[0_4px_16px_rgba(255,107,53,0.4)]">
            <Flame className="h-6 w-6 text-[#f4e8d8]" />
          </div>
          {isOpen && (
            <div>
              <h1 className="text-lg font-bold text-[#f4e8d8]">FurnaceLog</h1>
              <p className="text-xs text-[#d4a373]">Northern Tracker</p>
            </div>
          )}
        </div>
        {!isMobile && (
          <button
            onClick={onToggle}
            className="rounded-lg p-2 hover:bg-[#2a2a2a]/40 transition-colors"
          >
            <ChevronLeft
              className={cn(
                'h-5 w-5 transition-transform text-[#d4a373]',
                !isOpen && 'rotate-180'
              )}
            />
          </button>
        )}
      </div>

      {/* Home Selector */}
      {isOpen && (
        <div className="p-4 border-b border-[#f4e8d8]/10">
          <select className="w-full rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-[#f4e8d8]/10 px-3 py-2 text-sm text-[#f4e8d8] hover:border-[#ff4500]/30 focus:outline-none focus:ring-2 focus:ring-[#ff4500]/50 transition-all">
            <option>Main Home - Yellowknife</option>
            <option>Cabin - Prelude Lake</option>
            <option>+ Add New Home</option>
          </select>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300',
                isActive
                  ? 'bg-gradient-to-br from-[#ff4500] to-[#ff6a00] text-[#f4e8d8] shadow-[0_4px_16px_rgba(255,107,53,0.4)]'
                  : 'text-[#d4a373] hover:bg-[#2a2a2a]/40 hover:text-[#f4e8d8]',
                !isOpen && 'justify-center'
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {isOpen && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="border-t border-[#f4e8d8]/10 p-4">
        <div className={cn('flex items-center gap-3', !isOpen && 'justify-center')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#ff4500] to-[#ff6a00] font-semibold text-[#f4e8d8] shadow-[0_4px_12px_rgba(255,107,53,0.4)]">
            JD
          </div>
          {isOpen && (
            <div className="flex-1">
              <p className="text-sm font-medium text-[#f4e8d8]">John Doe</p>
              <p className="text-xs text-[#d4a373]">john@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
