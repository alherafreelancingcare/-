import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import { GraduationCap, MapPin, Phone, Mail, CheckCircle, ShieldCheck } from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
  onRefreshData?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  const { language, t } = useLanguage();
  const { settings } = useSite();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          {/* Col 1: Institute Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-lg text-white tracking-tight">
                  Al Hera Care
                </span>
                <p className="text-xs text-blue-400">
                  {language === 'bn' ? 'আল হেরা ফ্রিল্যান্সিং কেয়ার' : 'Freelancing Institute BD'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'bn'
                ? 'বাংলাদেশের শীর্ষস্থানীয় ফ্রিল্যান্সিং ক্যারিয়ার ট্রেইনিং ইনস্টিটিউট। বিশ্বমানের স্কিল ডেভেলপমেন্ট ও আন্তর্জাতিক মার্কেটপ্লেসে আত্মনির্ভরশীল ক্যারিয়ার গড়তে আমরা প্রতিশ্রুতিবদ্ধ।'
                : 'Premier freelancing career training institute in Bangladesh. Dedicated to imparting industry skills and empowering youths for global marketplaces.'}
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>
                {language === 'bn' ? 'রেজিস্টার্ড প্রতিষ্ঠান: TRAD/DNCC/019284' : 'Govt. Approved Trade Lic: TRAD/DNCC/019284'}
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              {language === 'bn' ? 'দ্রুত লিংক' : 'Quick Links'}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setCurrentView('courses')}
                  className="hover:text-blue-400 transition cursor-pointer"
                >
                  {t('navCourses')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('notices')}
                  className="hover:text-blue-400 transition cursor-pointer"
                >
                  {t('navNotices')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('verify')}
                  className="hover:text-blue-400 transition flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{t('navVerify')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('home')}
                  className="hover:text-blue-400 transition cursor-pointer"
                >
                  {language === 'bn' ? 'সাফল্যের গল্প ও রিভিউ' : 'Success Stories & Reviews'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Accepted Payment Methods */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              {language === 'bn' ? 'পেমেন্ট মাধ্যমসমূহ' : 'Payment Methods'}
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              {language === 'bn'
                ? 'বিকাশ, নগদ, রকেট ও ব্যাংক একাউন্টের মাধ্যমে সহজে ও নিরাপদে ফি পরিশোধ করুন।'
                : 'Secure fee clearance via bKash, Nagad, Rocket, and direct bank wire transfers.'}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 text-xs rounded bg-pink-950/80 text-pink-300 border border-pink-800 font-semibold">
                bKash বিকাশ
              </span>
              <span className="px-2.5 py-1 text-xs rounded bg-amber-950/80 text-amber-300 border border-amber-800 font-semibold">
                Nagad নগদ
              </span>
              <span className="px-2.5 py-1 text-xs rounded bg-purple-950/80 text-purple-300 border border-purple-800 font-semibold">
                Rocket রকেট
              </span>
              <span className="px-2.5 py-1 text-xs rounded bg-blue-950/80 text-blue-300 border border-blue-800 font-semibold">
                Bank Wire
              </span>
            </div>
          </div>

          {/* Col 4: Contact & Office */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              {language === 'bn' ? 'যোগাযোগ ও ক্যাম্পাস' : 'Contact & Campus'}
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  {language === 'bn' ? settings.instituteLocationBn : settings.instituteLocationEn}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>
                  {settings.hotline} {settings.whatsapp ? `/ ${settings.whatsapp} (WhatsApp)` : ''}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{settings.emailContact}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Al Hera Freelancing Care (আল হেরা ফ্রিল্যান্সিং কেয়ার). All rights reserved.</p>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Cloud Firestore Connected</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
