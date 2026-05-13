import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Bell, Gift, Info, ChevronLeft, Check } from 'lucide-react';
import { useNotifications } from '../lib/useNotifications';
import { doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';

const getIconForType = (type: string) => {
  switch (type) {
    case 'order': return { icon: Check, color: 'text-green-400', bg: 'bg-green-400/10' };
    case 'promo': return { icon: Gift, color: 'text-gold', bg: 'bg-gold/10' };
    case 'system': return { icon: Info, color: 'text-blue-400', bg: 'bg-blue-400/10' };
    default: return { icon: Bell, color: 'text-white', bg: 'bg-white/10' };
  }
};

const formatTime = (ts: number) => {
  const date = new Date(ts);
  return date.toLocaleDateString('ar-TN', { hour: '2-digit', minute: '2-digit' });
};

const Notifications: React.FC = () => {
  const { notifications } = useNotifications();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const markAsRead = async (id: string, currentlyRead: boolean) => {
    if (currentlyRead) return;
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `notifications/${id}`);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-bold luxury-text mb-2">الإشعارات</h1>
          <p className="text-white/40 text-sm">ابقَ على اطلاع بأحدث التحديثات والعروض</p>
        </div>
        <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-gold relative">
          <Bell size={24} />
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0a0f16]" />
          )}
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notif, index) => {
          const style = getIconForType(notif.type);
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => markAsRead(notif.id, notif.read)}
              className={`glass p-6 rounded-[32px] border-white/5 transition-all group cursor-pointer ${notif.read ? 'opacity-70' : 'border-gold/30 hover:border-gold/50 relative'}`}
            >
              {!notif.read && (
                <div className="absolute top-6 left-6 w-2 h-2 bg-gold text-gold rounded-full" />
              )}
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${style.bg} ${style.color}`}>
                  <style.icon size={22} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold text-base ${!notif.read ? 'text-white' : 'text-white/80'}`}>{notif.title}</h3>
                    <span className="text-[10px] text-white/20 font-mono tracking-wider" dir="ltr">{formatTime(notif.createdAt)}</span>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed mt-1">
                    {notif.body}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
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
