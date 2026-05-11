import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, Github, Chrome, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const adminEmails = ['aligrira9@gmail.com', 'aligrira2021@gmail.com'];
      if (adminEmails.includes(formData.email.toLowerCase())) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول. تأكد من البيانات.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const adminEmails = ['aligrira9@gmail.com', 'aligrira2021@gmail.com'];
      if (user.email && adminEmails.includes(user.email.toLowerCase())) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول عبر جوجل.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-20 px-6 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-navy/20 rounded-full blur-[100px] -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-md p-10 rounded-[40px] border-white/10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center font-bold text-black text-2xl mx-auto mb-6">S</div>
          <h1 className="text-3xl font-bold luxury-text mb-2">تسجيل الدخول</h1>
          <p className="text-white/40 text-sm">مرحباً بك مجدداً في سند للإعلان</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center gap-3 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs text-white/40 mr-1 block uppercase tracking-widest font-bold">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="email" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl pr-12 pl-6 py-4 focus:border-gold outline-none transition-all" 
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center mr-1">
              <label className="text-xs text-white/40 uppercase tracking-widest font-bold">كلمة المرور</label>
              <Link to="/forgot-password" size="xs" className="text-gold text-[10px] font-bold">نسيت كلمة المرور؟</Link>
            </div>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="password" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl pr-12 pl-6 py-4 focus:border-gold outline-none transition-all" 
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full gold-gradient text-black font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-lg shadow-gold/10 disabled:opacity-50"
          >
            {loading ? 'جاري التحميل...' : 'دخول'}
            <LogIn size={20} />
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-white/40 text-sm mb-6">أو تسجيل الدخول باستخدام</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={handleGoogleLogin}
              className="w-12 h-12 rounded-xl glass flex items-center justify-center text-white/70 hover:text-gold transition-all"
            >
              <Chrome size={20} />
            </button>
            <button className="w-12 h-12 rounded-xl glass flex items-center justify-center text-white/70 hover:text-gold transition-all">
              <Github size={20} />
            </button>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-white/40">
          ليس لديك حساب؟ <Link to="/register" className="text-gold font-bold">إنشاء حساب جديد</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
