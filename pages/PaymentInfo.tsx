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
      details: 'يمكنك التحويل مباشرة عبر التطبيق إلى هذا الرقم. انقر على الزر لفتح التطبيق أو قم بنسخ الرقم.',
      icon: Smartphone,
      color: 'gold',
      action: {
        text: 'تحميل / إفتح D17',
        url: 'https://play.google.com/store/apps/details?id=tn.poste.d17'
      }
    },
    {
      title: 'البطاقة البريدية (E-DINAR)',
      number: '5359 4020 4169 0664',
      details: 'رقم البطاقة البريدية للتحويل المباشر أو إيداع الأموال عبر البريد.',
      icon: CreditCard,
      color: 'blue'
    }
  ];

  const getWhatsAppMessage = () => {
    const msg = `مرحباً، أود تأكيد الدفع لطلبي.\n\nالاسم: \nرقم/تفاصيل الطلب: \n\n*مرفق لقطة الشاشة/وصل الدفع*`;
    return encodeURIComponent(msg);
  };

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
                <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                  <div className="bg-black/40 border border-white/10 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
                    <div 
                      className="text-lg border-0 border-transparent sm:text-xl font-mono text-gold font-bold tracking-wider inline-flex gap-2" 
                      dir="ltr"
                      style={{ direction: 'ltr', unicodeBidi: 'bidi-override' }}
                    >
                      {method.number.split(' ').map((chunk, i) => (
                        <span key={i}>{chunk}</span>
                      ))}
                    </div>
                    <button 
                      onClick={() => copyToClipboard(method.number.replace(/\s/g, ''))}
                      className="text-white/20 hover:text-gold transition-colors p-2"
                      title="نسخ الرقم"
                    >
                      <Copy size={20} />
                    </button>
                  </div>
                  {method.action && (
                    <a
                      href={method.action.url}
                      className="bg-gold/10 hover:bg-gold/20 text-gold px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-colors text-sm sm:text-base text-center w-full sm:w-auto"
                    >
                      {method.action.text}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="glass p-8 rounded-[32px] border-gold/10 bg-gold/[0.02]">
          <div className="flex items-start gap-4 text-right">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gold mb-2 flex items-center gap-2 justify-end">
                <span>تنبيه هام جداً</span>
                <ShieldCheck size={20} />
              </h3>
              <p className="text-sm text-white/60 leading-relaxed mb-4">
                بعد إتمام عملية الدفع، <strong>يجب</strong> إرسال رسالة إلينا عبر الواتساب تحتوي على:
              </p>
              <ul className="list-disc list-inside text-sm text-white/50 mb-6 text-right" dir="rtl">
                <li>لقطة شاشة للتحويل أو صورة لوصل الدفع</li>
                <li>اسمك الكريم (اسم الحريف)</li>
                <li>تفاصيل طلبك</li>
              </ul>
              <div className="mt-6 flex justify-end">
                <a 
                  href={`https://wa.me/21692942482?text=${getWhatsAppMessage()}`} 
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
