import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Package, Clock, CheckCircle2, XCircle, Search, MessageSquare, ExternalLink, Loader2, ArrowRight, Trash2, User, Video, LogOut, Send } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

const ADMIN_EMAILS = ['aligrira9@gmail.com', 'aligrira2021@gmail.com'].map(e => e.toLowerCase());

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'requests' | 'users'>('requests');
  const [requests, setRequests] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [customMessages, setCustomMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    const userEmail = user?.email?.toLowerCase() || '';
    if (user && !ADMIN_EMAILS.includes(userEmail)) {
      navigate('/dashboard');
      return;
    }

    const qRequests = query(collection(db, 'serviceRequests'), orderBy('createdAt', 'desc'));
    const unsubscribeRequests = onSnapshot(qRequests, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(data);
      setLoading(false);
    }, (error) => {
      console.error("Admin Access Error (Requests):", error);
      setLoading(false);
    });

    const qUsers = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((u: any) => {
          const email = u.email?.toLowerCase() || '';
          return !ADMIN_EMAILS.includes(email);
        });
      setUsers(data);
    }, (error) => {
      console.error("Admin Access Error (Users):", error);
    });

    return () => {
      unsubscribeRequests();
      unsubscribeUsers();
    };
  }, [user, navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const updateStatus = async (requestId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'serviceRequests', requestId), {
        status: newStatus
      });
      
      const req = requests.find(r => r.id === requestId);
      if (req?.userId) {
        let title = '';
        let body = '';
        if (newStatus === 'in-progress') {
          title = 'طلبك قيد التنفيذ';
          body = `بدأ فريقنا الدخول والعمل على طلبك "${req.service}".`;
        } else if (newStatus === 'completed') {
          title = 'اكتمل طلبك!';
          body = `تم الانتهاء من "${req.service}". يرجى التحقق من الرسائل أو لوحة التحكم.`;
        } else if (newStatus === 'cancelled') {
          title = 'تم إلغاء طلبك';
          body = `عذراً، تم إلغاء طلبك "${req.service}". يرجى التواصل معنا لمزيد من التفاصيل.`;
        }

        if (title) {
          try {
            await addDoc(collection(db, 'notifications'), {
              userId: req.userId,
              title,
              body,
              type: 'order',
              read: false,
              createdAt: Date.now()
            });
          } catch (notifError) {
            console.error("Notification Error:", notifError);
          }
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `serviceRequests/${requestId}`);
    }
  };

  const sendCustomMessage = async (userId: string, requestId: string) => {
    const msg = customMessages[requestId];
    if (!msg || !msg.trim()) return;
    
    try {
      await addDoc(collection(db, 'notifications'), {
        userId,
        title: 'رسالة إدارية',
        body: msg.trim(),
        type: 'system',
        read: false,
        createdAt: Date.now()
      });
      alert('تم إرسال الإشعار للعميل بنجاح');
      setCustomMessages(prev => ({ ...prev, [requestId]: '' }));
    } catch (error) {
      console.error("Custom Notification Error:", error);
      alert('خطأ أثناء إرسال الرسالة');
    }
  };

  const deleteRequest = async (requestId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطلب نهائياً؟')) return;
    
    try {
      await deleteDoc(doc(db, 'serviceRequests', requestId));
      alert('تم حذف الطلب بنجاح');
    } catch (error: any) {
      console.error("Delete Request Error:", error);
      alert('فشل حذف الطلب: ' + (error.message || 'عذراً، لا تملك الصلاحيات الكافية لهذا الإجراء.'));
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا العميل وجميع بياناته؟')) return;
    try {
      await deleteDoc(doc(db, 'users', userId));
      alert('تم حذف العميل بنجاح');
    } catch (error: any) {
      console.error("Delete User Error:", error);
      alert('فشل حذف العميل: ' + (error.message || 'عذراً، لا تملك الصلاحيات الكافية لهذا الإجراء.'));
    }
  };

  const toggleBlockUser = async (userId: string, currentStatus: boolean) => {
    const action = currentStatus ? 'فك حظر' : 'حظر';
    if (!window.confirm(`هل أنت متأكد من ${action} هذا العميل؟`)) return;
    try {
      await updateDoc(doc(db, 'users', userId), {
        isBlocked: !currentStatus
      });
      alert(`تم ${action} العميل بنجاح`);
    } catch (error) {
      console.error(error);
      alert(`فشل ${action} العميل.`);
    }
  };

  const filteredRequests = requests.filter(req => filter === 'all' || req.status === filter);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-gold animate-spin" />
    </div>
  );

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 text-right">
        <div>
          <h1 className="text-3xl font-bold luxury-text mb-2">لوحة إدارة الإعلانات</h1>
          <p className="text-white/40">مرحباً بك يا مسؤول.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex gap-4 p-1 bg-white/5 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'requests' ? 'bg-gold text-black' : 'text-white/50 hover:text-white'}`}
            >
              <Package size={18} />
              الطلبات
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-gold text-black' : 'text-white/50 hover:text-white'}`}
            >
              <User size={18} />
              العملاء
            </button>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/50 hover:text-red-400 transition-colors p-3 bg-red-500/5 rounded-2xl border border-red-500/10"
          >
            <LogOut size={20} />
            <span className="text-sm font-bold">تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {activeTab === 'requests' ? (
        <>
          <div className="flex justify-start mb-8">
            <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'pending', label: 'الجديدة' },
                { id: 'in-progress', label: 'قيد التنفيذ' },
                { id: 'completed', label: 'المكتملة' },
              ].map(btn => (
                <button
                  key={btn.id}
                  onClick={() => setFilter(btn.id)}
                  className={`px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${filter === btn.id ? 'bg-gold/20 text-gold border border-gold/30' : 'text-white/50 hover:text-white'}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="glass p-6 rounded-3xl border-white/5 text-center">
              <div className="text-3xl font-bold mb-1 text-gold">{requests.length}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">إجمالي الطلبات</div>
            </div>
            <div className="glass p-6 rounded-3xl border-white/5 text-center">
              <div className="text-3xl font-bold mb-1 text-blue-400">{requests.filter(r => r.status === 'pending').length}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">طلبات جديدة</div>
            </div>
            <div className="glass p-6 rounded-3xl border-white/5 text-center">
              <div className="text-3xl font-bold mb-1 text-yellow-400">{requests.filter(r => r.status === 'in-progress').length}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">قيد العمل</div>
            </div>
            <div className="glass p-6 rounded-3xl border-white/5 text-center">
              <div className="text-3xl font-bold mb-1 text-green-400">{requests.filter(r => r.status === 'completed').length}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">تم إنجازها</div>
            </div>
          </div>

          <div className="space-y-6">
            {filteredRequests.map((req) => (
              <div key={req.id} className="glass p-8 rounded-[40px] border-white/5 hover:border-gold/20 transition-all text-right">
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-3">
                         <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                           req.status === 'pending' ? 'bg-blue-500/10 text-blue-400' :
                           req.status === 'in-progress' ? 'bg-yellow-500/10 text-yellow-400' :
                           req.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                         }`}>
                           {req.status === 'pending' ? 'جديد' : req.status === 'in-progress' ? 'قيد التنفيذ' : req.status === 'completed' ? 'مكتمل' : 'ملغي'}
                         </span>
                         <span className="text-xs text-white/20">#{req.id.slice(-6)}</span>
                       </div>
                       <div className="text-xs text-white/30">{req.createdAt?.toDate?.()?.toLocaleString('ar-TN')}</div>
                    </div>

                    <h3 className="text-2xl font-bold text-gold">{req.service}</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-2xl flex flex-col gap-1">
                        <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">اسم العميل</span>
                        <span className="font-bold">{req.name}</span>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl flex flex-col gap-1">
                        <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">رقم الهاتف</span>
                        <span className="font-mono">{req.phone}</span>
                      </div>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl space-y-4">
                      <div>
                        <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest block mb-2">تفاصيل المشروع</span>
                        <p className="text-sm text-white/70 leading-relaxed">{req.details || 'لا يوجد تفاصيل إضافية'}</p>
                      </div>
                      
                      {req.duration && (
                        <div>
                          <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest block mb-2">المدة (أيام)</span>
                          <span className="text-gold font-bold">{req.duration} أيام</span>
                        </div>
                      )}

                      {req.mediaLinks && (
                        <div>
                          <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest block mb-1">روابط ملفات المنتج</span>
                          <div className="p-3 bg-black/30 rounded-xl border border-white/5 overflow-hidden">
                            <p className="text-[10px] font-mono text-white/40 break-all whitespace-pre-wrap">{req.mediaLinks}</p>
                          </div>
                        </div>
                      )}

                      {req.files && req.files.length > 0 && (
                        <div>
                          <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest block mb-2">الملفات المرفوعة ({req.files.length})</span>
                          <div className="grid grid-cols-4 gap-2">
                            {req.files.map((fileUrl: string, idx: number) => (
                              <a 
                                key={idx}
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="aspect-square rounded-lg overflow-hidden bg-black/30 border border-white/5 flex items-center justify-center hover:border-gold/50 transition-colors"
                              >
                                {fileUrl.toLowerCase().includes('mp4') || fileUrl.includes('video') ? (
                                  <Video size={16} className="text-gold" />
                                ) : (
                                  <img src={fileUrl} className="w-full h-full object-cover" alt="" />
                                )}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="lg:w-72 space-y-4 pt-10">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] text-white/40 mr-1 block uppercase font-bold tracking-widest">تحديث الحالة</span>
                      <select 
                        value={req.status}
                        onChange={(e) => updateStatus(req.id, e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold"
                      >
                        <option value="pending">جديد</option>
                        <option value="in-progress">قيد التنفيذ</option>
                        <option value="completed">مكتمل</option>
                        <option value="cancelled">ملغي</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                      <div className="flex gap-2">
                        <a 
                          href={`https://wa.me/${req.phone.replace(/[^0-9]/g, '')}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex-1 bg-[#25D366] text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold hover:scale-105 transition-transform"
                        >
                          <MessageSquare size={18} />
                        </a>
                        <a 
                          href={`tel:${req.phone}`}
                          className="flex-1 bg-white/10 text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-white/20 transition-colors"
                        >
                          <ExternalLink size={18} />
                        </a>
                      </div>

                      <div className="pt-4 border-t border-white/10 mt-2">
                        <span className="text-[10px] text-white/40 mb-2 block uppercase font-bold tracking-widest">إرسال إشعار للعميل</span>
                        <div className="flex flex-col gap-2">
                          <textarea
                            className="bg-black/40 border border-white/5 rounded-xl p-3 text-sm resize-none focus:border-gold outline-none h-20"
                            placeholder="اكتب رسالة أو ملاحظة وسيتلقاها العميل كإشعار..."
                            value={customMessages[req.id] || ''}
                            onChange={(e) => setCustomMessages(prev => ({ ...prev, [req.id]: e.target.value }))}
                          />
                          <button
                            onClick={() => sendCustomMessage(req.userId, req.id)}
                            className="w-full bg-gold/10 text-gold hover:bg-gold hover:text-black py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all"
                          >
                            إرسال الرسالة
                            <Send size={16} />
                          </button>
                        </div>
                      </div>

                      <button 
                        onClick={() => deleteRequest(req.id)}
                        className="w-full bg-red-500/10 text-red-500 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-red-500 hover:text-white transition-all mt-4"
                      >
                        حذف الطلب
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredRequests.length === 0 && (
              <div className="py-20 text-center glass rounded-[40px] border-dashed border-white/10">
                <Package className="w-16 h-16 text-white/10 mx-auto mb-4" />
                <p className="text-white/40 text-lg">لا توجد طلبات في هذا القسم حالياً.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((u) => (
            <div key={u.id} className={`glass p-6 rounded-[32px] border-white/5 flex flex-col items-center text-center relative overflow-hidden ${u.isBlocked ? 'border-red-500/30' : ''}`}>
               {u.isBlocked && (
                 <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold z-10">
                   محظور
                 </div>
               )}
               <div className="w-20 h-20 rounded-full bg-gold/10 p-1 mb-4">
                 <img 
                   src={`https://ui-avatars.com/api/?name=${u.name}&background=D4AF37&color=000`} 
                   className="w-full h-full rounded-full" 
                   alt={u.name} 
                 />
               </div>
               <h3 className="font-bold text-lg mb-1">{u.name}</h3>
               <p className="text-white/40 text-xs mb-4">{u.email}</p>
               
               <div className="w-full space-y-2 mt-4 pt-4 border-t border-white/5">
                 <div className="flex items-center justify-between text-[10px] text-white/30 uppercase tracking-widest px-2">
                   <span>تاريخ التسجيل</span>
                   <span>{u.createdAt?.toDate?.()?.toLocaleDateString('ar-TN') || 'غير متاح'}</span>
                 </div>
                 <div className="flex items-center justify-between text-[10px] text-white/30 uppercase tracking-widest px-2">
                   <span>رقم الهاتف</span>
                   <span className="font-mono text-white/60">{u.phone || '---'}</span>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-3 w-full mt-6">
                 <button 
                   onClick={() => toggleBlockUser(u.id, !!u.isBlocked)}
                   className={`py-3 rounded-xl text-xs font-bold transition-all border ${u.isBlocked ? 'border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white' : 'border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white'}`}
                 >
                   {u.isBlocked ? 'فك الحظر' : 'حظر العميل'}
                 </button>
                 <button 
                   onClick={() => deleteUser(u.id)}
                   className="py-3 rounded-xl text-xs font-bold border border-white/10 text-white/40 hover:bg-white/10 hover:text-white transition-all"
                 >
                   حذف نهائي
                 </button>
               </div>
            </div>
          ))}

          {users.length === 0 && (
            <div className="col-span-full py-20 text-center glass rounded-[40px] border-dashed border-white/10">
              <User className="w-16 h-16 text-white/10 mx-auto mb-4" />
              <p className="text-white/40 text-lg">لا يوجد عملاء مسجلون حالياً.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
