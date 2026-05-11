import React from 'react';
import { motion } from 'motion/react';
import { Bell, MessageCircle, Gift, Info, ChevronLeft, Check } from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'order',
    title: 'تحديث حالة الطلب',
    body: 'تم قبول طلبك للإعلان الممول، سيقوم فريقنا بالبدء بالعمل قريباً.',
    time: 'منذ ساعتين',
    icon: Check,
    color: 'text-green-400',
    bg: 'bg-green-400/10'
  },
  {
    id: 2,
    type: 'promo',
    title: 'عرض خاص لفترة محدودة',
    body: 'احصل على حسم 20% عند طلب باقة الهوية الماسية اليوم!',
    time: 'منذ 5 ساعات',
    icon: Gift,
    color: 'text-gold',
    bg: 'bg-gold/10'
  },
  {
    id: 3,
    type: 'system',
    title: 'مرحبا بك في سند للإعلان',
    body: 'شكراً لانضمامك إلينا! استكشف خدماتنا وابدأ مشروعك الأول.',
    time: 'منذ يومين',
    icon: Info,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10'
  }
];

const Notifications: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-bold luxury-text mb-2">الإشعارات</h1>
          <p className="text-white/40 text-sm">ابقَ على اطلاع بأحدث التحديثات والعروض</p>
        </div>
        <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-gold">
          <Bell size={24} />
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notif, index) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass p-6 rounded-[32px] border-white/5 hover:border-gold/30 transition-all group"
          >
            <div className="flex gap-4">
              <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${notif.bg} ${notif.color}`}>
                <notif.icon size={22} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-base">{notif.title}</h3>
                  <span className="text-[10px] text-white/20 uppercase font-mono tracking-wider">{notif.time}</span>
                </div>
                <p className="text-sm text-white/50 leading-relaxed">
                  {notif.body}
                </p>
                <div className="mt-4 flex justify-end">
                  <button className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    التفاصيل <ChevronLeft size={12} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/10 mx-auto mb-6">
            <Bell size={40} />
          </div>
          <p className="text-white/30">لا توجد إشعارات جديدة حالياً</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
