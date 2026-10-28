import React, { useState, useEffect } from 'react';
import { Course, Notice } from '../types';
import { StorageService } from '../services/storage';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import {
  GraduationCap, BookOpen, Clock, Users, Star, ArrowRight,
  CheckCircle2, Sparkles, TrendingUp, DollarSign, Calendar,
  ShieldCheck, HelpCircle, PhoneCall, Award, PlayCircle
} from 'lucide-react';

interface PublicHomeProps {
  onSelectCourse: (course: Course) => void;
  onOpenAuth: (mode?: 'login' | 'register', courseId?: string) => void;
  setCurrentView: (view: string) => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({
  onSelectCourse,
  onOpenAuth,
  setCurrentView
}) => {
  const { language, t } = useLanguage();
  const { settings } = useSite();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [courses, setCourses] = useState<Course[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    StorageService.getCourses().then(setCourses);
    StorageService.getNotices().then(setNotices);
  }, []);

  const filteredCourses = selectedCategory === 'all'
    ? courses
    : courses.filter(c => c.category === selectedCategory);

  const categories = [
    { id: 'all', label: language === 'bn' ? 'সব কোর্স' : 'All Courses' },
    { id: 'digital-marketing', label: language === 'bn' ? 'ডিজিটাল মার্কেটিং' : 'Digital Marketing' },
    { id: 'graphic-design', label: language === 'bn' ? 'গ্রাফিক ডিজাইন' : 'Graphic Design' },
    { id: 'excel-analytics', label: language === 'bn' ? 'মাইক্রোসফট এক্সেল' : 'Microsoft Excel' },
    { id: 'email-marketing', label: language === 'bn' ? 'ইমেইল মার্কেটিং' : 'Email Marketing' }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 text-white pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-800/60 border border-blue-600/40 text-blue-200 text-xs sm:text-sm font-medium backdrop-blur-xs shadow-xs animate-in fade-in duration-300">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{(language === 'bn' ? settings.heroBadgeBn : settings.heroBadgeEn) || t('heroBadge')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none">
              <span className="block text-white">Al Hera Freelancing Care</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 mt-2">
                {(language === 'bn' ? settings.heroTitleBn : settings.heroTitleEn) || t('heroTitle')}
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {(language === 'bn' ? settings.heroSubtitleBn : settings.heroSubtitleEn) || t('heroSubtitle')}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => {
                  const element = document.getElementById('courses-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/30 flex items-center gap-2 transition cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>{t('heroExploreBtn')}</span>
              </button>

              <button
                onClick={() => onOpenAuth('register')}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-sm rounded-xl border border-white/20 backdrop-blur-xs flex items-center gap-2 transition cursor-pointer"
              >
                <span>{t('heroEnrollBtn')}</span>
                <ArrowRight className="w-4 h-4 text-blue-400" />
              </button>

              <button
                onClick={() => setCurrentView('verify')}
                className="px-5 py-3.5 bg-slate-800/80 hover:bg-slate-800 active:scale-95 text-slate-200 font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 flex items-center gap-2 transition cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{t('navVerify')}</span>
              </button>
            </div>

            {settings.heroBannerUrl && (
              <div className="pt-6 max-w-4xl mx-auto">
                <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl group">
                  <img
                    src={settings.heroBannerUrl}
                    alt="Al Hera Freelancing Academy Campus & Students"
                    className="w-full h-48 sm:h-72 object-cover object-center group-hover:scale-102 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4 sm:p-6">
                    <p className="text-xs sm:text-sm font-medium text-slate-200">
                      {language === 'bn' ? 'আল হেরা ফ্রিল্যান্সিং কেয়ার — হাতে-কলমে প্রফেশনাল লার্নিং ক্যাম্পাস' : 'Al Hera Freelancing Care — Practical Professional Learning Campus'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Impact Stats Grid */}
          <div className="mt-14 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-5xl mx-auto">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-300">১২,৫০০+</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">{settings.statStudents || t('statStudents')}</p>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">৮৭%</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">{settings.statSuccessRate || t('statSuccessRate')}</p>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-300">৪৮+</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">{settings.statBatches || t('statBatches')}</p>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-sky-400">২৪/৭</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">{settings.statSupport || t('statSupport')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NOTICE TICKER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full uppercase tracking-wider shrink-0 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
              {language === 'bn' ? 'জরুরি নোটিশ' : 'Announcement'}
            </span>
            <div className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-1">
              {notices.length > 0 && (language === 'bn' ? notices[0].titleBn : notices[0].title)}
            </div>
          </div>

          <button
            onClick={() => setCurrentView('notices')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 shrink-0 ml-auto md:ml-0 cursor-pointer"
          >
            <span>{language === 'bn' ? 'সব নোটিশ ও রুটিন দেখুন' : 'View Routine & Notices'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 3. COURSES SECTION */}
      <section id="courses-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('coursesHeading')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {t('coursesSubheading')}
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              {/* Card Image Banner */}
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-blue-900/90 backdrop-blur-xs text-white text-[11px] font-bold rounded-lg shadow-sm">
                    {course.batchNumber}
                  </span>
                  {course.badge && (
                    <span className="px-2.5 py-1 bg-amber-500/95 text-white text-[11px] font-bold rounded-lg shadow-sm">
                      {course.badge}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white text-xs font-semibold rounded flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{course.rating}</span>
                  <span className="text-slate-300 text-[10px]">({course.enrolledCount})</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {language === 'bn' ? course.categoryLabelBn : course.categoryLabel}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {course.durationWeeks} {t('weeks')}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectCourse(course)}
                    className="text-lg font-bold text-slate-900 hover:text-blue-600 transition cursor-pointer leading-snug line-clamp-2"
                  >
                    {language === 'bn' ? course.titleBn : course.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {language === 'bn' ? course.subtitleBn : course.subtitle}
                  </p>
                </div>

                {/* Modules summary */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>
                    <strong>{course.modules?.length || 0}</strong> {language === 'bn' ? 'মডিউল' : 'Modules'} •{' '}
                    <strong>{course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0}</strong> {language === 'bn' ? 'লেকচার' : 'Lessons'}
                  </span>
                  <span className="text-emerald-700 font-semibold">
                    {course.nextBatchStart}
                  </span>
                </div>

                {/* Price and Action row */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <div>
                    <span className="text-[11px] text-slate-400 block">{t('courseFee')}</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-extrabold text-blue-700">
                        ৳{course.discountBDT ? course.discountBDT.toLocaleString() : course.feeBDT.toLocaleString()}
                      </span>
                      {course.discountBDT && (
                        <span className="text-xs text-slate-400 line-through">
                          ৳{course.feeBDT.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectCourse(course)}
                      className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                    >
                      {t('viewDetails')}
                    </button>
                    <button
                      onClick={() => onOpenAuth('register', course.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{t('enrollNow')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SUCCESS STORIES / CAREER TRACK */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              {language === 'bn' ? 'শিক্ষার্থীদের অর্জন ও মার্কেটপ্লেস আর্নিং' : 'Student Earnings & Marketplace Success'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {language === 'bn' ? 'আল হেরা কেয়ার থেকে সফল ফ্রিল্যান্সারদের গল্প' : 'Real Stories from Al Hera Graduates'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {language === 'bn'
                ? 'আমাদের মেন্টরদের সার্বক্ষণিক গাইডলাইনে শিক্ষার্থীরা বিশ্বখ্যাত মার্কেটপ্লেসে নিয়মিত কাজ করছেন।'
                : 'Empowering students to secure global contracts on Upwork, Fiverr, and remote companies.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80"
                    alt="Tanvir"
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">তানভীর আহমেদ (Tanvir)</h3>
                    <p className="text-xs text-slate-500">ব্যাচ ২৪ • ডিজিটাল মার্কেটিং ও এসইও</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "আল হেরা কেয়ারের প্র্যাক্টিক্যাল প্রজেক্ট ট্রেনিং ও বিডিং সেশন আমাকে ফাইবারে প্রথম অর্ডার এনে দেয়। এখন আমি ক্লায়েন্টদের গুগল ও ফেসবুক বিজ্ঞাপন ক্যাম্পেইন পরিচালনা করছি।"
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Fiverr Level 2 Seller</span>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-lg">
                  $1,450+ উপার্জিত
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"
                    alt="Nusrat"
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">নুসরাত জাহান (Nusrat)</h3>
                    <p className="text-xs text-slate-500">ব্যাচ ১৫ • গ্রাফিক ডিজাইন</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "ডিজাইন সেন্স এবং ক্লায়েন্ট হ্যান্ডলিং শেখার জন্য আল হেরা কেয়ার সেরা। আপওয়ার্কে আমার প্রথম প্রজেক্ট ছিল $300 ডলারের ব্র্যান্ড আইডেন্টিটি প্যাকেজ।"
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Upwork Rising Talent</span>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-lg">
                  $850+ উপার্জিত
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                    alt="Shakil"
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">শাকিল খান (Shakil)</h3>
                    <p className="text-xs text-slate-500">ব্যাচ ১২ • এক্সেল ও ডেটা অ্যানালাইসিস</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "এক্সেল ফর্মুলা ও ড্যাশবোর্ড তৈরির টেকনিকগুলো অসাধারণ ছিল। কোর্স শেষ হওয়ার পর আমেরিকান একটি রিমোট কোম্পানিতে মান্থলি ডেটা অ্যানালিস্ট চুক্তি পেয়েছি।"
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Remote Data Analyst</span>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-lg">
                  $600/মাস
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'bn' ? 'আপনার সফল ফ্রিল্যান্সিং যাত্রা শুরু করুন আজই' : 'Ready to Start Your Freelancing Journey?'}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              {language === 'bn'
                ? 'সীমিত আসনে নতুন ব্যাচে ভর্তি চলছে। লাইভ ক্যারিয়ার কাউন্সেলিং এর জন্য সরাসরি কল করুন অথবা অনলাইনে ফরম পূরণ করুন।'
                : 'Seats are strictly limited for the upcoming batch. Contact our advisors or enroll online today.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenAuth('register')}
              className="px-6 py-3 bg-white text-blue-900 hover:bg-blue-50 active:scale-95 font-bold text-sm rounded-xl shadow-lg transition cursor-pointer"
            >
              {t('heroEnrollBtn')}
            </button>
            <a
              href="tel:+8801712345678"
              className="px-5 py-3 bg-blue-900/60 hover:bg-blue-900 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl border border-blue-400/30 flex items-center gap-2 transition"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>{t('hotline')}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
