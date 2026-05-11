import React from 'react';
import { motion } from 'motion/react';
import { Share2, Target, Brush, Video, Layout, BarChart, Smartphone, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: Share2,
    title: 'تطوير صفحات فيسبوك',
    desc: 'إنشاء وتنسيق صفحات فيسبوك احترافية تتناسب مع هوية مشروعك وتضمن أفضل تجربة للمتابعين.',
    features: ['تنسيق الغلاف واللوغو', 'إعداد الردود الآلية', 'تحسين محركات البحث للفيديو']
  },
  {
    icon: Target,
    title: 'إنشاء الإعلانات الممولة',
    desc: 'حملات إعلانية احترافية على فيسبوك وإنستجرام بجمهور مستهدف بدقة لزيادة المبيعات والانتشار.',
    features: ['استهداف دقيق للمهتمين', 'إدارة الميزانية بذكاء', 'تقارير دورية للأداء']
  },
  {
    icon: Brush,
    title: 'تصميم المنشورات الاحترافية',
    desc: 'تصاميم سوشيال ميديا جذابة وعصرية تخدم رسالتك التسويقية وتلفت انتباه جمهورك.',
    features: ['تصاميم مخصصة', 'تعديلات غير محدودة', 'ألوان تناسق الهوية']
  },
  {
    icon: Video,
    title: 'صناعة الفيديوهات الإشهارية',
    desc: 'إنتاج فيديوهات ترويجية (Motion Graphics, Reels) بطرق احترافية تحكي قصة مشروعك.',
    features: ['مونتاج سينمائي', 'تعليق صوتي محترف', 'مؤثرات بصرية']
  },
  {
    icon: Layout,
    title: 'تحسين الهوية البصرية',
    desc: 'بناء هوية بصرية كاملة تشمل الشعار، الألوان، والخطوط التي تميز علامتك عن المنافسين.',
    features: ['تصميم الشعار (Logo)', 'Business Card', 'دليل الهوية الكامل']
  },
  {
    icon: BarChart,
    title: 'إدارة الحملات الإعلانية',
    desc: 'إشراف كامل على استراتيجياتك التسويقية لضمان استمرارية النمو وتحقيق الأهداف.',
    features: ['تخطيط استراتيجي', 'تحليل المنافسين', 'تحسين معدل التحويل']
  }
];

const Services: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gold font-medium tracking-[0.2em] text-xs uppercase block mb-4"
        >
          خدماتنا المتكاملة
        </motion.span>
        <h1 className="text-4xl lg:text-6xl font-bold luxury-text mb-6">ماذا نقدم <span className="gold-text-gradient">لأعمالك</span>؟</h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          نحن نوفر لك كل ما تحتاجه للنجاح في الفضاء الرقمي، من التصميم إلى الوصول للعميل النهائي.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group glass p-8 rounded-[32px] border border-white/5 hover:border-gold/30 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl gold-gradient p-[1px] mb-6 transform group-hover:rotate-6 transition-transform">
              <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center text-gold">
                <service.icon size={28} />
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-4">{service.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              {service.desc}
            </p>
            
            <ul className="space-y-3 mb-8">
              {service.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-xs text-white/40">
                  <div className="w-1 h-1 rounded-full bg-gold" />
                  {f}
                </li>
              ))}
            </ul>
            
            <Link 
              to="/request-service" 
              state={{ service: service.title }}
              className="text-gold text-sm font-bold flex items-center gap-2 hover:gap-4 transition-all"
            >
              اطلب المشروع الآن
              <ArrowLeft size={16} />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Custom Service Call */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="mt-20 glass p-10 rounded-[40px] text-center"
      >
        <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center text-gold mx-auto mb-6">
          <MessageCircle size={32} />
        </div>
        <h3 className="text-2xl font-bold mb-4">هل لديك فكرة مشروع مخصص؟</h3>
        <p className="text-white/60 mb-8 max-w-xl mx-auto">
          نحن في سند للإعلان نؤمن بأن كل مشروع فريد من نوعه. تواصل معنا لمناقشة احتياجاتك الخاصة وسنقدم لك الحل الأمثل.
        </p>
        <a 
          href="https://wa.me/21692942482" 
          className="bg-[#25D366] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 mx-auto w-fit hover:scale-105 transition-transform"
        >
          تحدث معنا عبر واتساب
          <Smartphone size={20} />
        </a>
      </motion.div>
    </div>
  );
};

const ArrowLeft = ({ size }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

export default Services;
