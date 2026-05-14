import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, ChevronRight, Share2, Target, Brush, Video, Layout, BarChart, AlertCircle, Loader2, Package, Upload, Image as ImageIcon, Film, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { compressImageBase64 } from '../lib/utils';


const services = [
  { id: 'video-bundle', icon: Video, title: 'باقة الفيديو والترويج' },
  { id: 'daily-ads', icon: Target, title: 'الإشهار اليومي لمنتج' },
  { id: 'fb-pages', icon: Share2, title: 'تطوير صفحات فيسبوك' },
  { id: 'ads', icon: Target, title: 'إنشاء الإعلانات الممولة' },
  { id: 'design', icon: Brush, title: 'تصميم المنشورات الاحترافية' },
  { id: 'video', icon: Video, title: 'صناعة الفيديوهات الإشهارية' },
  { id: 'branding', icon: Layout, title: 'تحسين الهوية البصرية' },
  { id: 'campaigns', icon: BarChart, title: 'إدارة الحملات الإعلانية' },
  { id: 'diamond', icon: Package, title: 'الباقة الماسية' }
];

const RequestService: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const searchParams = new URLSearchParams(location.search);
  const packageId = searchParams.get('package');
  
  const getInitialService = () => {
    if (location.state?.service) return location.state.service;
    if (packageId === 'video-bundle') return 'باقة الفيديو والترويج';
    if (packageId === 'daily-ads') return 'الإشهار اليومي لمنتج';
    if (packageId === 'diamond') return 'الباقة الماسية';
    return '';
  };
  
  const [step, setStep] = useState(packageId ? 2 : 1);
  const [selectedService, setSelectedService] = useState(getInitialService());
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    phone: '',
    email: user?.email || '',
    details: '',
    duration: '1',
    mediaLinks: ''
  });
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files) as File[];
      const invalidVideos = filesArray.filter(f => f.type.startsWith('video/'));
      if (invalidVideos.length > 0) {
        alert('نعتذر، لا يمكن رفع فيديوهات مباشرة حالياً بسبب قيود المساحة. يرجى رفع الفيديوهات على Google Drive أو YouTube ووضع الرابط في المربع المخصص للروابط أسفل هذه الصفحة.');
      }
      
      const imagesArray = filesArray.filter(f => f.type.startsWith('image/'));
      if (selectedFiles.length + imagesArray.length > 5) {
        alert('يمكنك رفع 5 صور كحد أقصى.');
      }
      const allowedImages = imagesArray.slice(0, 5 - selectedFiles.length);
      setSelectedFiles(prev => [...prev, ...allowedImages]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (): Promise<string[]> => {
    const urls: string[] = [];
    if (selectedFiles.length === 0) return [];

    const totalFiles = selectedFiles.length;
    let completedFiles = 0;

    for (const file of selectedFiles) {
      try {
        const base64string = await compressImageBase64(file);
        urls.push(base64string);
        completedFiles++;
        setUploadProgress((completedFiles / totalFiles) * 100);
      } catch (err: any) {
        console.error("Image compression error:", err);
        throw new Error(err.message || 'حدث خطأ أثناء معالجة الصور (صيغة غير مدعومة).');
      }
    }
    return urls;
  };

  const handleSubmit = async () => {
    if (!selectedService || !formData.name || !formData.phone) {
      setError('يرجى التأكد من ملء جميع البيانات الأساسية.');
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const uploadedUrls = await uploadFiles();
      
      const requestDoc = await addDoc(collection(db, 'serviceRequests'), {
        userId: user?.uid || null,
        service: selectedService,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        details: formData.details,
        duration: selectedService === 'الإشهار اليومي لمنتج' ? formData.duration : null,
        mediaLinks: formData.mediaLinks,
        files: uploadedUrls,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      if (user?.uid) {
        try {
          await addDoc(collection(db, 'notifications'), {
            userId: user.uid,
            title: 'تم إرسال طلبك بنجاح',
            body: `لقد استلمنا طلبك لـ "${selectedService}". سيقوم فريقنا بمراجعته قريباً وتحديث الحالة.`,
            type: 'system',
            read: false,
            createdAt: Date.now()
          });
        } catch (notifError) {
          console.error("Failed to add notification:", notifError);
        }
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes("exceeds the maximum")) {
        setError('حجم الصور كبير جداً. حاول اختيار صور أقل عدداً أو ذات حجم أصغر.');
      } else {
        setError(err.message || 'فشل إرسال الطلب أو رفع الملفات. يرجى التأكد من اتصالك والمحاولة ثانية.');
      }
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  if (isSuccess) {
    return (
      <div className="pt-24 pb-20 px-6 max-w-2xl mx-auto text-center mt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-12 rounded-[40px] border-gold/20"
        >
          <div className="w-24 h-24 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-4xl font-bold luxury-text mb-4">تم استلام طلبك!</h1>
          <p className="text-white/60 mb-8 leading-relaxed">
            لقد تم إرسال طلبك بنجاح مع الملفات المرفقة. سيقوم فريقنا بمراجعة التفاصيل والتواصل معك قريباً.
          </p>

          <div className="bg-gold/5 border border-gold/10 rounded-3xl p-8 mb-10 text-right">
            <h3 className="font-bold text-gold mb-4 flex items-center gap-2">
              طرق الدفع المتاحة لتأكيد الطلب
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5">
                <span className="text-gold font-mono font-bold text-lg">29577989</span>
                <span className="text-sm">D17 (بريدي)</span>
              </div>
              <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5">
                <span 
                  className="text-gold font-mono font-bold text-md tracking-wider inline-flex gap-1" 
                  dir="ltr"
                  style={{ direction: 'ltr', unicodeBidi: 'bidi-override' }}
                >
                  {'5359 4020 4169 0664'.split(' ').map((chunk, i) => (
                    <span key={i}>{chunk}</span>
                  ))}
                </span>
                <span className="text-sm">بطاقة بريدية</span>
              </div>
              <p className="text-[10px] text-white/30 text-center mt-4">
                * يرجى إرسال نسخة من وصل الدفع عبر الواتساب لبدء العمل فوراً.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/dashboard" 
              className="px-8 py-4 bg-gold text-black rounded-2xl font-bold hover:scale-105 transition-transform"
            >
              متابعة الطلب
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl lg:text-5xl font-bold luxury-text mb-4">اطلب <span className="gold-text-gradient">مشروعك</span></h1>
        <p className="text-white/50">أخبرنا عما تحتاجه، وارفع صور منتجك وسنتكفل بالباقي.</p>
      </div>

      <div className="flex items-center gap-4 mb-20">
        {[1, 2, 3].map((i) => (
          <React.Fragment key={i}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= i ? 'bg-gold text-black' : 'bg-white/5 text-white/30 border border-white/10'}`}>
              {step > i ? <CheckCircle2 size={20} /> : i}
            </div>
            {i < 3 && <div className={`flex-1 h-px transition-all ${step > i ? 'bg-gold' : 'bg-white/10'}`} />}
          </React.Fragment>
        ))}
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass p-10 rounded-[40px] border-white/10 min-h-[400px] flex flex-col justify-between"
      >
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-12 flex items-center gap-3 text-sm mb-8">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {loading && uploadProgress > 0 && (
          <div className="mb-8">
             <div className="flex justify-between text-xs mb-2">
               <span className="text-gold font-bold">جاري رفع الملفات...</span>
               <span>{Math.round(uploadProgress)}%</span>
             </div>
             <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
               <motion.div 
                 className="bg-gold h-full" 
                 initial={{ width: 0 }}
                 animate={{ width: `${uploadProgress}%` }}
               />
             </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-8">اختر الخدمة المطلوبة</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedService(s.title)}
                  className={`p-6 rounded-3xl border text-right transition-all flex items-center gap-4 ${selectedService === s.title ? 'border-gold bg-gold/5 text-gold' : 'border-white/5 bg-white/5 text-white/70 hover:border-white/20'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${selectedService === s.title ? 'bg-gold text-black' : 'bg-white/10'}`}>
                    <s.icon size={24} />
                  </div>
                  <span className="font-bold">{s.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-8">معلومات التواصل</h2>
            <div className="grid md:grid-cols-2 gap-6">
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
              <label className="text-xs text-white/40 mb-2 block mr-1">البريد الإلكتروني (اختياري)</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold outline-none transition-all text-left" 
                placeholder="example@mail.com" 
                dir="ltr"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-8 text-right">تفاصيل المشروع والملفات</h2>
              
              {selectedService === 'الإشهار اليومي لمنتج' && (
                <div className="mb-8 text-right">
                  <label className="text-sm font-bold text-gold mb-3 block">مدة الإشهار (عدد الأيام)</label>
                  <div className="flex items-center gap-4 justify-end">
                    <span className="text-white/40">أيام إشهار (ابتداءً من 20 DT لليوم)</span>
                    <input 
                      type="number" 
                      min="1"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold outline-none w-32 font-bold text-center"
                    />
                  </div>
                </div>
              )}

              <div className="grid gap-8">
                <div className="text-right">
                  <label className="text-xs text-white/40 mb-2 block mr-1">وصف المشروع</label>
                  <textarea 
                    value={formData.details}
                    onChange={(e) => setFormData({...formData, details: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold outline-none transition-all min-h-[120px] text-right" 
                    placeholder="اكتب هنا تفاصيل منتجك، أهدافك، أو أي ملاحظات..."
                  ></textarea>
                </div>

                <div>
                   <label className="text-xs text-white/40 mb-4 block mr-1 text-right">رفع صور أو فيديوهات المنتج (من الاستوديو)</label>
                   
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                     {selectedFiles.map((file, idx) => (
                       <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 group">
                         {file.type.startsWith('image/') ? (
                           <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                         ) : (
                           <div className="w-full h-full flex flex-col items-center justify-center text-gold/40">
                             <Film size={32} />
                             <span className="text-[8px] mt-1 truncate px-2">{file.name}</span>
                           </div>
                         )}
                         <button 
                           onClick={() => removeFile(idx)}
                           className="absolute top-1 left-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                           <X size={12} />
                         </button>
                       </div>
                     ))}
                     
                     <button 
                       onClick={() => fileInputRef.current?.click()}
                       className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center hover:bg-gold/5 hover:border-gold/30 transition-all text-white/30 hover:text-gold"
                     >
                       <Upload size={32} />
                       <span className="text-[10px] mt-2 font-bold">رفع ملفات</span>
                     </button>
                   </div>
                   
                   <input 
                     type="file" 
                     ref={fileInputRef}
                     onChange={handleFileChange}
                     multiple
                     accept="image/*"
                     className="hidden"
                   />
                   
                   <p className="text-[10px] text-white/20 text-right italic">يمكنك اختيار عدة صور للمنتج مباشرة من جهازك. للفيديوهات يرجى استخدام الروابط بالأسفل.</p>
                </div>

                <div className="text-right">
                  <label className="text-xs text-white/40 mb-2 block mr-1">أو ضع روابط (Google Drive, etc)</label>
                  <input 
                    type="text"
                    value={formData.mediaLinks}
                    onChange={(e) => setFormData({...formData, mediaLinks: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold outline-none transition-all text-sm font-mono" 
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-12 justify-end">
          {step > 1 && (
            <button 
              disabled={loading}
              onClick={prevStep}
              className="px-8 py-4 rounded-xl border border-white/10 hover:border-white/30 transition-all font-bold disabled:opacity-30"
            >
              العودة
            </button>
          )}
          
          <button 
            disabled={(step === 1 && !selectedService) || loading}
            onClick={step === 3 ? handleSubmit : nextStep}
            className="px-8 py-4 rounded-xl gold-gradient text-black font-bold flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <>
                جاري الإرسال...
                <Loader2 size={20} className="animate-spin" />
              </>
            ) : (
              <>
                {step === 3 ? 'إرسال الطلب الآن' : 'المتابعة'}
                <ChevronRight size={20} className="rotate-180" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RequestService;
