import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Facebook, Instagram, Video, ImageIcon as IconImage } from 'lucide-react';
import { Link } from 'react-router-dom';

// Placeholder for social items
const portfolioItems = [
  {
    id: 1,
    title: 'تصميم هوية بصرية - شركة النور',
    category: 'هوية بصرية',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2671&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'حملة إعلانية ممولة - مطعم السندباد',
    category: 'إعلانات',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'فيديو إشهاري جديد - تكنولوجيا المستقبل',
    category: 'فيديو',
    image: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=2670&auto=format&fit=crop',
  }
];

const Portfolio: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
        <div>
          <h1 className="text-4xl lg:text-6xl font-bold luxury-text mb-4">معرض <span className="gold-text-gradient">الأعمال</span></h1>
          <p className="text-white/60 max-w-xl">استكشف بعض المشاريع التي قمنا بتنفيذها مؤخراً وساهمت في نجاح عملائنا.</p>
        </div>
        <div className="flex gap-4">
          <a 
            href="https://www.facebook.com/share/1DyPcQcdxg/" 
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm font-bold gold-text-gradient border border-gold/30 px-6 py-2 rounded-full hover:bg-gold/10 transition-all"
          >
            صفحة فيسبوك <Facebook size={16} />
          </a>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
        {['الكل', 'هوية بصرية', 'إعلانات ممولة', 'تصاميم سوشيال ميديا', 'فيديوهات'].map((cat, i) => (
          <button 
            key={cat}
            className={`shrink-0 px-6 py-2 rounded-full text-xs font-bold transition-all ${i === 0 ? 'bg-gold text-black' : 'border border-white/10 text-white/60 hover:border-gold/50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Portfolio Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {portfolioItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative rounded-[32px] overflow-hidden aspect-[4/5]"
          >
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <span className="text-gold text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <div className="w-4 h-px bg-gold" />
                {item.category}
              </span>
              <h3 className="text-xl font-bold text-white mb-6 leading-tight">
                {item.title}
              </h3>
              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-gold hover:text-black transition-all">
                  <IconImage size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-gold hover:text-black transition-all">
                  <Video size={18} />
                </button>
                <button className="flex-1 px-6 rounded-full bg-gold text-black text-xs font-bold flex items-center justify-center gap-2">
                  تفاصيل المشروع
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <p className="text-white/40 mb-6">هل أعجبتك أعمالنا؟ دعنا نصنع شيئاً رائعاً لعلامتك التجارية</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/request-service" 
            className="inline-flex py-4 px-10 rounded-full gold-gradient text-black font-bold transform hover:scale-110 transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)]"
          >
            ابدأ مشروعك الآن
          </Link>
          <a 
            href="https://www.facebook.com/share/1DyPcQcdxg/" 
            target="_blank"
            rel="noreferrer"
            className="inline-flex py-4 px-10 rounded-full border border-gold/30 gold-text-gradient font-bold transform hover:scale-110 transition-all"
          >
             صفحة الفيسبوك
            <Facebook className="mr-2" size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
