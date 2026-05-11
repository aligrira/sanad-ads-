import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Phone, User } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

export const DesktopNav: React.FC = () => {
  const { user } = useAuth();
  const navLinks = [
    { title: 'الرئيسية', path: '/' },
    { title: 'الخدمات', path: '/services' },
    { title: 'طرق الدفع', path: '/payment-info' },
    { title: 'معرض الأعمال', path: '/portfolio' },
    { title: 'الفيديوهات', path: '/videos' },
    { title: 'الباقات', path: '/packages' },
    { title: 'تواصل معنا', path: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 hidden md:block">
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center font-bold text-black text-xl">S</div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-wider uppercase luxury-text">Sanad Ads</span>
            <span className="text-[10px] text-gold-light -mt-1 tracking-widest uppercase">Creative Agency</span>
          </div>
        </Link>

        <nav className="flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium transition-colors hover:text-gold',
                  isActive ? 'text-gold' : 'text-white/70'
                )
              }
            >
              {link.title}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {user && (
            (() => {
              const email = user.email?.toLowerCase() || '';
              return email === 'aligrira9@gmail.com' || email === 'aligrira2021@gmail.com';
            })()
          ) && (
            <Link 
              to="/admin" 
              className="text-red-400 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors"
            >
              لوحة الإدارة
            </Link>
          )}
          {user ? (
            <Link 
              to="/dashboard" 
              className="text-gold hover:text-white flex items-center gap-2 text-sm font-bold transition-colors"
            >
              <User size={18} />
              حسابي
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="text-white/70 hover:text-gold text-sm font-bold transition-colors"
            >
              دخول
            </Link>
          )}
          <Link 
            to="/request-service" 
            className="bg-gold hover:bg-gold-dark text-black px-6 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105"
          >
            طلب خدمة
          </Link>
          <a 
            href="tel:+21692942482" 
            className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors"
          >
            <Phone size={18} />
          </a>
        </div>
      </div>
    </header>
  );
};
