import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Rocket, Brush, Video, Share2, Target, Users, Star, Smartphone, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ icon: Icon, title, desc, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="glass p-6 rounded-2xl hover:border-gold/50 transition-all group"
  >
    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-4 group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
  </motion.div>
);

const Home: React.FC = () => {
  return (
    <div className="flex flex-col gap-20 pb-32">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-navy rounded-full blur-[120px] -ml-48 -mb-48" />
        
        <div className="px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-gold" />
              <span className="text-gold font-medium tracking-widest text-xs uppercase">Sanad Ads Agency</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold luxury-text leading-[1.1] mb-6">
              نصنع لك <span className="gold-text-gradient italic">حضوراً</span> يُعبّر عن علامتك
            </h1>
            
            <p className="text-lg text-white/60 mb-8 max-w-lg leading-relaxed">
              سند للإعلان هي شريكك الإبداعي في بناء هويتك البصرية، إدارة حملاتك التسويقية، وصناعة محتوى رقمي استثنائي يضمن انتشارك.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/services" 
                className="bg-gold text-black px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-gold-dark transition-all transform hover:scale-105"
              >
                تصفح خدماتنا
                <ArrowLeft size={20} />
              </Link>
              <Link 
                to="/portfolio" 
                className="border border-white/20 hover:border-gold/50 px-8 py-4 rounded-full font-bold transition-all"
              >
                مشاهدة أعمالنا
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-12">
              <div>
                <div className="text-3xl font-bold text-gold">150+</div>
                <div className="text-xs text-white/50 uppercase tracking-wider">مشروع ناجح</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold">50+</div>
                <div className="text-xs text-white/50 uppercase tracking-wider">علامة تجارية</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold">100%</div>
                <div className="text-xs text-white/50 uppercase tracking-wider">رضا العملاء</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="aspect-square rounded-[40px] gold-gradient p-1">
              <div className="w-full h-full rounded-[38px] bg-black overflow-hidden relative group">
                <img 
                  src="https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=2670&auto=format&fit=crop" 
                  alt="Marketing" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-4 p-4 glass rounded-2xl">
                    <div className="w-12 h-12 rounded-full bg-gold overflow-hidden">
                      <img src="https://i.pravatar.cc/150?u=sanad" alt="Client" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">إعلاناتنا تصل للجمهور المستهدف بدقة</div>
                      <div className="text-xs text-gold">مبني على ذكاء إعلاني</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 luxury-text">خدماتنا الإبداعية</h2>
          <p className="text-white/50 max-w-2xl mx-auto">نقدم حلولاً متكاملة لتحويل علامتك التجارية إلى تجربة بصرية ورقمية فريدة</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard 
            icon={Target} 
            title="إدارة الحملات الإعلانية" 
            desc="نصمم ونقود حملاتك على فيسبوك وإنستجرام للوصول لأقصى عائد على الاستثمار." 
            delay={0.1}
          />
          <ServiceCard 
            icon={Brush} 
            title="تصميم الهوية البصرية" 
            desc="نبتكر شعارات وأدلة بصرية تعكس روح وقيمة مشروعك بشكل احترافي." 
            delay={0.2}
          />
          <ServiceCard 
            icon={Video} 
            title="صناعة الفيديوهات" 
            desc="إنتاج فيديوهات إشهارية عالية الجودة تجذب الانتباه وتعزز مبيعاتك." 
            delay={0.3}
          />
          <ServiceCard 
            icon={Share2} 
            title="تطوير صفحات فيسبوك" 
            desc="بناء وتنسيق صفحات التواصل الاجتماعي بأحدث المعايير التقنية والجمالية." 
            delay={0.4}
          />
          <ServiceCard 
            icon={Users} 
            title="إدارة المحتوى" 
            desc="صناعة منشورات مدروسة وتصاميم يومية تحافظ على تفاعل جمهورك." 
            delay={0.5}
          />
          <ServiceCard 
            icon={Rocket} 
            title="التسويق الرقمي الشامل" 
            desc="خطط استراتيجية لنمو مشروعك وتوسيع قاعدة عملائك بشكل مستمر." 
            delay={0.6}
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 bg-white/[0.02] -mx-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold luxury-text mb-4">ماذا يقول عملاؤنا</h2>
            <div className="flex justify-center gap-1 text-gold">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass p-8 rounded-3xl relative">
                <div className="text-4xl text-gold absolute -top-4 -right-2 opacity-20">"</div>
                <p className="text-white/70 italic mb-6 leading-relaxed">
                  "تعاملنا مع سند للإعلان كان نقطة تحول لمشروعنا. الاحترافية في التصميم ودقة الاستهداف في الحملات الإعلانية ساهمت في زيادة مبيعاتنا بشكل ملحوظ."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-navy border border-gold/30" />
                  <div>
                    <div className="font-bold text-sm">محمد أحمد</div>
                    <div className="text-[10px] text-gold uppercase">مدير شركة النور</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="px-6 text-center">
        <div className="gold-gradient p-[1px] rounded-[40px]">
          <div className="bg-black rounded-[39px] py-16 px-6">
            <h2 className="text-3xl lg:text-5xl font-bold luxury-text mb-6">هل أنت مستعد للتميز في عالمك الرقمي؟</h2>
            <p className="text-white/60 mb-10 max-w-xl mx-auto">انضم لعشرات الشركات التي وثقت بنا لتحويل طموحاتها الإعلانية إلى واقع ملموس.</p>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-3 bg-gold text-black px-10 py-5 rounded-full font-bold text-lg hover:scale-110 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              تواصل معنا الآن
              <Share2 size={24} />
            </Link>
          </div>
        </div>
      </section>

      {/* PWA Installation Section */}
      <section className="px-6 py-20 bg-gold/[0.03] border-y border-gold/10 -mx-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6 text-center md:text-right">
              <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                <Smartphone size={14} />
                تثبيت التطبيق
              </div>
              <h2 className="text-3xl font-bold luxury-text">استخدم "سند" كتطبيق على هاتفك</h2>
              <p className="text-white/60 leading-relaxed">
                لا حاجة لتحميل ملف APK! يمكنك تثبيت الموقع مباشرة على هاتفك ليعمل كأنه تطبيق (PWA). أسرع، أخفّ، ويصلك التحديثات فورياً.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">1</div>
                  <p className="text-sm">افتح الموقع من متصفح <b>Chrome</b> أو <b>Safari</b></p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">2</div>
                  <p className="text-sm">اضغط على <b>الخيارات</b> (النقاط الثلاث) أو زر <b>المشاركة</b></p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">3</div>
                  <p className="text-sm">اختر <b>"إضافة إلى الشاشة الرئيسية"</b> (Add to Home Screen)</p>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="w-64 h-[500px] bg-black border-8 border-white/10 rounded-[3rem] mx-auto shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-white/10 rounded-b-2xl z-10" />
                <div className="absolute inset-0 gold-gradient opacity-10" />
                <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 rounded-3xl gold-gradient flex items-center justify-center text-black text-4xl font-bold mb-6 shadow-lg shadow-gold/20">S</div>
                  <div className="w-32 h-2 bg-white/10 rounded-full mb-2" />
                  <div className="w-24 h-2 bg-white/5 rounded-full" />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
