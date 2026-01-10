/**
 * MobileBottomNav Component
 * Mobile-optimized bottom navigation bar
 */

import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Cog, Plus, Calendar, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAlerts } from '@/hooks/useAlerts';

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useAlerts();

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/dashboard',
      active: location.pathname === '/dashboard',
    },
    {
      icon: Cog,
      label: 'Systems',
      path: '/systems',
      active: location.pathname.startsWith('/systems'),
    },
    {
      icon: Plus,
      label: 'Log',
      path: null, // Opens modal
      active: false,
      primary: true,
    },
    {
      icon: Calendar,
      label: 'Calendar',
      path: '/calendar',
      active: location.pathname === '/calendar',
    },
    {
      icon: Bell,
      label: 'Alerts',
      path: '/alerts',
      active: location.pathname === '/alerts',
      badge: unreadCount,
    },
  ];

  const handleClick = (item: typeof navItems[0]) => {
    if (item.primary) {
      // Open quick log modal
      window.dispatchEvent(new CustomEvent('open-quick-log', { detail: {} }));
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleClick(item)}
            className={cn(
              'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all relative',
              item.active && 'text-primary',
              item.primary &&
                'bg-primary text-white scale-110 rounded-full p-3 -mt-6 shadow-lg',
              !item.active && !item.primary && 'text-gray-600 hover:text-gray-900'
            )}
          >
            <item.icon className={cn('h-6 w-6', item.primary && 'h-7 w-7')} />
            {!item.primary && (
              <span className="text-xs font-medium">{item.label}</span>
            )}

            {/* Badge for alerts */}
            {item.badge && item.badge > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                {item.badge > 9 ? '9+' : item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Safe area padding for devices with notches */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </nav>
  );
}
