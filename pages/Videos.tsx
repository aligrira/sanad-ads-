import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, Plus, Upload, Image as ImageIcon, Video, Filter } from 'lucide-react';
import { auth, db, storage, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, addDoc, query, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const Videos: React.FC = () => {
  const [activeMedia, setActiveMedia] = useState<any | null>(null);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [customMedia, setCustomMedia] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'custom_video' | 'custom_image'>('all');
  
  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => {
      const email = user?.email?.toLowerCase() || '';
      setIsAdmin(email === 'aligrira9@gmail.com' || email === 'aligrira2021@gmail.com');
    });

    const q = query(collection(db, 'portfolio_media'));
    const unsubData = onSnapshot(q, (snapshot) => {
      const mediaList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
      setCustomMedia(mediaList);
    }, (error) => {
      console.error("Firestore error reading portfolio", error);
    });

    return () => {
      unsubAuth();
      unsubData();
    };
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    const storageRef = ref(storage, `portfolio/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Timeout if stuck at 0% for 15 seconds (likely Storage not enabled or bad rules)
    const timeoutId = setTimeout(() => {
      if (uploadTask.snapshot.bytesTransferred === 0) {
        uploadTask.cancel();
        setUploading(false);
        setUploadError('انتهى وقت الرفع. يرجى تفعيل Firebase Storage في حسابك على Firebase، وتحديث قوانين Storage Rules إلى (allow read, write: if true;).');
      }
    }, 15000);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        clearTimeout(timeoutId);
        setUploading(false);
        setUploadError('حدث خطأ. تأكد من تفعيل Storage Rules في Firebase (allow read, write: if true;). التفاصيل: ' + error.message);
      },
      async () => {
        clearTimeout(timeoutId);
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const isVideo = file.type.startsWith('video/');
          
          await addDoc(collection(db, 'portfolio_media'), {
            videoUrl: downloadURL,
            type: isVideo ? 'custom_video' : 'custom_image',
            createdAt: Date.now()
          });
          
          setShowUploadModal(false);
          setFile(null);
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, 'portfolio_media');
          setUploadError('حدث خطأ أثناء حفظ البيانات في Firestore.');
        } finally {
          setUploading(false);
        }
      }
    );
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الملف؟')) return;
    try {
      await deleteDoc(doc(db, 'portfolio_media', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'portfolio_media');
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const filteredMedia = customMedia.filter(media => filter === 'all' || media.type === filter);

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 max-w-6xl mx-auto min-h-screen">
      <div className="text-center mb-10 relative">
        <h1 className="text-3xl sm:text-5xl font-bold luxury-text mb-4">أعمالنا</h1>
        
        {isAdmin && (
          <div className="mt-6 flex justify-center">
            <button 
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full hover:bg-white/20 transition-all font-bold text-sm sm:text-base"
            >
              إضافة فيديو/صورة من الهاتف <Plus size={18} />
            </button>
          </div>
        )}

        <div className="flex justify-center gap-2 sm:gap-4 mt-8">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 sm:px-6 py-2 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${filter === 'all' ? 'bg-gold text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}
          >
            <Filter size={16} /> الكل
          </button>
          <button 
            onClick={() => setFilter('custom_video')}
            className={`px-4 sm:px-6 py-2 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${filter === 'custom_video' ? 'bg-gold text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}
          >
            <Video size={16} /> فيديوهات
          </button>
          <button 
            onClick={() => setFilter('custom_image')}
            className={`px-4 sm:px-6 py-2 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${filter === 'custom_image' ? 'bg-gold text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}
          >
            <ImageIcon size={16} /> صور
          </button>
        </div>
      </div>

      {filteredMedia.length === 0 && (
        <div className="text-center py-20 text-white/40">
          لا توجد أعمال لعرضها حالياً
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredMedia.map((media, index) => (
          <motion.div
            key={media.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group relative"
          >
            <div 
              className="relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-black/40 border border-white/5 shadow-lg"
              onClick={() => setActiveMedia(media)}
            >
              {media.type === 'custom_video' ? (
                <div className="w-full h-full relative">
                  <video src={media.videoUrl} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-black/50 text-gold flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <Play size={24} fill="currentColor" />
                    </div>
                  </div>
                </div>
              ) : (
                <img 
                  src={media.videoUrl} 
                  alt="ميديا" 
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" 
                />
              )}
            </div>

            {isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(media.id);
                }}
                className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur z-10 transition-colors"
                title="حذف"
              >
                <X size={16} />
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md bg-[#0a0f16] border border-white/10 rounded-2xl p-6 shadow-2xl relative"
            >
              <button 
                onClick={() => !uploading && setShowUploadModal(false)}
                className="absolute top-4 left-4 text-white/50 hover:text-white"
                disabled={uploading}
              >
                <X size={24} />
              </button>
              
              <h2 className="text-xl font-bold mb-6 luxury-text text-right">إضافة صورة أو فيديو</h2>
              
              {uploadError && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-4 text-sm text-right leading-relaxed" dir="rtl">
                  {uploadError}
                </div>
              )}

              <form onSubmit={handleUpload} className="space-y-6 text-right" dir="rtl">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">اختر الملف من هاتفك</label>
                  <input 
                    type="file" 
                    required
                    accept="video/*,image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-gold file:text-black hover:file:bg-gold-dark cursor-pointer text-sm"
                  />
                </div>

                {uploading ? (
                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-white/50 mb-2">
                      <span>{Math.round(uploadProgress)}%</span>
                      <span>جاري الرفع...</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gold h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <button 
                    type="submit"
                    className="w-full bg-gold text-black font-bold py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-gold-dark transition-colors text-sm sm:text-base mt-4"
                  >
                    <Upload size={20} />
                    رفع الملف
                  </button>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Media Lightbox */}
      <AnimatePresence>
        {activeMedia && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-2 sm:p-6"
          >
            <button 
              onClick={() => setActiveMedia(null)}
              className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white/50 hover:text-white transition-colors z-10 bg-black/50 p-2 rounded-full backdrop-blur"
            >
              <X size={32} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-5xl rounded-2xl overflow-hidden flex items-center justify-center"
            >
              {activeMedia.type === 'custom_video' ? (
                <video 
                  src={activeMedia.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full max-h-[85vh] object-contain"
                />
              ) : (
                <img 
                  src={activeMedia.videoUrl}
                  alt="ميديا"
                  className="w-full h-full max-h-[85vh] object-contain"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Videos;
