import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';
import { Course, Notice } from '../types';
import { StorageService } from '../services/storage';
import {
  GraduationCap, Globe, Shield, BookOpen,
  CheckCircle2, Menu, X, LogOut, ArrowRight, User,
  Search, Bell, Sparkles, ChevronRight, CornerDownLeft
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onSelectCourse?: (course: Course) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenAuth,
  onSelectCourse
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { currentUser, isAdmin, logout } = useAuth();
  const { settings } = useSite();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    StorageService.getCourses().then(setCourses).catch(() => {});
    StorageService.getNotices().then(setNotices).catch(() => {});
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global keyboard shortcut: Ctrl+K or / to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setMobileSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setIsSearchOpen(false);
    setMobileSearchOpen(false);
  };

  const currentNotice = language === 'bn' ? settings.admissionsNoticeBn : settings.admissionsNoticeEn;
  const currentLoc = language === 'bn' ? settings.instituteLocationBn : settings.instituteLocationEn;

  // Filter courses & notices
  const trimmed = searchQuery.trim().toLowerCase();

  const matchingCourses = trimmed.length > 0
    ? courses.filter(c => {
        const titleBnMatch = (c.titleBn || '').toLowerCase().includes(trimmed);
        const titleEnMatch = (c.title || '').toLowerCase().includes(trimmed);
        const descBnMatch = (c.descriptionBn || '').toLowerCase().includes(trimmed);
        const descEnMatch = (c.description || '').toLowerCase().includes(trimmed);
        const categoryMatch = (c.category || '').toLowerCase().includes(trimmed) || (c.categoryLabel || '').toLowerCase().includes(trimmed) || (c.categoryLabelBn || '').toLowerCase().includes(trimmed);
        const featureMatch = c.features?.some(f => f.toLowerCase().includes(trimmed)) || c.featuresBn?.some(f => f.toLowerCase().includes(trimmed));
        return titleBnMatch || titleEnMatch || descBnMatch || descEnMatch || categoryMatch || Boolean(featureMatch);
      })
    : [];

  const matchingNotices = trimmed.length > 0
    ? notices.filter(n => {
        const titleBnMatch = (n.titleBn || '').toLowerCase().includes(trimmed);
        const titleEnMatch = (n.title || '').toLowerCase().includes(trimmed);
        const contentBnMatch = (n.contentBn || '').toLowerCase().includes(trimmed);
        const contentEnMatch = (n.content || '').toLowerCase().includes(trimmed);
        const catMatch = (n.category || '').toLowerCase().includes(trimmed);
        return titleBnMatch || titleEnMatch || contentBnMatch || contentEnMatch || catMatch;
      })
    : [];

  const handleSelectCourse = (course: Course) => {
    if (onSelectCourse) {
      onSelectCourse(course);
    }
    handleNavClick('courses');
    setSearchQuery('');
    setIsSearchOpen(false);
    setMobileSearchOpen(false);
  };

  const handleSelectNotice = (_notice: Notice) => {
    handleNavClick('notices');
    setSearchQuery('');
    setIsSearchOpen(false);
    setMobileSearchOpen(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (matchingCourses.length > 0) {
        handleSelectCourse(matchingCourses[0]);
      } else if (matchingNotices.length > 0) {
        handleSelectNotice(matchingNotices[0]);
      } else if (trimmed.length > 0) {
        handleNavClick('courses');
      }
    }
  };

  const popularSuggestions = [
    { label: language === 'bn' ? 'ডিজিটাল মার্কেটিং' : 'Digital Marketing', query: 'marketing' },
    { label: language === 'bn' ? 'গ্রাফিক ডিজাইন' : 'Graphic Design', query: 'graphic' },
    { label: language === 'bn' ? 'মাইক্রোসফট এক্সেল' : 'Microsoft Excel', query: 'excel' },
    { label: language === 'bn' ? 'ইমেইল মার্কেটিং' : 'Email Marketing', query: 'email' },
    { label: language === 'bn' ? 'ভর্তি নোটিশ' : 'Admission Notice', query: 'ভর্তি' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Bar with hotline and language */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-8 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium">{currentNotice || (language === 'bn' ? 'ভর্তি চলছে: নতুন ব্যাচ ২০২৫' : 'Admissions Open: New Batch 2025')}</span>
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300">
            📞 {settings.hotline || t('hotline')}
          </span>
          <span className="hidden lg:inline text-slate-400">|</span>
          <span className="hidden lg:inline text-slate-300">
            📍 {currentLoc || t('instituteLocation')}
          </span>
        </div>

        {/* Right Header items */}
        <div className="flex items-center gap-3 ml-auto">
          {currentUser && isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className="bg-indigo-900/90 hover:bg-indigo-800 text-indigo-200 border border-indigo-700 px-2.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition"
              title="Open Admin Dashboard"
            >
              <Shield className="w-3 h-3 text-indigo-400" />
              <span>{language === 'bn' ? 'অ্যাডমিন এক্সেস সক্রিয়' : 'Admin Access Active'}</span>
            </button>
          )}

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded text-xs transition border border-slate-700 cursor-pointer"
            aria-label="Toggle Language"
          >
            <Globe className="w-3 h-3 text-blue-400" />
            <span className="font-semibold">{language === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation & Search Bar Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo & Institute Name */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 sm:w-6.5 sm:h-6.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
                  Al Hera
                </span>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider">
                  Care
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5 truncate max-w-[130px] sm:max-w-none">
                {language === 'bn' ? 'আল হেরা ফ্রিল্যান্সিং কেয়ার' : 'Freelancing Institute BD'}
              </p>
            </div>
          </div>

          {/* QUICK SEARCH BAR (Tablet & Desktop Header) */}
          <div
            ref={searchContainerRef}
            className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg hidden sm:block mx-1 md:mx-3"
          >
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder={language === 'bn' ? 'কোর্স বা নোটিশ খুঁজুন...' : 'Search courses or notices...'}
                className="w-full pl-9 pr-16 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-hidden transition shadow-xs"
              />

              <div className="absolute right-2.5 flex items-center gap-1">
                {searchQuery ? (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-200/60 rounded border border-slate-300 select-none">
                    ⌘K
                  </kbd>
                )}
              </div>
            </div>

            {/* QUICK SEARCH DROPDOWN RESULTS */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150 max-h-[460px] flex flex-col">
                {/* When Search Query is Empty: Show quick suggestions & popular shortcuts */}
                {trimmed.length === 0 ? (
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        {language === 'bn' ? 'জনপ্রিয় সার্চ সাজেশন' : 'Popular Searches'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {popularSuggestions.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSearchQuery(item.query);
                            searchInputRef.current?.focus();
                          }}
                          className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-lg transition border border-slate-200 cursor-pointer"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {/* Quick overview of latest courses */}
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
                        {language === 'bn' ? 'চলতি ব্যাচের জনপ্রিয় কোর্সসমূহ' : 'Popular Active Courses'}
                      </p>
                      <div className="space-y-1">
                        {courses.slice(0, 3).map((c) => (
                          <div
                            key={c.id}
                            onClick={() => handleSelectCourse(c)}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                                <BookOpen className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600 transition">
                                {language === 'bn' ? c.titleBn : c.title}
                              </span>
                            </div>
                            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md shrink-0">
                              ৳{(c.discountBDT || c.feeBDT).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* When Query is Present: Show matching courses & notices */
                  <div className="overflow-y-auto divide-y divide-slate-100">
                    {/* Courses Match List */}
                    {matchingCourses.length > 0 && (
                      <div className="p-3">
                        <div className="flex items-center justify-between px-2 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                            {language === 'bn' ? `কোর্স (${matchingCourses.length})` : `Courses (${matchingCourses.length})`}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {matchingCourses.map((c) => (
                            <div
                              key={c.id}
                              onClick={() => handleSelectCourse(c)}
                              className="p-2.5 rounded-xl hover:bg-blue-50/80 transition cursor-pointer flex items-center justify-between gap-3 group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={c.thumbnail}
                                  alt={c.title}
                                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 transition truncate">
                                    {language === 'bn' ? c.titleBn : c.title}
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 flex-wrap">
                                    <span className="bg-slate-100 px-1.5 py-0.2 rounded text-[10px] font-medium text-slate-600">
                                      {language === 'bn' ? c.categoryLabelBn : c.categoryLabel}
                                    </span>
                                    <span>•</span>
                                    <span>{c.durationWeeks} {language === 'bn' ? 'সপ্তাহ' : 'weeks'}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-xs font-black text-blue-700">
                                  ৳{(c.discountBDT || c.feeBDT).toLocaleString()}
                                </p>
                                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                                  {language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notices Match List */}
                    {matchingNotices.length > 0 && (
                      <div className="p-3">
                        <div className="flex items-center justify-between px-2 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">
                            <Bell className="w-3.5 h-3.5 text-amber-600" />
                            {language === 'bn' ? `নোটিশ (${matchingNotices.length})` : `Notices (${matchingNotices.length})`}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {matchingNotices.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => handleSelectNotice(n)}
                              className="p-2.5 rounded-xl hover:bg-amber-50/80 transition cursor-pointer flex items-center justify-between gap-3 group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                                  <Bell className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-amber-800 transition truncate">
                                    {language === 'bn' ? n.titleBn : n.title}
                                  </p>
                                  <p className="text-[10px] text-slate-400 mt-0.5">
                                    📅 {n.date}
                                  </p>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Zero Results State */}
                    {matchingCourses.length === 0 && matchingNotices.length === 0 && (
                      <div className="p-6 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                          <Search className="w-5 h-5" />
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-slate-700">
                          {language === 'bn'
                            ? `“${searchQuery}” দিয়ে কোনো কোর্স বা নোটিশ পাওয়া যায়নি`
                            : `No courses or notices found matching "${searchQuery}"`}
                        </p>
                        <p className="text-xs text-slate-400">
                          {language === 'bn'
                            ? 'সঠিক বানান লিখুন অথবা ‘মার্কেটিং’, ‘ডিজাইন’ বা ‘এক্সেল’ দিয়ে সার্চ করুন'
                            : 'Check your spelling or try searching for "marketing", "design", or "excel"'}
                        </p>
                        <div className="pt-2 flex justify-center gap-2">
                          <button
                            onClick={() => handleNavClick('courses')}
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            {language === 'bn' ? 'সব কোর্স ব্রাউজ করুন' : 'Browse All Courses'}
                          </button>
                          <button
                            onClick={() => handleNavClick('notices')}
                            className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            {language === 'bn' ? 'নোটিশ বোর্ড দেখুন' : 'View Notice Board'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer hint */}
                <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <CornerDownLeft className="w-3 h-3 text-slate-400" />
                    {language === 'bn' ? 'Enter চাপুন নির্বাচন করতে' : 'Press Enter to select'}
                  </span>
                  <span>{language === 'bn' ? 'Esc চাপলে বন্ধ হবে' : 'Esc to close'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                currentView === 'home'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('navHome')}
            </button>

            <button
              onClick={() => handleNavClick('courses')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                currentView === 'courses'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('navCourses')}
            </button>

            <button
              onClick={() => handleNavClick('notices')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                currentView === 'notices'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('navNotices')}
            </button>

            <button
              onClick={() => handleNavClick('verify')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'verify'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t('navVerify')}</span>
            </button>

            {currentUser && (
              <>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 cursor-pointer ${
                    currentView === 'dashboard'
                      ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>{t('navDashboard')}</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className={`px-3.5 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 cursor-pointer shadow-xs ${
                      currentView === 'admin'
                        ? 'bg-indigo-700 text-white ring-2 ring-indigo-400/50'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-indigo-200" />
                    <span>{t('navAdminPanel')}</span>
                    <span className="bg-indigo-900/80 text-indigo-200 text-[10px] uppercase font-black px-1.5 py-0.5 rounded">
                      Admin
                    </span>
                  </button>
                )}
              </>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2 md:gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div
                  onClick={() => handleNavClick(isAdmin ? 'admin' : 'dashboard')}
                  className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition"
                  title="Go to Dashboard"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-300"
                  />
                  <div className="text-left text-xs leading-tight hidden xl:block">
                    <p className="font-semibold text-slate-800 truncate max-w-[110px]">
                      {currentUser.name}
                    </p>
                    <span className={`inline-block text-[10px] px-1 rounded ${
                      isAdmin ? 'bg-indigo-100 text-indigo-700 font-bold' : 'bg-blue-100 text-blue-700 font-semibold'
                    }`}>
                      {isAdmin ? 'ADMIN' : 'STUDENT'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title={t('navLogout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  {t('navLogin')}
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-lg shadow-xs shadow-blue-500/30 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span>{t('navRegister')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Right Controls: Search button & Hamburger */}
          <div className="flex sm:hidden items-center gap-1">
            <button
              onClick={() => {
                setMobileSearchOpen(!mobileSearchOpen);
                if (!mobileSearchOpen) {
                  setTimeout(() => mobileSearchInputRef.current?.focus(), 100);
                }
              }}
              className={`p-2 rounded-lg transition ${
                mobileSearchOpen ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE EXPANDABLE QUICK SEARCH BAR */}
      {mobileSearchOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 py-3 shadow-md animate-in slide-in-from-top-1 duration-150">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              ref={mobileSearchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder={language === 'bn' ? 'কোর্স বা নোটিশ খুঁজুন...' : 'Search courses or notices...'}
              className="w-full pl-9 pr-10 py-2.5 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile search quick results */}
          {trimmed.length > 0 && (
            <div className="mt-3 max-h-72 overflow-y-auto space-y-2 border-t border-slate-100 pt-2">
              {matchingCourses.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSelectCourse(c)}
                  className="p-2 bg-slate-50 hover:bg-blue-50 rounded-xl flex items-center justify-between gap-2 cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={c.thumbnail} alt="" className="w-8 h-8 rounded-md object-cover" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {language === 'bn' ? c.titleBn : c.title}
                      </p>
                      <p className="text-[10px] text-slate-500">{c.category}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-700 shrink-0">
                    ৳{(c.discountBDT || c.feeBDT).toLocaleString()}
                  </span>
                </div>
              ))}

              {matchingNotices.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleSelectNotice(n)}
                  className="p-2 bg-slate-50 hover:bg-amber-50 rounded-xl flex items-center justify-between gap-2 cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Bell className="w-4 h-4 text-amber-600 shrink-0" />
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {language === 'bn' ? n.titleBn : n.title}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{n.date}</span>
                </div>
              ))}

              {matchingCourses.length === 0 && matchingNotices.length === 0 && (
                <p className="text-center py-4 text-xs text-slate-500">
                  {language === 'bn' ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No results found'}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-lg space-y-2">
          {currentUser && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-3 border border-slate-200">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-800 truncate">{currentUser.name}</p>
                <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                <span className={`inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  isAdmin ? 'bg-indigo-100 text-indigo-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {isAdmin ? 'ADMIN' : 'STUDENT'}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentView === 'home' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'
            }`}
          >
            {t('navHome')}
          </button>
          <button
            onClick={() => handleNavClick('courses')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentView === 'courses' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'
            }`}
          >
            {t('navCourses')}
          </button>
          <button
            onClick={() => handleNavClick('notices')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentView === 'notices' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'
            }`}
          >
            {t('navNotices')}
          </button>
          <button
            onClick={() => handleNavClick('verify')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
              currentView === 'verify' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{t('navVerify')}</span>
          </button>

          {currentUser ? (
            <>
              {isAdmin && (
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold flex items-center justify-between shadow-xs ${
                    currentView === 'admin' ? 'bg-indigo-700 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-200" />
                    <span>{t('navAdminPanel')}</span>
                  </span>
                  <span className="text-[10px] bg-indigo-900/90 text-indigo-200 font-extrabold px-1.5 py-0.5 rounded">
                    Admin
                  </span>
                </button>
              )}
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                  currentView === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{t('navDashboard')}</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('navLogout')}</span>
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenAuth('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-sm font-semibold text-slate-800 bg-slate-100 rounded-lg cursor-pointer"
              >
                {t('navLogin')}
              </button>
              <button
                onClick={() => {
                  onOpenAuth('register');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm cursor-pointer"
              >
                {t('navRegister')}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
