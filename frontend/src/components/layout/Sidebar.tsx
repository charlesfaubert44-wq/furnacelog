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
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, isMobile }) => {
  return (
    <div className="flex h-full flex-col bg-gradient-night text-frost-white shadow-floating">
      {/* Logo & Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-steel-700">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-aurora">
            <Flame className="h-6 w-6 text-white" />
          </div>
          {isOpen && (
            <div>
              <h1 className="font-heading text-lg font-bold">FurnaceLog</h1>
              <p className="text-micro text-aluminum-400">Northern Tracker</p>
            </div>
          )}
        </div>
        {!isMobile && (
          <button
            onClick={onToggle}
            className="rounded-lg p-2 hover:bg-steel-700 transition-colors"
          >
            <ChevronLeft
              className={cn(
                'h-5 w-5 transition-transform',
                !isOpen && 'rotate-180'
              )}
            />
          </button>
        )}
      </div>

      {/* Home Selector */}
      {isOpen && (
        <div className="p-4 border-b border-steel-700">
          <select className="w-full rounded-lg bg-steel-700 px-3 py-2 text-sm hover:bg-steel-600 focus:outline-none focus:ring-2 focus:ring-tech-blue-500 transition-colors">
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
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-tech-blue-600 text-white shadow-md'
                  : 'text-aluminum-300 hover:bg-steel-700 hover:text-white',
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
      <div className="border-t border-steel-700 p-4">
        <div className={cn('flex items-center gap-3', !isOpen && 'justify-center')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-aurora font-semibold text-white">
            JD
          </div>
          {isOpen && (
            <div className="flex-1">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-micro text-aluminum-400">john@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
