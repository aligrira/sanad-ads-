import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, Wallet, Smartphone, ShieldCheck, ChevronRight, Copy } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';

const PaymentInfo: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم نسخ الرقم');
  };

  const paymentMethods = [
    {
      title: 'تطبيق D17 (البريد التونسي)',
      number: '29577989',
      details: 'يمكنك التحويل مباشرة عبر التطبيق إلى هذا الرقم.',
      icon: Smartphone,
      color: 'gold'
    },
    {
      title: 'البطاقة البريدية',
      number: '5359 4020 4169 0664',
      details: 'رقم البطاقة البريدية للتحويل المباشر أو عبر الصراف الآلي.',
      icon: CreditCard,
      color: 'blue'
    }
  ];

  return (
    <PageTransition>
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-3xl lg:text-5xl font-bold luxury-text mb-4">طرق <span className="gold-text-gradient">الدفع</span></h1>
          <p className="text-white/50 max-w-xl mx-auto">
            نوفر لك طرق دفع آمنة وسريعة لتأكيد طلباتك وبدء العمل على مشاريعك فوراً.
          </p>
        </div>

        <div className="grid gap-6 mb-12">
          {paymentMethods.map((method, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-8 rounded-[32px] border-white/5 flex flex-col md:flex-row items-center gap-8 group hover:border-gold/30 transition-all"
            >
              <div className={`w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-gold shrink-0`}>
                <method.icon size={40} />
              </div>
              
              <div className="flex-1 text-center md:text-right">
                <h3 className="text-xl font-bold mb-2">{method.title}</h3>
                <p className="text-sm text-white/40 mb-4">{method.details}</p>
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <div className="bg-black/40 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4">
                    <span className="text-xl font-mono text-gold font-bold">{method.number}</span>
                    <button 
                      onClick={() => copyToClipboard(method.number.replace(/\s/g, ''))}
                      className="text-white/20 hover:text-gold transition-colors"
                    >
                      <Copy size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="glass p-8 rounded-[32px] border-gold/10 bg-gold/[0.02]">
          <div className="flex items-start gap-4 text-right">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gold mb-2 flex items-center gap-2 justify-end">
                <span>تنبيه هام</span>
                <ShieldCheck size={20} />
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                بعد إتمام عملية الدفع، يرجى إرسال نسخة من "وصل الدفع" أو لقطة شاشة للتحويل عبر الواتساب لتأكيد طلبك وتغيير حالته إلى "جاري التنفيذ".
              </p>
              <div className="mt-6 flex justify-end">
                <a 
                  href="https://wa.me/21692942482" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all"
                >
                  إرسال الوصل عبر واتساب
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-white/20">
            * جميع المعاملات تتم تحت إشراف فريق وكالة سند الإعلانية.
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default PaymentInfo;
