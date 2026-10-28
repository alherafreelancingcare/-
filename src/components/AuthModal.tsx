import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { StorageService } from '../services/storage';
import { Course } from '../types';
import { X, Lock, Mail, User, Phone, CheckCircle2, Shield, AlertCircle, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  preSelectedCourseId?: string;
  onSuccessRedirect?: (view: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  preSelectedCourseId = '',
  onSuccessRedirect
}) => {
  const { loginWithEmail, loginWithGoogle, registerWithEmail, resetPassword, isAdmin } = useAuth();
  const { language, t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(preSelectedCourseId || 'course-digital-marketing');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  React.useEffect(() => {
    StorageService.getCourses().then(setCourses);
  }, []);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    const res = await loginWithEmail(email, password);
    setLoading(false);
    if (res.success) {
      onClose();
      if (onSuccessRedirect) {
        onSuccessRedirect(res.isAdmin ? 'admin' : 'dashboard');
      }
    } else {
      setErrorMsg(res.message || 'Login failed');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    const res = await loginWithGoogle();
    setLoading(false);
    if (res.success) {
      onClose();
      if (onSuccessRedirect) {
        onSuccessRedirect(res.isAdmin ? 'admin' : 'dashboard');
      }
    } else {
      setErrorMsg(res.message || 'Google sign-in failed');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    const res = await registerWithEmail({
      name,
      email,
      password,
      phone,
      courseId: selectedCourseId
    });
    setLoading(false);
    if (res.success) {
      setSuccessMsg(language === 'bn' 
        ? 'নিবন্ধন সফল হয়েছে! শিক্ষার্থী পোর্টালে আপনাকে স্বাগতম।' 
        : 'Registration successful! Welcome to the student portal.');
      setTimeout(() => {
        onClose();
        if (onSuccessRedirect) onSuccessRedirect('dashboard');
      }, 1200);
    } else {
      setErrorMsg(res.message || 'Registration failed');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    const res = await resetPassword(email);
    setLoading(false);
    if (res.success) {
      setSuccessMsg(res.message || 'Password reset link sent to your email.');
    } else {
      setErrorMsg(res.message || 'Password reset failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Titles */}
        <div className="mb-6">
          <div className="inline-block p-2 rounded-xl bg-blue-50 text-blue-600 mb-2">
            {mode === 'login' ? <Lock className="w-5 h-5" /> : mode === 'register' ? <User className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {mode === 'login' ? t('loginTitle') : mode === 'register' ? t('registerTitle') : t('resetPasswordTitle')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn' 
              ? 'ফায়ারবেস অথেন্টিকেশন সম্বলিত সুরক্ষিত প্ল্যাটফর্ম' 
              : 'Secure portal powered by Firebase Authentication'}
          </p>
        </div>

        {/* Google Sign-in button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 shadow-2xs flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{language === 'bn' ? 'গুগল দিয়ে সরাসরি প্রবেশ করুন' : 'Sign in with Google'}</span>
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-slate-400">
                {language === 'bn' ? 'অথবা ইমেইল দিয়ে' : 'or with email'}
              </span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('emailLabel')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="your-email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  {t('passwordLabel')}
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  {t('forgotPassword')}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {loading ? '...' : t('loginBtn')}
            </button>

            <div className="pt-2 text-center text-xs text-slate-500">
              <span>{language === 'bn' ? 'নতুন শিক্ষার্থী?' : "Don't have an account?"} </span>
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-bold text-blue-600 hover:text-blue-800"
              >
                {t('registerBtn')}
              </button>
            </div>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('nameLabel')}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder={language === 'bn' ? 'আপনার সম্পূর্ণ নাম' : 'Full Name'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('emailLabel')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('phoneLabel')}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('selectCourse')}
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {language === 'bn' ? c.titleBn : c.title} (৳{c.discountBDT || c.feeBDT})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('passwordLabel')} (At least 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {loading ? '...' : t('registerBtn')}
            </button>

            <div className="pt-2 text-center text-xs text-slate-500">
              <span>{language === 'bn' ? 'ইতিমধ্যে অ্যাকাউন্ট রয়েছে?' : 'Already have an account?'} </span>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-blue-600 hover:text-blue-800"
              >
                {t('loginBtn')}
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <p className="text-xs text-slate-600">
              {language === 'bn'
                ? 'আপনার রেজিস্টার্ড ইমেইল অ্যাড্রেস লিখুন। ফায়ারবেস থেকে পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠিয়ে দেওয়া হবে।'
                : 'Enter your registered email address to receive password reset instructions from Firebase.'}
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('emailLabel')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? '...' : t('sendResetLink')}
            </button>

            <div className="pt-2 text-center text-xs">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-slate-600 hover:text-slate-900"
              >
                ← {language === 'bn' ? 'লগইনে ফিরে যান' : 'Back to Login'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
