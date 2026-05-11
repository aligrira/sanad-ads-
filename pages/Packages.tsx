import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Check, CreditCard, Smartphone, ShieldCheck, Zap } from 'lucide-react';

const packages = [
  {
    id: 'video-bundle',
    name: 'باقة الفيديو والترويج',
    price: '200 DT',
    period: '5 أيام',
    desc: 'تصميم فيديو احترافي، نشره كستوري وريلز، مع ترويج ممول لمدة 5 أيام.',
    features: ['تصميم فيديو إشهاري', 'نشر ستوري و ريلز', 'ترويج ممول لـ 5 أيام', 'دعم فني متكامل'],
    color: 'from-gold-dark to-gold',
    popular: true
  },
  {
    id: 'daily-ads',
    name: 'الإشهار اليومي',
    price: '20 DT',
    period: 'يومياً',
    desc: 'إشهار احترافي لمنتجك بعمولة يومية بسيطة مع التحكم في المدة.',
    features: ['إشهار ممول لمنتج', 'تحديد عدد الأيام حسب رغبتك', 'استهداف دقيق للجمهور', 'تقارير يومية للنتائج'],
    color: 'from-gray-400 to-gray-600'
  },
  {
    id: 'diamond',
    name: 'الباقة الماسية القصوى',
    price: '750 DT',
    period: 'شهرياً',
    desc: 'حلول تسويقية متكاملة للانتشار الواسع والسيطرة على السوق.',
    features: ['إدارة جميع منصات التواصل', '15 منشوراً احترافياً', '3 فيديوهات إشهارية', 'حملات إعلانية واسعة النطاق', 'استراتيجية تسويق سنوية', 'أولوية في التنفيذ'],
    color: 'from-gold via-gold-light to-gold'
  }
];

const Packages: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl lg:text-6xl font-bold luxury-text mb-6">الباقات <span className="gold-text-gradient">والأسعار</span></h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          اختر الباقة التي تناسب تطلعاتك وابدأ رحلة النجاح معنا اليوم. أسعار تنافسية بجودة عالمية.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-20">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`relative glass rounded-[40px] p-8 border ${pkg.popular ? 'border-gold shadow-[0_0_30px_rgba(212,175,55,0.15)]' : 'border-white/5'}`}
          >
            {pkg.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-black text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                الأكثر طلباً
              </div>
            )}
            
            <div className={`text-sm font-bold bg-gradient-to-r ${pkg.color} bg-clip-text text-transparent mb-2`}>
              {pkg.name}
            </div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-4xl font-bold">{pkg.price}</span>
              <span className="text-white/30 text-xs font-bold">/ {pkg.period}</span>
            </div>
            <p className="text-white/50 text-xs mb-8 leading-relaxed h-8">{pkg.desc}</p>
            
            <div className="space-y-4 mb-10">
              {pkg.features.map(f => (
                <div key={f} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
                    <Check size={12} />
                  </div>
                  <span className="text-white/80">{f}</span>
                </div>
              ))}
            </div>
            
            <Link 
              to={`/request-service?package=${pkg.id}`}
              className={`block w-full py-4 text-center rounded-2xl font-bold transition-all ${pkg.popular ? 'bg-gold text-black hover:scale-105 shadow-lg shadow-gold/20' : 'bg-white/5 text-white hover:bg-white/10'}`}
            >
              اطلب {pkg.name}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Payment Info Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="glass p-10 rounded-[40px] border-gold/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <CreditCard size={120} />
        </div>
        
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <ShieldCheck className="text-gold" />
          طرق الدفع المتاحة
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold shrink-0">
              <Smartphone size={24} />
            </div>
            <div>
              <h3 className="font-bold mb-2">تطبيق بريدي D17</h3>
              <p className="text-white/60 text-sm mb-2">يمكنك الدفع بسهولة عبر رقم الهاتف:</p>
              <div className="text-xl font-mono text-gold font-bold">29577989</div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold shrink-0">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="font-bold mb-2">البطاقة البريدية</h3>
              <p className="text-white/60 text-sm mb-2">يمكنك أيضاً إيداع الأموال عبر البطاقة البريدية رقم:</p>
              <div className="text-xl font-mono text-gold font-bold tracking-wider">
                5359 4020 4169 0664
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/5 text-xs text-white/40 leading-relaxed">
          * نلتزم في سند للإعلان بالشفافية الكاملة. بعد إتمام عملية الدفع، يُرجى إرسال نسخة من الوصل عبر الواتساب لتأكيد طلبك وبدء العمل فوراً.
        </div>
      </motion.div>
    </div>
  );
};

export default Packages;
