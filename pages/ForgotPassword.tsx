import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, CheckCircle2, Lock, ArrowLeft, Send, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('يرجى إدخال البريد الإلكتروني.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'فشل إرسال بريد إعادة التعيين.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-20 px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/[0.05] via-transparent to-transparent -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-md p-10 rounded-[40px] border-white/10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-bold luxury-text mb-2">استعادة الحساب</h1>
          <p className="text-white/40 text-sm">
            {step === 1 && 'أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور'}
            {step === 2 && 'تم إرسال الرابط! تفقد بريدك الإلكتروني'}
          </p>
        </div>

        {step === 1 && (
          <form className="space-y-6" onSubmit={handleResetPassword}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center gap-3 text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs text-white/40 mr-1 block uppercase font-bold tracking-widest">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="email" 
                  dir="ltr"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pr-12 pl-6 py-4 focus:border-gold outline-none transition-all text-left" 
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full gold-gradient text-black font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              {loading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
              <Send size={20} />
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-8 text-center py-4">
            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">تفقد بريدك</h3>
              <p className="text-white/40 text-sm leading-relaxed px-4">
                لقد أرسلنا تعليمات استعادة كلمة المرور إلى البريد: <br />
                <span className="text-gold font-bold">{email}</span>
              </p>
            </div>
            <button 
              onClick={() => setStep(1)}
              className="text-gold text-sm font-bold underline"
            >
              لم يصلك البريد؟ المحاولة ثانية
            </button>
          </div>
        )}

        <Link to="/login" className="mt-8 flex justify-center items-center gap-2 text-white/30 hover:text-white transition-colors text-sm">
          <ArrowLeft size={16} />
          العودة لتسجيل الدخول
        </Link>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
