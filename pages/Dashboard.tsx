import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Settings, Package, History, LogOut, Bell, ChevronLeft, Loader2, CreditCard, Trash2, Smartphone, CheckCircle2, Info } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useNotifications } from '../lib/useNotifications';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentFor, setShowPaymentFor] = useState<string | null>(null);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  useEffect(() => {
    if (!user) {
      if (!auth.currentUser) navigate('/login');
      return;
    }

    const q = query(
      collection(db, 'serviceRequests'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const cancelRequest = async (requestId: string) => {
    if (!window.confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) return;
    try {
      await deleteDoc(doc(db, 'serviceRequests', requestId));
      showMessage('success', 'تم إلغاء الطلب بنجاح');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `serviceRequests/${requestId}`);
      showMessage('error', 'فشل إلغاء الطلب');
    }
  };

  const showMessage = (type: 'success'|'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEditProfile = async () => {
    const newName = window.prompt("أدخل اسمك الجديد:", user?.displayName || "");
    if (newName && newName.trim() !== "" && user) {
      try {
        await updateProfile(user, { displayName: newName.trim() });
        showMessage('success', 'تم تحديث الملف الشخصي بنجاح');
        // Force refresh to show new name by reloading
        window.location.reload(); 
      } catch (error) {
        showMessage('error', 'حدث خطأ أثناء تحديث الملف الشخصي');
      }
    }
  };

  const handleResetPassword = async () => {
    if (user?.email) {
      if (window.confirm('سيتم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. هل أنت موافق؟')) {
        try {
          await sendPasswordResetEmail(auth, user.email);
          showMessage('success', 'تم إرسال رابط تغير كلمة المرور إلى بريدك الإلكتروني');
        } catch (error) {
          showMessage('error', 'حدث خطأ أثناء إرسال الرابط');
        }
      }
    } else {
      showMessage('error', 'لا يوجد بريد إلكتروني مرتبط بحسابك');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gold/10 text-gold';
      case 'in-progress': return 'bg-blue-400/10 text-blue-400';
      case 'completed': return 'bg-green-400/10 text-green-400';
      case 'cancelled': return 'bg-red-400/10 text-red-400';
      default: return 'bg-white/10 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'قيد الانتظار';
      case 'in-progress': return 'جاري التنفيذ';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-gold animate-spin" />
      </div>
    );
  }

  const stats = [
    { label: 'الطلبات النشطة', value: orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length.toString(), icon: Package, color: 'text-gold' },
    { label: 'إجمالي المشروعات', value: orders.length.toString(), icon: History, color: 'text-blue-400' },
    { label: 'الإشعارات', value: unreadCount.toString(), icon: Bell, color: 'text-red-400' },
  ];

  return (
    <div className="pt-24 pb-20 px-4 md:px-6 max-w-6xl mx-auto overflow-hidden">
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full flex items-center gap-2 text-sm font-bold shadow-2xl ${
              message.type === 'success' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'
            }`}
             style={{ direction: 'rtl' }}
          >
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <Info size={18} />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row items-center md:justify-between gap-6 mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-right">
          <div className="w-20 h-20 rounded-full gold-gradient p-[1px] shrink-0">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
               <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'U'}&background=D4AF37&color=000`} alt="User" />
            </div>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold luxury-text font-sans mb-1">أهلاً بك، {user?.displayName?.split(' ')[0]}</h1>
            <p className="text-white/40 text-xs md:text-sm" dir="ltr">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-white/50 hover:text-red-400 transition-colors bg-white/5 md:bg-transparent px-4 py-2 md:p-0 rounded-xl md:rounded-none"
        >
          <LogOut size={18} />
          <span className="text-xs md:text-sm font-bold">تسجيل الخروج</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-12">
        {stats.map((stat, idx) => (
          <div key={stat.label} className={`glass p-4 md:p-6 rounded-[20px] md:rounded-3xl border-white/5 ${idx === 2 ? 'col-span-2 md:col-span-1' : ''}`}>
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3 md:mb-4 ${stat.color}`}>
              <stat.icon size={18} className="md:w-5 md:h-5" />
            </div>
            <div className="text-xl md:text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-[10px] md:text-xs text-white/40 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-bold">طلباتي الأخيرة</h2>
            <Link to="/request-service" className="text-gold text-[10px] md:text-xs font-bold flex items-center gap-1 hover:underline">
              اطلب خدمة جديدة <ChevronLeft size={14} />
            </Link>
          </div>
          
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="glass p-8 md:p-12 rounded-[24px] md:rounded-[32px] border-dashed border-white/10 text-center">
                <Package className="w-10 h-10 md:w-12 md:h-12 text-white/10 mx-auto mb-4" />
                <p className="text-[10px] md:text-sm text-white/40">لا توجد طلبات سابقة حتى الآن.</p>
                <Link to="/request-service" className="text-gold text-xs md:text-sm font-bold mt-4 inline-block">اطلب خدمتك الأولى الآن</Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="glass p-4 md:p-6 rounded-[20px] md:rounded-[24px] border-white/5 space-y-4 group hover:border-gold/30 transition-all">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 w-full min-w-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 shrink-0">
                        <History size={20} className="md:w-6 md:h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-sm md:text-base truncate">{order.service}</div>
                        <div className="text-[9px] md:text-[10px] text-white/30 truncate">رقم الطلب: #{order.id.slice(-6)}</div>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <span className={`text-[9px] md:text-[10px] px-2 py-1 md:px-3 md:py-1 rounded-full font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </div>

                  {showPaymentFor === order.id ? (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-gold/5 border border-gold/20 rounded-2xl p-4 md:p-6 space-y-3 md:space-y-4"
                    >
                      <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                        <span className="text-gold font-mono font-bold text-sm">29577989</span>
                        <span className="text-[9px] md:text-[10px] font-bold">D17 (بريدي)</span>
                      </div>
                      <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                        <span 
                          className="text-gold font-mono font-bold text-[10px] md:text-sm tracking-widest inline-flex gap-1" 
                          dir="ltr"
                          style={{ direction: 'ltr', unicodeBidi: 'bidi-override' }}
                        >
                          {'5359 4020 4169 0664'.split(' ').map((chunk, i) => (
                            <span key={i}>{chunk}</span>
                          ))}
                        </span>
                        <span className="text-[9px] md:text-[10px] font-bold">بطاقة بريدية</span>
                      </div>
                      <button 
                        onClick={() => setShowPaymentFor(null)}
                        className="w-full py-2 text-[10px] text-white/40 font-bold hover:text-white"
                      >
                        إخفاء تفاصيل الدفع
                      </button>
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-2 md:gap-3 pt-2">
                       {order.status === 'pending' && (
                         <button 
                           onClick={() => setShowPaymentFor(order.id)}
                           className="flex-1 bg-gold/10 text-gold py-2.5 md:py-3 rounded-xl text-[10px] md:text-xs font-bold flex items-center justify-center gap-2 hover:bg-gold hover:text-black transition-all"
                         >
                           تأكيد الدفع
                           <CreditCard size={14} className="hidden sm:block" />
                         </button>
                       )}
                       {order.status === 'pending' && (
                         <button 
                           onClick={() => cancelRequest(order.id)}
                           className="px-3 py-2.5 md:px-4 md:py-3 rounded-xl bg-red-500/5 text-red-500/50 hover:bg-red-500/10 hover:text-red-500 transition-all shrink-0"
                           title="إلغاء الطلب"
                         >
                           <Trash2 size={16} />
                         </button>
                       )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg md:text-xl font-bold">الحساب والإعدادات</h2>
          <div className="glass rounded-[24px] md:rounded-[32px] overflow-hidden border-white/5">
            <Link to="/payment-info" className="w-full p-4 md:p-6 flex items-center justify-between hover:bg-gold/5 transition-colors text-gold group">
              <div className="flex items-center gap-3 md:gap-4">
                <CreditCard size={18} />
                <span className="text-xs md:text-sm font-bold">طرق الدفع لتأكيد الطلب</span>
              </div>
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            
            <button 
              onClick={handleEditProfile}
              className="w-full text-right p-4 md:p-6 flex items-center justify-between hover:bg-white/5 transition-colors block border-t border-white/5"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <User size={18} className="text-white/40" />
                <span className="text-xs md:text-sm font-medium">تعديل الملف الشخصي</span>
              </div>
              <ChevronLeft size={16} className="text-white/20" />
            </button>

            <Link 
              to="/notifications"
              className="w-full p-4 md:p-6 flex items-center justify-between hover:bg-white/5 transition-colors block border-t border-white/5"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className="relative">
                  <Bell size={18} className="text-white/40" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#0a0f16]" />
                  )}
                </div>
                <span className="text-xs md:text-sm font-medium">إشعارات التطبيق</span>
              </div>
              <ChevronLeft size={16} className="text-white/20" />
            </Link>

            <button 
              onClick={handleResetPassword}
              className="w-full text-right p-4 md:p-6 flex items-center justify-between hover:bg-white/5 transition-colors block border-t border-white/5"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <Settings size={18} className="text-white/40" />
                <span className="text-xs md:text-sm font-medium">تغيير كلمة المرور</span>
              </div>
              <ChevronLeft size={16} className="text-white/20" />
            </button>

            <button
              onClick={handleLogout}
              className="w-full p-4 md:p-6 flex items-center justify-between hover:bg-red-500/10 transition-colors border-t border-white/5 text-red-500"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <LogOut size={18} />
                <span className="text-xs md:text-sm font-bold">تسجيل الخروج</span>
              </div>
            </button>
          </div>
          
          <div className="glass p-5 md:p-6 rounded-[24px] md:rounded-[32px] border-gold/10 bg-gold/[0.02]">
            <h3 className="font-bold mb-2 text-sm md:text-base">تحتاج مساعدة؟</h3>
            <p className="text-[10px] md:text-xs text-white/40 leading-relaxed mb-4">الدعم الفني متاح 24/7 لمساعدتك في تتبع طلباتك أو الإجابة على استفساراتك.</p>
            <a href="tel:+21692942482" className="text-gold text-[10px] md:text-xs font-bold block">اتصل بنا الآن</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
