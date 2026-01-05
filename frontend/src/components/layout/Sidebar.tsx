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
import { Logo } from '@/components/furnacelog/Logo';

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
    <div className="flex h-full flex-col bg-black text-white shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {/* Logo & Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-fl-card-border">
        {isOpen ? (
          <Logo size="sm" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-furnace-primary shadow-[0_4px_16px_rgba(201,74,6,0.4)]">
            <Flame className="h-6 w-6 text-white" />
          </div>
        )}
        {!isMobile && (
          <button
            onClick={onToggle}
            className="rounded-lg p-2 hover:bg-fl-card-bg transition-colors"
          >
            <ChevronLeft
              className={cn(
                'h-5 w-5 transition-transform text-fl-text-secondary',
                !isOpen && 'rotate-180'
              )}
            />
          </button>
        )}
      </div>

      {/* Home Selector */}
      {isOpen && (
        <div className="p-4 border-b border-fl-card-border">
          <select className="w-full rounded-xl bg-fl-card-bg border border-fl-card-border px-3 py-2 text-sm text-white hover:border-furnace-primary/30 focus:outline-none focus:ring-2 focus:ring-furnace-primary/50 transition-all">
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
                  ? 'bg-furnace-primary text-white shadow-[0_4px_16px_rgba(201,74,6,0.4)]'
                  : 'text-fl-text-secondary hover:bg-fl-card-bg hover:text-white',
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
      <div className="border-t border-fl-card-border p-4">
        <div className={cn('flex items-center gap-3', !isOpen && 'justify-center')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-furnace-primary font-semibold text-white shadow-[0_4px_12px_rgba(201,74,6,0.4)]">
            JD
          </div>
          {isOpen && (
            <div className="flex-1">
              <p className="text-sm font-medium text-white">John Doe</p>
              <p className="text-xs text-fl-text-secondary">john@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
