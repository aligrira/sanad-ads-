import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Briefcase, LayoutGrid, User, Bell, Video, CreditCard } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../lib/AuthContext';
import { useNotifications } from '../../lib/useNotifications';

export const BottomNav: React.FC = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  
  const userEmail = user?.email?.toLowerCase() || '';
  const isAdmin = user && (userEmail === 'aligrira9@gmail.com' || userEmail === 'aligrira2021@gmail.com');
  
  const navItems = [
    { icon: Home, label: 'الرئيسية', path: '/' },
    { icon: Video, label: 'أعمالنا', path: '/videos' },
    { icon: CreditCard, label: 'طرق الدفع', path: '/payment-info' },
    { icon: Bell, label: 'الإشعارات', path: '/notifications', showBadge: unreadCount > 0 },
    { icon: User, label: 'حسابي', path: user ? (isAdmin ? '/admin' : '/dashboard') : '/login' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10 flex justify-around items-center md:hidden pb-safe">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 p-3 transition-all duration-300 relative',
              isActive ? 'text-gold' : 'text-white/50'
            )
          }
        >
          <div className="relative">
            <item.icon size={22} strokeWidth={1.5} />
            {item.showBadge && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </div>
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
