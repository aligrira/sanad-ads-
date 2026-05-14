import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { DesktopNav } from './components/layout/DesktopNav';
import { BottomNav } from './components/layout/BottomNav';
import { AuthProvider } from './lib/AuthContext';
import PageTransition from './components/layout/PageTransition';

import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Packages from './pages/Packages';
import Contact from './pages/Contact';
import RequestService from './pages/RequestService';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Notifications from './pages/Notifications';
import Videos from './pages/Videos';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import PaymentInfo from './pages/PaymentInfo';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
          <Route path="/portfolio" element={<PageTransition><Portfolio /></PageTransition>} />
          <Route path="/packages" element={<PageTransition><Packages /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/request-service" element={<PageTransition><RequestService /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="/payment-info" element={<PageTransition><PaymentInfo /></PageTransition>} />
          <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
          <Route path="/notifications" element={<PageTransition><Notifications /></PageTransition>} />
          <Route path="/videos" element={<PageTransition><Videos /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
          <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="splash"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative w-full max-w-sm aspect-square max-h-[60vh] flex items-center justify-center"
              >
                {/* Fallback elegant Logo when no injected image is found -> We structure it so if user replaces it with an img tag later, it will be contained */}
                <div className="w-32 h-32 rounded-[2rem] gold-gradient flex items-center justify-center text-black text-6xl font-bold luxury-text mb-8 shadow-[0_0_80px_rgba(212,175,55,0.4)]">
                  S
                </div>
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center gap-3 mt-8"
              >
                <h1 className="text-3xl font-bold uppercase luxury-text tracking-[0.3em] text-white">Sanad Ads</h1>
                <p className="text-gold font-medium tracking-widest text-xs">مساحتك لانتشار علامتك</p>
                <div className="w-32 h-[2px] bg-white/10 relative overflow-hidden mt-4 rounded-full">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gold rounded-full"
                  />
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="main-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="min-h-screen bg-black transition-colors duration-500 overflow-x-hidden"
            >
              <DesktopNav />
              
              <main className="container mx-auto pt-4 md:pt-0">
                <AnimatedRoutes />
              </main>
    
              <BottomNav />
              
              {/* Floating WhatsApp Button */}
              <a 
                href="https://wa.me/21692942482" 
                target="_blank" 
                rel="noreferrer"
                className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-bounce"
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </Router>
    </AuthProvider>
  );
};

export default App;
