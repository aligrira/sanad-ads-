import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Facebook, Instagram, Send, Smartphone } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-gold font-medium tracking-[0.2em] text-xs uppercase block mb-4">اتصل بنا</span>
          <h1 className="text-4xl lg:text-6xl font-bold luxury-text mb-6">نحن هنا <br /><span className="gold-text-gradient">لسماع أفكارك</span></h1>
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
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-white/40 mb-2 block mr-1">الاسم بالكامل</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold outline-none transition-all" placeholder="محمد أحمد" />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-2 block mr-1">رقم الهاتف</label>
                <input type="tel" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold outline-none transition-all text-left" placeholder="+216" dir="ltr" />
              </div>
            </div>
            
            <div>
              <label className="text-xs text-white/40 mb-2 block mr-1">الموضوع</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold outline-none transition-all appearance-none">
                <option value="ads">استفسار عن الإعلانات الممولة</option>
                <option value="design">استفسار عن التصميم</option>
                <option value="video">استفسار عن صناعة الفيديو</option>
                <option value="other">أخرى</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-white/40 mb-2 block mr-1">رسالتك</label>
              <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold outline-none transition-all min-h-[150px]" placeholder="كيف يمكننا مساعدتك؟"></textarea>
            </div>

            <button className="w-full gold-gradient text-black font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform">
              إرسال الرسالة
              <Send size={20} />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
