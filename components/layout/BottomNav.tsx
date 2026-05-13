import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Briefcase, LayoutGrid, User, Bell, Video, CreditCard } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../lib/AuthContext';

export const BottomNav: React.FC = () => {
  const { user } = useAuth();
  
  const userEmail = user?.email?.toLowerCase() || '';
  const isAdmin = user && (userEmail === 'aligrira9@gmail.com' || userEmail === 'aligrira2021@gmail.com');
  
  const navItems = [
    { icon: Home, label: 'الرئيسية', path: '/' },
    { icon: Video, label: 'أعمالنا', path: '/videos' },
    { icon: CreditCard, label: 'طرق الدفع', path: '/payment-info' },
    { icon: User, label: 'حسابي', path: user ? (isAdmin ? '/admin' : '/dashboard') : '/login' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10 px-4 py-2 flex justify-around items-center md:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 transition-all duration-300',
              isActive ? 'text-gold' : 'text-white/50'
            )
          }
        >
          <item.icon size={20} />
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
