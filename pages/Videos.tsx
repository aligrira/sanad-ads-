import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, Plus, Upload, Image as ImageIcon, Video, Filter } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, addDoc, query, deleteDoc, doc } from 'firebase/firestore';

const Videos: React.FC = () => {
  const [activeMedia, setActiveMedia] = useState<any | null>(null);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [customMedia, setCustomMedia] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'custom_video' | 'custom_image'>('all');
  
  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [videoLink, setVideoLink] = useState('');
  const [uploadType, setUploadType] = useState<'image' | 'video'>('image');
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
    setUploading(true);
    setUploadError(null);

    try {
      if (uploadType === 'image') {
        if (!file) throw new Error('يرجى اختيار صورة أولاً.');
        const { compressImageBase64 } = await import('../lib/utils');
        const downloadURL = await compressImageBase64(file);
        
        await addDoc(collection(db, 'portfolio_media'), {
          videoUrl: downloadURL,
          type: 'custom_image',
          createdAt: Date.now()
        });
      } else {
        if (!videoLink) throw new Error('يرجى إضافة رابط الفيديو.');
        
        await addDoc(collection(db, 'portfolio_media'), {
          videoUrl: videoLink,
          type: 'custom_video',
          createdAt: Date.now()
        });
      }
      
      setShowUploadModal(false);
      setFile(null);
      setVideoLink('');
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, 'portfolio_media');
      setUploadError(error.message || 'حدث خطأ أثناء حفظ البيانات في مساحة العمل.');
    } finally {
      setUploading(false);
    }
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
              className="relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden bg-[#0a0f16] border border-white/5 shadow-lg"
            >
              {media.type === 'custom_video' ? (
                <a 
                  href={media.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-full relative cursor-pointer block"
                  style={{ backgroundImage: 'linear-gradient(to bottom right, #111, #222)' }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-[#1877F2]/20 text-[#1877F2] flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                        <Play size={24} fill="currentColor" />
                      </div>
                      <span className="text-white font-bold text-sm bg-[#1877F2] px-4 py-2 rounded-full shadow-lg">فتح في فيسبوك</span>
                    </div>
                  </div>
                </a>
              ) : (
                <div 
                  className="w-full h-full cursor-pointer"
                  onClick={() => setActiveMedia(media)}
                >
                  <img 
                    src={media.videoUrl} 
                    alt="ميديا" 
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
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
              
              <div className="flex gap-2 mb-6" dir="rtl">
                <button
                  onClick={() => setUploadType('image')}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${uploadType === 'image' ? 'bg-gold text-black' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                >
                  صورة (من هاتفك)
                </button>
                <button
                  onClick={() => setUploadType('video')}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${uploadType === 'video' ? 'bg-gold text-black' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                >
                  فيديو (رابط)
                </button>
              </div>

              {uploadError && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-4 text-sm text-right leading-relaxed" dir="rtl">
                  {uploadError}
                </div>
              )}

              <form onSubmit={handleUpload} className="space-y-6 text-right" dir="rtl">
                {uploadType === 'image' ? (
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">اختر الصورة من هاتفك</label>
                    <input 
                      type="file" 
                      required
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-gold file:text-black hover:file:bg-gold-dark cursor-pointer text-sm"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">رابط الفيديو (من جوجل درايف، يوتيوب...)</label>
                    <input 
                      type="url" 
                      required
                      value={videoLink}
                      onChange={(e) => setVideoLink(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 text-sm text-left dir-ltr"
                    />
                  </div>
                )}

                {uploading ? (
                  <div className="pt-2 flex items-center justify-center">
                    <span className="text-gold font-bold">جاري الرفع...</span>
                  </div>
                ) : (
                  <button 
                    type="submit"
                    className="w-full bg-gold text-black font-bold py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-gold-dark transition-colors text-sm sm:text-base mt-4"
                  >
                    <Upload size={20} />
                    {uploadType === 'image' ? 'رفع الصورة' : 'إضافة الفيديو'}
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
