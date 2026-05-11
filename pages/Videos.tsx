import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Share2, Heart, MessageSquare, Eye, X, ExternalLink } from 'lucide-react';

const videos = [
  {
    id: 1,
    title: 'قصة نجاح - حملة إعلانية متكاملة',
    desc: 'كيف ساعدنا أحد عملائنا في مضاعفة مبيعاته من خلال استراتيجية فيديو مبتكرة.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop',
    videoUrl: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FSanadAds%2Fvideos%2F10153231339611729%2F&show_text=0', 
    views: '15K',
    likes: '1.5K',
    type: 'facebook'
  },
  {
    id: 2,
    title: 'خلف الكواليس - فريق العمل',
    desc: 'تعرف على الفريق المبدع خلف فيديوهاتنا الإنتاجية والعمل الدؤوب لإخراج الأفضل.',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop',
    videoUrl: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FSanadAds%2Fvideos%2F10152912426061729%2F&show_text=0',
    views: '10K',
    likes: '1.1K',
    type: 'facebook'
  },
  {
    id: 3,
    title: 'نصائح تسويقية سريعة',
    desc: 'سلسلة من الفيديوهات القصيرة لنشر الثقافة التسويقية والارتقاء بعلامتك التجارية.',
    thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=2674&auto=format&fit=crop',
    videoUrl: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FSanadAds%2Fvideos%2F10153231339611729%2F&show_text=0',
    views: '22K',
    likes: '3.4K',
    type: 'facebook'
  },
  {
    id: 4,
    title: 'تصميم الهوية البصرية',
    desc: 'رحلة تصميم شعار وهويّة احترافية تعبر عن قيم ورؤية شركتك.',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2671&auto=format&fit=crop',
    videoUrl: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FSanadAds%2Fvideos%2F10152912426061729%2F&show_text=0',
    views: '18K',
    likes: '2.8K',
    type: 'facebook'
  }
];

const Videos: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<typeof videos[0] | null>(null);

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl lg:text-6xl font-bold luxury-text mb-6">فيديوهات <span className="gold-text-gradient">إشهارية</span></h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          نشاهد هنا الإبداع في الحركة. فيديوهات مصممة خصيصاً لتترك انطباعاً لا يُنسى لدى جمهورك من صفحتنا الرسمية على فيسبوك.
        </p>
        <div className="mt-8">
          <a 
            href="https://www.facebook.com/share/1DyPcQcdxg/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-gold text-black px-8 py-3 rounded-full hover:bg-gold-dark transition-all font-bold"
          >
            تصفح صفحتنا على فيسبوك <ExternalLink size={18} />
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-12">
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group"
          >
            <div className="relative aspect-video rounded-[32px] overflow-hidden mb-6 flex items-center justify-center bg-black border border-white/5">
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  onClick={() => setActiveVideo(video)}
                  className="w-20 h-20 rounded-full bg-gold text-black flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)] transform hover:scale-110 transition-transform"
                >
                  <Play size={32} fill="currentColor" />
                </button>
              </div>
              
              <div className="absolute bottom-4 right-4 flex gap-4 text-xs font-bold text-white/80">
                <span className="flex items-center gap-1"><Eye size={14} /> {video.views}</span>
                <span className="flex items-center gap-1"><Heart size={14} /> {video.likes}</span>
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-3">{video.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-6">{video.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Video Lightbox Player */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6"
          >
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
            >
              <X size={40} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl glass border border-white/10"
            >
              <iframe 
                src={`${activeVideo.videoUrl}&autoplay=1`}
                className="w-full h-full"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Videos;
