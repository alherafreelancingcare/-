import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';
import {
  GraduationCap, Globe, Shield, BookOpen,
  CheckCircle2, Menu, X, LogOut, ArrowRight, User
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenAuth
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { currentUser, isAdmin, logout } = useAuth();
  const { settings } = useSite();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  const currentNotice = language === 'bn' ? settings.admissionsNoticeBn : settings.admissionsNoticeEn;
  const currentLoc = language === 'bn' ? settings.instituteLocationBn : settings.instituteLocationEn;

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

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Institute Name */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
                  Al Hera
                </span>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Care
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                {language === 'bn' ? 'আল হেরা ফ্রিল্যান্সিং কেয়ার' : 'Freelancing Institute BD'}
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
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
          <div className="hidden md:flex items-center gap-3">
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
                  <div className="text-left text-xs leading-tight hidden lg:block">
                    <p className="font-semibold text-slate-800 truncate max-w-[120px]">
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
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  {t('navLogin')}
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-lg shadow-xs shadow-blue-500/30 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span>{t('navRegister')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

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
                className="w-full py-2.5 text-center text-sm font-semibold text-slate-800 bg-slate-100 rounded-lg"
              >
                {t('navLogin')}
              </button>
              <button
                onClick={() => {
                  onOpenAuth('register');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm"
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
