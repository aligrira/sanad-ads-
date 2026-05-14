import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Facebook, Instagram, Send, Smartphone, CheckCircle2, Loader2 } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: 'استفسار عن الإعلانات الممولة',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMSG, setErrorMSG] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      setErrorMSG('الرجاء إكمال جميع الحقول.');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMSG('');
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...formData,
        status: 'new',
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      setFormData({ name: '', phone: '', subject: 'استفسار عن الإعلانات الممولة', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
       handleFirestoreError(err, OperationType.CREATE, 'contactMessages');
       setErrorMSG('حدث خطأ أثناء الإرسال. تأكد من اتصالك.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-gold font-medium tracking-[0.2em] text-xs uppercase block mb-4">اتصل بنا</span>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold luxury-text mb-6">نحن هنا <br /><span className="gold-text-gradient">لسماع أفكارك</span></h1>
          <p className="text-white/60 text-lg mb-12 leading-relaxed">
            فريق سند للإعلان جاهز للرد على جميع استفساراتك وتقديم الاستشارات اللازمة لمشروعك. لا تتردد في التواصل معنا.
          </p>

          <div className="space-y-8">
            <div className="flex gap-6 items-center flex-row-reverse text-right">
              <div className="w-14 h-14 rounded-2xl gold-gradient p-[1px] shrink-0">
                <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center text-gold">
                  <Phone size={24} />
                </div>
              </div>
              <div dir="ltr" className="text-right flex flex-col items-end">
                <div className="text-xs text-white/40 uppercase tracking-widest mb-1 font-bold">الهاتف المباشر</div>
                <div className="text-xl font-mono">+216 92 942 482</div>
              </div>
            </div>

            <div className="flex gap-6 items-center flex-row-reverse text-right">
              <div className="w-14 h-14 rounded-2xl gold-gradient p-[1px] shrink-0">
                <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center text-gold">
                  <Smartphone size={24} />
                </div>
              </div>
              <div dir="ltr" className="text-right flex flex-col items-end">
                <div className="text-xs text-white/40 uppercase tracking-widest mb-1 font-bold">واتساب الأعمال</div>
                <div className="text-xl font-mono text-[#25D366]">+216 92 942 482</div>
              </div>
            </div>
            
            <div className="flex gap-6 items-center flex-row-reverse text-right">
              <div className="w-14 h-14 rounded-2xl gold-gradient p-[1px] shrink-0">
                <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center text-gold">
                  <MapPin size={24} />
                </div>
              </div>
              <div>
                <div className="text-xs text-white/40 uppercase tracking-widest mb-1 font-bold">الموقع</div>
                <div className="text-xl">تونس، الجمهورية التونسية</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-12">
             <a href="#" className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/70 hover:text-gold transition-colors">
               <Facebook size={20} />
             </a>
             <a href="#" className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/70 hover:text-gold transition-colors">
               <Instagram size={20} />
             </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-10 rounded-[40px] border-white/10"
        >
          <h2 className="text-2xl font-bold mb-8">أرسل لنا رسالة سريعة</h2>
          
          {isSuccess && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-4 rounded-2xl mb-6 text-sm flex items-center gap-3">
              <CheckCircle2 size={20} />
              تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.
            </div>
          )}

          {errorMSG && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-2xl mb-6 text-sm">
              {errorMSG}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-white/40 mb-2 block mr-1">الاسم بالكامل</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold outline-none transition-all" 
                  placeholder="محمد أحمد" 
                />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-2 block mr-1">رقم الهاتف</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold outline-none transition-all text-left" 
                  placeholder="+216" 
                  dir="ltr" 
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs text-white/40 mb-2 block mr-1">الموضوع</label>
              <select 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold outline-none transition-all appearance-none text-white [&>option]:bg-black [&>option]:text-white"
              >
                <option value="استفسار عن الإعلانات الممولة">استفسار عن الإعلانات الممولة</option>
                <option value="استفسار عن التصميم">استفسار عن التصميم</option>
                <option value="استفسار عن صناعة الفيديو">استفسار عن صناعة الفيديو</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-white/40 mb-2 block mr-1">رسالتك</label>
              <textarea 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold outline-none transition-all min-h-[150px]" 
                placeholder="كيف يمكننا مساعدتك؟"
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full gold-gradient text-black font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <>جاري الإرسال <Loader2 size={20} className="animate-spin" /></>
              ) : (
                <>إرسال الرسالة <Send size={20} /></>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
