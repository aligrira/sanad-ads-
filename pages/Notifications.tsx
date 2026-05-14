import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Gift, Info, Check, Trash2 } from 'lucide-react';
import { useNotifications } from '../lib/useNotifications';
import { doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
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

  const deleteNotification = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `notifications/${id}`);
    }
  };

  const clearAllNotifications = async () => {
    if (notifications.length === 0) return;
    if (!window.confirm('هل أنت متأكد من مسح جميع الإشعارات؟')) return;
    
    try {
      const batch = writeBatch(db);
      notifications.forEach((notif) => {
        batch.delete(doc(db, 'notifications', notif.id));
      });
      await batch.commit();
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 md:px-6 max-w-3xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-8 md:mb-12">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold luxury-text mb-2">الإشعارات</h1>
          <p className="text-white/40 text-[10px] md:text-xs">ابقَ على اطلاع بأحدث التحديثات</p>
        </div>
        <div className="flex items-center gap-4">
          {notifications.length > 0 && (
            <button 
              onClick={clearAllNotifications}
              className="text-white/30 hover:text-red-400 text-xs font-bold transition-colors px-3 py-2 bg-white/5 rounded-xl border border-white/5"
            >
              مسح الكل
            </button>
          )}
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl glass flex items-center justify-center text-gold relative">
            <Bell size={20} className="md:w-6 md:h-6" />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0a0f16]" />
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 md:space-y-4">
        <AnimatePresence>
          {notifications.map((notif, index) => {
            const style = getIconForType(notif.type);
            return (
              <motion.div
                key={notif.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => markAsRead(notif.id, notif.read)}
                className={`glass p-4 md:p-6 rounded-[24px] md:rounded-[32px] border-white/5 transition-all group cursor-pointer ${notif.read ? 'opacity-70' : 'border-gold/30 relative'}`}
              >
                {!notif.read && (
                  <div className="absolute top-4 left-4 md:top-6 md:left-6 w-2 h-2 md:w-2.5 md:h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                )}
                <div className="flex gap-3 md:gap-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-[16px] md:rounded-[20px] shrink-0 flex items-center justify-center ${style.bg} ${style.color}`}>
                    <style.icon size={18} className="md:w-5 md:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-bold text-xs md:text-sm truncate pr-2 ${!notif.read ? 'text-white' : 'text-white/80'}`}>{notif.title}</h3>
                      <span className="text-[9px] md:text-[10px] text-white/30 font-mono tracking-wider shrink-0" dir="ltr">{formatTime(notif.createdAt)}</span>
                    </div>
                    <p className="text-[10px] md:text-xs text-white/50 leading-relaxed mt-1 line-clamp-2 md:line-clamp-none">
                      {notif.body}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => deleteNotification(e, notif.id)}
                    className="shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/5 hover:bg-red-500/10 text-white/20 hover:text-red-500 flex items-center justify-center transition-colors mb-auto"
                  >
                    <Trash2 size={14} className="md:w-4 md:h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {notifications.length === 0 && (
        <div className="py-16 md:py-20 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 flex items-center justify-center text-white/10 mx-auto mb-4 md:mb-6">
            <Bell size={32} className="md:w-10 md:h-10" />
          </div>
          <p className="text-xs md:text-sm text-white/30">لا توجد إشعارات جديدة حالياً</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;

