import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Smartphone, Lock, UserPlus, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('يرجى ملء جميع الحقول الضرورية.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Update basic profile
      await updateProfile(user, { displayName: formData.name });

      // Save additional info to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        createdAt: new Date()
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'فشل إنشاء الحساب.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-32 pb-20 px-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -mr-32 -mt-32" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-xl p-10 rounded-[40px] border-white/10"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold luxury-text mb-2">إنشاء حساب جديد</h1>
          <p className="text-white/40 text-sm">انضمّ لعالم التميز مع سند للإعلان</p>
        </div>

        <form className="space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center gap-3 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs text-white/40 mr-1 block font-bold uppercase tracking-widest">الاسم الكامل</label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pr-12 pl-6 py-4 focus:border-gold outline-none transition-all" 
                  placeholder="محمد أحمد"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/40 mr-1 block font-bold uppercase tracking-widest">رقم الهاتف</label>
              <div className="relative">
                <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="tel" 
                  dir="ltr"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pr-12 pl-6 py-4 focus:border-gold outline-none transition-all text-left" 
                  placeholder="+216"
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-white/40 mr-1 block font-bold uppercase tracking-widest">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="email" 
                dir="ltr"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pr-12 pl-6 py-4 focus:border-gold outline-none transition-all text-left" 
                placeholder="email@example.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-white/40 mr-1 block font-bold uppercase tracking-widest">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="password" 
                dir="ltr"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pr-12 pl-6 py-4 focus:border-gold outline-none transition-all text-left" 
                placeholder="••••••••"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
             <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-gold focus:ring-gold" />
             <span className="text-xs text-white/40">أوافق على <Link to="#" className="text-gold underline">الشروط والأحكام</Link> و سياسة الخصوصية</span>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full gold-gradient text-black font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-lg shadow-gold/10 disabled:opacity-50"
          >
            {loading ? 'جاري التحميل...' : 'إنشاء الحساب'}
            <UserPlus size={20} />
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-white/40">
          لديك حساب بالفعل؟ <Link to="/login" className="text-gold font-bold">تسجيل الدخول</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
