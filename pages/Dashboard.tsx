import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { User, Settings, Package, History, LogOut, Bell, ChevronLeft, Loader2, CreditCard, Trash2, Smartphone } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useNotifications } from '../lib/useNotifications';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, orderBy, getDocs, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentFor, setShowPaymentFor] = useState<string | null>(null);

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
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `serviceRequests/${requestId}`);
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
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full gold-gradient p-[1px]">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
               <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'U'}&background=D4AF37&color=000`} alt="User" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold luxury-text font-sans">أهلاً بك، {user?.displayName?.split(' ')[0]}</h1>
            <p className="text-white/40 text-sm">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-white/50 hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm font-bold">تسجيل الخروج</span>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="glass p-6 rounded-3xl border-white/5">
            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">طلباتي الأخيرة</h2>
            <button className="text-gold text-xs font-bold flex items-center gap-1">
              عرض الكل <ChevronLeft size={14} />
            </button>
          </div>
          
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="glass p-12 rounded-[32px] border-dashed border-white/10 text-center">
                <Package className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-white/40">لا توجد طلبات سابقة حتى الآن.</p>
                <Link to="/request-service" className="text-gold text-sm font-bold mt-4 inline-block">اطلب خدمتك الأولى الآن</Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="glass p-6 rounded-[24px] border-white/5 space-y-4 group hover:border-gold/30 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                        <History size={24} />
                      </div>
                      <div>
                        <div className="font-bold">{order.service}</div>
                        <div className="text-xs text-white/30 truncate max-w-[200px]">رقم الطلب: #{order.id.slice(-6)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </div>

                  {showPaymentFor === order.id ? (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-gold/5 border border-gold/20 rounded-2xl p-6 space-y-4"
                    >
                      <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                        <span className="text-gold font-mono font-bold">29577989</span>
                        <span className="text-[10px] font-bold">D17 (بريدي)</span>
                      </div>
                      <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                        <span 
                          className="text-gold font-mono font-bold text-sm tracking-wider inline-flex gap-1" 
                          dir="ltr"
                          style={{ direction: 'ltr', unicodeBidi: 'bidi-override' }}
                        >
                          {'5359 4020 4169 0664'.split(' ').map((chunk, i) => (
                            <span key={i}>{chunk}</span>
                          ))}
                        </span>
                        <span className="text-[10px] font-bold">بطاقة بريدية</span>
                      </div>
                      <button 
                        onClick={() => setShowPaymentFor(null)}
                        className="w-full py-2 text-[10px] text-white/40 font-bold hover:text-white"
                      >
                        إخفاء تفاصيل الدفع
                      </button>
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-3 pt-2">
                       {order.status === 'pending' && (
                         <button 
                           onClick={() => setShowPaymentFor(order.id)}
                           className="flex-1 bg-gold/10 text-gold py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-gold hover:text-black transition-all"
                         >
                           تأكيد الدفع
                           <CreditCard size={14} />
                         </button>
                       )}
                       {order.status === 'pending' && (
                         <button 
                           onClick={() => cancelRequest(order.id)}
                           className="px-4 py-3 rounded-xl bg-red-500/5 text-red-500/50 hover:bg-red-500/10 hover:text-red-500 transition-all"
                           title="إلغاء الطلب"
                         >
                           <Trash2 size={14} />
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
          <h2 className="text-xl font-bold">الحساب والإعدادات</h2>
          <div className="glass rounded-[32px] overflow-hidden border-white/5">
            <Link to="/payment-info" className="w-full p-6 flex items-center justify-between hover:bg-gold/5 transition-colors text-gold group">
              <div className="flex items-center gap-4">
                <CreditCard size={18} />
                <span className="text-sm font-bold">طرق الدفع وتأكيد الطلب</span>
              </div>
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            {[
              { label: 'تعديل الملف الشخصي', icon: User, path: '/dashboard' },
              { label: 'إشعارات التطبيق', icon: Bell, path: '/notifications', badge: unreadCount > 0 ? unreadCount : null },
              { label: 'تغيير كلمة المرور', icon: Settings, path: '/dashboard' },
            ].map((item, i) => (
              <Link 
                key={item.label} 
                to={item.path}
                className={`w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors block ${i !== 0 ? 'border-t border-white/5' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <item.icon size={18} className="text-white/40" />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#0a0f16]" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <ChevronLeft size={16} className="text-white/20" />
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full p-6 flex items-center justify-between hover:bg-red-500/10 transition-colors border-t border-white/5 text-red-500"
            >
              <div className="flex items-center gap-4">
                <LogOut size={18} />
                <span className="text-sm font-bold">تسجيل الخروج</span>
              </div>
            </button>
          </div>
          
          <div className="glass p-6 rounded-[32px] border-gold/10 bg-gold/[0.02]">
            <h3 className="font-bold mb-2">تحتاج مساعدة؟</h3>
            <p className="text-xs text-white/40 leading-relaxed mb-4">الدعم الفني متاح 24/7 لمساعدتك في تتبع طلباتك أو الإجابة على استفساراتك.</p>
            <a href="tel:+21692942482" className="text-gold text-xs font-bold block">اتصل بنا الآن</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
