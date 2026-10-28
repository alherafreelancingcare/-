import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import { StorageService } from '../services/storage';
import {
  User, Course, Exam, ExamQuestion, FeeRecord,
  Certificate, Notice, ExamSubmission, SiteSettings, CourseModule, Lesson
} from '../types';
import { CertificateView } from './CertificateView';
import {
  Shield, Users, BookOpen, FileText, CreditCard, Award,
  Bell, CheckCircle2, Plus, Search, Check, Trash2, KeyRound, Lock,
  Globe, Phone, Mail, MapPin, Sparkles, Image, ExternalLink, Edit2,
  AlertCircle, LogOut, ArrowRight, X, Clock, HelpCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { currentUser, isAdmin, loading, loginWithEmail, loginWithGoogle, logout } = useAuth();
  const { language, t } = useLanguage();
  const { settings, updateSettings } = useSite();

  // Active Tab: 6 core requirements + overview
  const [activeTab, setActiveTab] = useState<
    'overview' | 'homepage' | 'courses' | 'students' | 'notices' | 'exams' | 'contact'
  >('overview');

  // Direct login form state for visitors at /admin
  const [adminLoginEmail, setAdminLoginEmail] = useState('');
  const [adminLoginPassword, setAdminLoginPassword] = useState('');
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);

  // Firestore Data Collections
  const [students, setStudents] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);

  // Modals & form state
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [selectedCourseForLesson, setSelectedCourseForLesson] = useState<Course | null>(null);

  const [editingStudent, setEditingStudent] = useState<User | null>(null);
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [showIssueCertModal, setShowIssueCertModal] = useState(false);
  const [showAddNoticeModal, setShowAddNoticeModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  // Search & Filter
  const [studentSearch, setStudentSearch] = useState('');
  const [feeStatusFilter, setFeeStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [viewingCertificate, setViewingCertificate] = useState<Certificate | null>(null);

  // 1. Homepage & Banner Settings Form State
  const [homeSettingsForm, setHomeSettingsForm] = useState<SiteSettings>(settings);

  // 6. Contact Settings Form State
  const [contactSettingsForm, setContactSettingsForm] = useState<SiteSettings>(settings);

  // Sync settings when siteContext updates
  useEffect(() => {
    setHomeSettingsForm(settings);
    setContactSettingsForm(settings);
  }, [settings]);

  // Load all institute data
  const loadAllData = async () => {
    const allStudents = await StorageService.getAllStudents();
    setStudents(allStudents);
    const allCourses = await StorageService.getCourses();
    setCourses(allCourses);
    const allExams = await StorageService.getExams();
    setExams(allExams);
    const allFees = await StorageService.getFees();
    setFees(allFees);
    const allCerts = await StorageService.getCertificates();
    setCertificates(allCerts);
    const allNotices = await StorageService.getNotices();
    setNotices(allNotices);
    const allSubs = await StorageService.getAllSubmissions();
    setSubmissions(allSubs);
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllData();
    }
  }, [isAdmin]);

  const showFeedback = (msg: string) => {
    setActionNotice(msg);
    loadAllData();
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Direct Admin Login Handler (for visitors directly at /admin)
  const handleDirectAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginError(null);
    setAdminLoginLoading(true);
    const res = await loginWithEmail(adminLoginEmail, adminLoginPassword);
    setAdminLoginLoading(false);
    if (!res.success) {
      setAdminLoginError(res.message || 'Login failed. Please check credentials.');
    } else if (!res.isAdmin) {
      setAdminLoginError('এই অ্যাকাউন্টটি অনুমোদিত অ্যাডমিন হিসেবে নিবন্ধিত নয়। শুধুমাত্র nisadandnisanfoodltd@gmail.com অ্যাডমিন প্যানেলে প্রবেশ করতে পারেন।');
    }
  };

  const handleDirectGoogleLogin = async () => {
    setAdminLoginError(null);
    setAdminLoginLoading(true);
    const res = await loginWithGoogle();
    setAdminLoginLoading(false);
    if (!res.success) {
      setAdminLoginError(res.message || 'Google login failed.');
    } else if (!res.isAdmin) {
      setAdminLoginError('এই গুগল অ্যাকাউন্টটি অনুমোদিত অ্যাডমিন হিসেবে নিবন্ধিত নয়।');
    }
  };

  // 1. SAVE HOMEPAGE SETTINGS HANDLER
  const handleSaveHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(homeSettingsForm);
    showFeedback(language === 'bn' ? 'হোমপেজের লেখা ও ব্যানার সফলভাবে সংরক্ষিত হয়েছে!' : 'Homepage content & banner updated successfully!');
  };

  // 6. SAVE CONTACT SETTINGS HANDLER
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(contactSettingsForm);
    showFeedback(language === 'bn' ? 'যোগাযোগের তথ্য সফলভাবে সংরক্ষিত হয়েছে!' : 'Contact information updated successfully!');
  };

  // 2. COURSES HANDLERS
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    await StorageService.saveCourse(editingCourse);
    setEditingCourse(null);
    showFeedback(language === 'bn' ? 'কোর্সের তথ্য সফলভাবে আপডেট হয়েছে!' : 'Course updated successfully!');
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm(language === 'bn' ? 'আপনি কি নিশ্চিতভাবে এই কোর্সটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this course?')) {
      await StorageService.deleteCourse(courseId);
      showFeedback(language === 'bn' ? 'কোর্সটি সফলভাবে মুছে ফেলা হয়েছে।' : 'Course deleted.');
    }
  };

  // 3. STUDENTS HANDLERS
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    await StorageService.saveUserProfile(editingStudent);
    setEditingStudent(null);
    showFeedback(language === 'bn' ? 'শিক্ষার্থীর তথ্য সফলভাবে সংরক্ষিত হয়েছে!' : 'Student profile updated!');
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (window.confirm(language === 'bn' ? 'আপনি কি নিশ্চিতভাবে এই শিক্ষার্থীর একাউন্টটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this student account?')) {
      await StorageService.deleteStudent(studentId);
      showFeedback(language === 'bn' ? 'শিক্ষার্থী একাউন্ট মুছে ফেলা হয়েছে।' : 'Student deleted.');
    }
  };

  const handleVerifyFee = async (feeId: string, approve: boolean) => {
    if (!currentUser) return;
    await StorageService.verifyPayment(
      feeId,
      currentUser.email,
      approve,
      undefined,
      approve ? 'Payment verified via bKash/Nagad merchant verification.' : 'Transaction ref not found in statement.'
    );
    showFeedback(approve ? 'পেমেন্ট সফলভাবে অনুমোদিত হয়েছে!' : 'পেমেন্ট বাতিল করা হয়েছে।');
  };

  // 4. NOTICES HANDLERS
  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice) return;
    await StorageService.saveNotice(editingNotice);
    setEditingNotice(null);
    showFeedback(language === 'bn' ? 'নোটিশ ও রুটিন সফলভাবে আপডেট হয়েছে!' : 'Notice/Routine updated!');
  };

  const handleDeleteNotice = async (noticeId: string) => {
    if (window.confirm(language === 'bn' ? 'আপনি কি এই নোটিশটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this notice?')) {
      await StorageService.deleteNotice(noticeId);
      showFeedback(language === 'bn' ? 'নোটিশটি মুছে ফেলা হয়েছে।' : 'Notice deleted.');
    }
  };

  // 5. CERTIFICATE HANDLERS
  const handleDeleteCert = async (certId: string) => {
    if (window.confirm(language === 'bn' ? 'আপনি কি এই সার্টিফিকেটটি বাতিল বা মুছে ফেলতে চান?' : 'Are you sure you want to revoke this certificate?')) {
      await StorageService.deleteCertificate(certId);
      showFeedback(language === 'bn' ? 'সার্টিফিকেট বাতিল করা হয়েছে।' : 'Certificate revoked.');
    }
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-600 text-sm font-semibold">
          {language === 'bn' ? 'অ্যাডমিন অনুমতি যাচাই করা হচ্ছে...' : 'Verifying administrator access...'}
        </p>
      </div>
    );
  }

  // CASE 1: Visitor at /admin is NOT logged in -> Dedicated Admin Login Portal
  if (!currentUser) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-100">
        <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-700 to-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20 mb-3">
              <Shield className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {language === 'bn' ? 'অ্যাডমিন পোর্টাল লগইন' : 'Admin Portal Login'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'bn' ? 'আল হেরা ফ্রিল্যান্সিং কেয়ার — সুরক্ষিত প্রশাসন প্যানেল' : 'Al Hera Freelancing Care — Secure Admin Panel'}
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'অনুমোদিত অ্যাডমিন: nisadandnisanfoodltd@gmail.com' : 'Authorized Admin: nisadandnisanfoodltd@gmail.com'}</span>
            </div>
          </div>

          {adminLoginError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{adminLoginError}</span>
            </div>
          )}

          <form onSubmit={handleDirectAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {language === 'bn' ? 'অ্যাডমিন ইমেইল' : 'Admin Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={adminLoginEmail}
                  onChange={(e) => setAdminLoginEmail(e.target.value)}
                  placeholder="nisadandnisanfoodltd@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={adminLoginPassword}
                  onChange={(e) => setAdminLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={adminLoginLoading}
              className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-xl shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
            >
              {adminLoginLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>{language === 'bn' ? 'অ্যাডমিন হিসেবে প্রবেশ করুন' : 'Enter Admin Panel'}</span>
                </>
              )}
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="grow border-t border-slate-200"></div>
            <span className="shrink mx-3 text-slate-400 text-xs uppercase font-medium">বা</span>
            <div className="grow border-t border-slate-200"></div>
          </div>

          <button
            onClick={handleDirectGoogleLogin}
            disabled={adminLoginLoading}
            className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.665-5.17 3.665-9.09z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.1C3.27 21.46 7.37 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.1z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.27 2.54 1.25 6.58l4.03 3.1c.95-2.83 3.6-4.93 6.72-4.93z"/>
            </svg>
            <span>{language === 'bn' ? 'Google একাউন্ট দিয়ে অ্যাডমিন লগইন' : 'Sign in with Google Admin'}</span>
          </button>
        </div>
      </div>
    );
  }

  // CASE 2: User is logged in as a normal STUDENT (not an authorized admin)
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-rose-200 shadow-xl text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200 shadow-inner">
          <Shield className="w-9 h-9" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          {language === 'bn' ? 'অননুমোদিত অ্যাডমিন এক্সেস' : 'Unauthorized Admin Access'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {language === 'bn'
            ? `আপনি বর্তমানে "${currentUser.email}" হিসেবে লগইন আছেন, যা সাধারণ শিক্ষার্থী অ্যাকাউন্ট। এই প্যানেলটি শুধুমাত্র অনুমোদিত অ্যাডমিন (nisadandnisanfoodltd@gmail.com)-এর জন্য সংরক্ষিত।`
            : `You are logged in as "${currentUser.email}". This dashboard is strictly restricted to the authorized administrator.`}
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              logout();
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{language === 'bn' ? 'লগআউট করে অ্যাডমিন দিয়ে প্রবেশ' : 'Logout & Switch Account'}</span>
          </button>
          <a
            href="/dashboard"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>{language === 'bn' ? 'শিক্ষার্থী ড্যাশবোর্ডে যান' : 'Go to Student Dashboard'}</span>
          </a>
        </div>
      </div>
    );
  }

  // CASE 3: Authenticated Authorized Administrator -> FULL ADMIN PANEL
  return (
    <div className="bg-slate-100 min-h-screen pb-20">
      {/* Toast Feedback */}
      {actionNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{actionNotice}</span>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="bg-indigo-900 text-white border-b border-indigo-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-indigo-300">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  {language === 'bn' ? 'আল হেরা অ্যাডমিন কন্ট্রোল প্যানেল' : 'Al Hera Admin Control Panel'}
                </h1>
                <span className="bg-emerald-500 text-slate-950 text-[10px] uppercase font-black px-2 py-0.5 rounded-full">
                  Verified Admin
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                {language === 'bn' ? 'লগইন আছেন:' : 'Signed in as:'} <span className="font-bold text-white">{currentUser.email}</span> (URL: /admin)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              className="px-3.5 py-2 bg-indigo-800 hover:bg-indigo-700 text-xs font-bold rounded-lg transition flex items-center gap-1.5 border border-indigo-700"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'লাইভ ওয়েবসাইট দেখুন' : 'View Live Website'}</span>
            </a>
            <button
              onClick={logout}
              className="px-3.5 py-2 bg-rose-600/90 hover:bg-rose-600 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'লগআউট' : 'Logout'}</span>
            </button>
          </div>
        </div>

        {/* 6 Core Feature Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-1 border-t border-indigo-800/80 no-scrollbar">
          {[
            { id: 'overview', label: language === 'bn' ? 'ওভারভিউ' : 'Overview', icon: Shield },
            { id: 'homepage', label: language === 'bn' ? '১. হোমপেজ ও ব্যানার' : '1. Homepage & Banner', icon: Sparkles },
            { id: 'courses', label: language === 'bn' ? '২. কোর্স ও ফি' : '2. Courses & Fees', icon: BookOpen },
            { id: 'students', label: language === 'bn' ? '৩. শিক্ষার্থীদের তথ্য' : '3. Students & Ledger', icon: Users },
            { id: 'notices', label: language === 'bn' ? '৪. নোটিশ ও রুটিন' : '4. Notices & Routine', icon: Bell },
            { id: 'exams', label: language === 'bn' ? '৫. ফলাফল ও সার্টিফিকেট' : '5. Exams & Certificates', icon: Award },
            { id: 'contact', label: language === 'bn' ? '৬. যোগাযোগের তথ্য' : '6. Contact Information', icon: Phone },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap border-b-2 transition cursor-pointer ${
                  isActive
                    ? 'border-white text-white bg-indigo-800/60'
                    : 'border-transparent text-indigo-200 hover:text-white hover:bg-indigo-800/30'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-indigo-300'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* ===================== TAB 0: OVERVIEW ===================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">{language === 'bn' ? 'মোট শিক্ষার্থী' : 'Students'}</span>
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-black text-slate-900">{students.length}</p>
                <p className="text-[11px] text-slate-500 mt-1">{language === 'bn' ? 'রেজিস্টার্ড শিক্ষার্থী প্রোফাইল' : 'Registered profiles'}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">{language === 'bn' ? 'সক্রিয় কোর্স' : 'Courses'}</span>
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                </div>
                <p className="text-2xl font-black text-slate-900">{courses.length}</p>
                <p className="text-[11px] text-slate-500 mt-1">{language === 'bn' ? 'সিলেবাস ও লেসন অন্তর্ভুক্ত' : 'With video/PDF syllabus'}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">{language === 'bn' ? 'পেন্ডিং ফি অনুমোদন' : 'Pending Fees'}</span>
                  <CreditCard className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-2xl font-black text-amber-600">
                  {fees.filter(f => f.status === 'pending').length}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">{language === 'bn' ? 'যাচাইয়ের অপেক্ষমান পেমেন্ট' : 'Awaiting admin verification'}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">{language === 'bn' ? 'ইস্যুকৃত সার্টিফিকেট' : 'Certificates'}</span>
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-2xl font-black text-emerald-600">{certificates.length}</p>
                <p className="text-[11px] text-slate-500 mt-1">{language === 'bn' ? 'ভেরিফাইড ইউনিক আইডি সম্পন্ন' : 'Online verifiable credentials'}</p>
              </div>
            </div>

            {/* Quick Action Cards for all 6 requirements */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900">
                {language === 'bn' ? 'অনুমোদিত অ্যাডমিন কন্ট্রোল মডিউলসমূহ:' : 'Administrator Management Shortcuts:'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('homepage')}
                  className="p-4 rounded-2xl bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200 text-left transition cursor-pointer group"
                >
                  <Sparkles className="w-6 h-6 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-sm text-indigo-900">{language === 'bn' ? '১. হোমপেজ ও ব্যানার পরিবর্তন' : '1. Edit Homepage & Banner'}</h3>
                  <p className="text-xs text-indigo-700/80 mt-1">{language === 'bn' ? 'হেডলাইন, সাবটাইটেল, ব্যানার ছবি ও পরিসংখ্যান' : 'Hero headline, banner URL, impact metrics'}</p>
                </button>

                <button
                  onClick={() => setActiveTab('courses')}
                  className="p-4 rounded-2xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200 text-left transition cursor-pointer group"
                >
                  <BookOpen className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-sm text-blue-900">{language === 'bn' ? '২. কোর্সের নাম, বিবরণ ও ফি' : '2. Manage Courses & Fees'}</h3>
                  <p className="text-xs text-blue-700/80 mt-1">{language === 'bn' ? 'কোর্স তৈরি, এডিট, ফি ও ভিডিও/পিডিএফ লেসন' : 'Pricing, syllabus, modules, PDF notes'}</p>
                </button>

                <button
                  onClick={() => setActiveTab('students')}
                  className="p-4 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200 text-left transition cursor-pointer group"
                >
                  <Users className="w-6 h-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-sm text-emerald-900">{language === 'bn' ? '৩. শিক্ষার্থীদের তথ্য ও ফি লেজার' : '3. Students & Fee Ledger'}</h3>
                  <p className="text-xs text-emerald-700/80 mt-1">{language === 'bn' ? 'প্রোফাইল আপডেট ও bKash/নগদ পেমেন্ট অনুমোদন' : 'Student records, ledger approval'}</p>
                </button>

                <button
                  onClick={() => setActiveTab('notices')}
                  className="p-4 rounded-2xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200 text-left transition cursor-pointer group"
                >
                  <Bell className="w-6 h-6 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-sm text-amber-900">{language === 'bn' ? '৪. নোটিশ ও ক্লাস রুটিন' : '4. Notices & Routines'}</h3>
                  <p className="text-xs text-amber-700/80 mt-1">{language === 'bn' ? 'জরুরি নোটিশ, পরীক্ষার রুটিন ও জুম লিংক' : 'Circulars, schedules, Zoom links'}</p>
                </button>

                <button
                  onClick={() => setActiveTab('exams')}
                  className="p-4 rounded-2xl bg-purple-50/70 hover:bg-purple-100/70 border border-purple-200 text-left transition cursor-pointer group"
                >
                  <Award className="w-6 h-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-sm text-purple-900">{language === 'bn' ? '৫. পরীক্ষার ফলাফল ও সার্টিফিকেট' : '5. Exams & Certificates'}</h3>
                  <p className="text-xs text-purple-700/80 mt-1">{language === 'bn' ? 'নৈর্ব্যক্তিক মূল্যায়ন ও ইউনিক আইডি সনদ' : 'Submissions, score, certificate issuance'}</p>
                </button>

                <button
                  onClick={() => setActiveTab('contact')}
                  className="p-4 rounded-2xl bg-slate-100 hover:bg-slate-200/80 border border-slate-300 text-left transition cursor-pointer group"
                >
                  <Phone className="w-6 h-6 text-slate-700 mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-sm text-slate-900">{language === 'bn' ? '৬. যোগাযোগের তথ্য' : '6. Contact Information'}</h3>
                  <p className="text-xs text-slate-600 mt-1">{language === 'bn' ? 'হটলাইন, হোয়াটসঅ্যাপ, ক্যাম্পাস ঠিকানা ও লিংক' : 'Hotline, WhatsApp, address, office hours'}</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 1: HOMEPAGE & BANNER ===================== */}
        {activeTab === 'homepage' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <span>{language === 'bn' ? '১. ওয়েবসাইটের হোমপেজের লেখা ও ব্যানার পরিবর্তন' : '1. Edit Website Homepage Copy & Banner'}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'bn' ? 'এখানে যা পরিবর্তন করবেন তা সরাসরি হোমপেজে প্রদর্শিত হবে এবং ফায়ারস্টোরে সংরক্ষিত হবে।' : 'Changes made here will be persisted to Cloud Firestore and live on the homepage.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveHomepage} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'হিরো ব্যাজ (বাংলা)' : 'Hero Badge (Bengali)'}
                  </label>
                  <input
                    type="text"
                    value={homeSettingsForm.heroBadgeBn}
                    onChange={(e) => setHomeSettingsForm({ ...homeSettingsForm, heroBadgeBn: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'হিরো ব্যাজ (English)' : 'Hero Badge (English)'}
                  </label>
                  <input
                    type="text"
                    value={homeSettingsForm.heroBadgeEn}
                    onChange={(e) => setHomeSettingsForm({ ...homeSettingsForm, heroBadgeEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'হোমপেজ প্রধান শিরোনাম (বাংলা)' : 'Hero Main Headline (Bengali)'}
                  </label>
                  <input
                    type="text"
                    value={homeSettingsForm.heroTitleBn}
                    onChange={(e) => setHomeSettingsForm({ ...homeSettingsForm, heroTitleBn: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'হোমপেজ প্রধান শিরোনাম (English)' : 'Hero Main Headline (English)'}
                  </label>
                  <input
                    type="text"
                    value={homeSettingsForm.heroTitleEn}
                    onChange={(e) => setHomeSettingsForm({ ...homeSettingsForm, heroTitleEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'উপ-শিরোনাম / বিবরণ (বাংলা)' : 'Hero Subtitle (Bengali)'}
                  </label>
                  <textarea
                    rows={3}
                    value={homeSettingsForm.heroSubtitleBn}
                    onChange={(e) => setHomeSettingsForm({ ...homeSettingsForm, heroSubtitleBn: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'উপ-শিরোনাম / বিবরণ (English)' : 'Hero Subtitle (English)'}
                  </label>
                  <textarea
                    rows={3}
                    value={homeSettingsForm.heroSubtitleEn}
                    onChange={(e) => setHomeSettingsForm({ ...homeSettingsForm, heroSubtitleEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Hero Banner Image */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  {language === 'bn' ? 'হোমপেজ হিরো ব্যানার ছবির URL' : 'Hero Banner Image URL'}
                </label>
                <input
                  type="url"
                  value={homeSettingsForm.heroBannerUrl}
                  onChange={(e) => setHomeSettingsForm({ ...homeSettingsForm, heroBannerUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
                {homeSettingsForm.heroBannerUrl && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-slate-300 max-w-md h-36">
                    <img
                      src={homeSettingsForm.heroBannerUrl}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Impact Stats Counters */}
              <div className="border-t border-slate-200 pt-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-900">
                  {language === 'bn' ? 'হোমপেজ পরিসংখ্যান মেট্রিকস' : 'Homepage Statistics Metrics'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">শিক্ষার্থী সংখ্যা</label>
                    <input
                      type="text"
                      value={homeSettingsForm.statStudents}
                      onChange={(e) => setHomeSettingsForm({ ...homeSettingsForm, statStudents: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">আর্নিং সাকসেস রেট</label>
                    <input
                      type="text"
                      value={homeSettingsForm.statSuccessRate}
                      onChange={(e) => setHomeSettingsForm({ ...homeSettingsForm, statSuccessRate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">ব্যাচ সংখ্যা</label>
                    <input
                      type="text"
                      value={homeSettingsForm.statBatches}
                      onChange={(e) => setHomeSettingsForm({ ...homeSettingsForm, statBatches: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">সাপোর্ট লেবেল</label>
                    <input
                      type="text"
                      value={homeSettingsForm.statSupport}
                      onChange={(e) => setHomeSettingsForm({ ...homeSettingsForm, statSupport: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{language === 'bn' ? 'হোমপেজ পরিবর্তন সংরক্ষণ করুন' : 'Save Homepage Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===================== TAB 2: COURSES & FEES ===================== */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span>{language === 'bn' ? '২. কোর্সের নাম, বিবরণ ও ফি ব্যবস্থাপনা' : '2. Manage Course Curriculum, Pricing & Lessons'}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'bn' ? 'কোর্সের টাইটেল, বিবরণ, রেগুলার ও ডিসকাউন্ট ফি এবং ভিডিও/পিডিএফ লেসন পরিবর্তন করুন।' : 'Edit titles, descriptions, regular & discounted fees, and curriculum links.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingCourse({
                    id: `course-${Date.now()}`,
                    title: '',
                    titleBn: '',
                    subtitle: '',
                    subtitleBn: '',
                    category: 'digital-marketing',
                    categoryLabel: 'Digital Marketing',
                    categoryLabelBn: 'ডিজিটাল মার্কেটিং',
                    level: 'Beginner',
                    instructor: 'Mahmudul Hasan',
                    instructorRole: 'Lead Mentor',
                    durationWeeks: 10,
                    totalHours: 40,
                    feeBDT: 7500,
                    discountBDT: 5500,
                    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
                    rating: 4.9,
                    enrolledCount: 0,
                    batchNumber: 'Batch 29',
                    nextBatchStart: 'Next Month',
                    description: '',
                    descriptionBn: '',
                    modules: [],
                    features: ['Live Interactive Sessions', 'Official Certificate'],
                    featuresBn: ['লাইভ ইন্টারঅ্যাক্টিভ সেশন', 'ইনস্টিটিউট সার্টিফিকেট'],
                    prerequisites: 'Basic Computer skills',
                    prerequisitesBn: 'কম্পিউটারের সাধারণ জ্ঞান'
                  });
                }}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'bn' ? 'নতুন কোর্স যোগ করুন' : 'Add New Course'}</span>
              </button>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map(course => (
                <div key={course.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col">
                  <div className="relative h-44 bg-slate-100">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-blue-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                      {course.categoryLabelBn || course.categoryLabel}
                    </div>
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {course.batchNumber}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 leading-snug">
                        {language === 'bn' ? course.titleBn : course.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {language === 'bn' ? course.descriptionBn : course.description}
                      </p>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-400">{language === 'bn' ? 'কোর্স ফি:' : 'Fee:'} </span>
                          <span className="line-through text-slate-400 font-medium">৳{course.feeBDT}</span>
                          <span className="text-blue-700 font-extrabold text-sm ml-1.5">৳{course.discountBDT || course.feeBDT}</span>
                        </div>
                        <div className="text-slate-500 font-medium">
                          ⏱ {course.durationWeeks} {language === 'bn' ? 'সপ্তাহ' : 'wks'} ({course.modules?.length || 0} {language === 'bn' ? 'মডিউল' : 'modules'})
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingCourse({ ...course })}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg transition flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'এডিট কোর্স' : 'Edit'}</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCourseForLesson(course);
                            setShowAddLessonModal(true);
                          }}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg transition flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'লেসন যোগ' : '+ Lesson'}</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 3: STUDENTS & FEE LEDGER ===================== */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span>{language === 'bn' ? '৩. শিক্ষার্থীদের তথ্য ও ফি লেজার ব্যবস্থাপনা' : '3. Student Directory & Financial Ledger'}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'bn' ? 'নিবন্ধিত শিক্ষার্থীদের তথ্য পরিবর্তন এবং বিকাশ/নগদ পেমেন্ট ভেরিফিকেশন করুন।' : 'Manage enrolled student accounts and audit fee clearing.'}
                </p>
              </div>

              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder={language === 'bn' ? 'নাম বা ইমেইল দিয়ে খুঁজুন...' : 'Search students...'}
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm outline-none"
                />
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h3 className="font-bold text-sm text-slate-800">
                  {language === 'bn' ? 'নিবন্ধিত শিক্ষার্থীদের তালিকা' : 'Registered Students Directory'} ({students.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3">শিক্ষার্থী</th>
                      <th className="px-6 py-3">যোগাযোগ</th>
                      <th className="px-6 py-3">জেলা</th>
                      <th className="px-6 py-3">ভর্তি হওয়া কোর্স</th>
                      <th className="px-6 py-3">যোগদানের তারিখ</th>
                      <th className="px-6 py-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students
                      .filter(s => s.name?.toLowerCase().includes(studentSearch.toLowerCase()) || s.email?.toLowerCase().includes(studentSearch.toLowerCase()))
                      .map(student => (
                        <tr key={student.id} className="hover:bg-slate-50/80 transition">
                          <td className="px-6 py-3.5 font-bold text-slate-900">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center text-xs">
                                {student.name?.charAt(0) || 'S'}
                              </div>
                              <div>
                                <p className="font-bold">{student.name}</p>
                                <p className="text-[11px] text-slate-400 font-normal">{student.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3.5 text-slate-600">{student.phone || 'N/A'}</td>
                          <td className="px-6 py-3.5 text-slate-600">{student.district || 'Dhaka'}</td>
                          <td className="px-6 py-3.5">
                            <div className="flex flex-wrap gap-1">
                              {student.enrolledCourseIds?.map(cId => {
                                const c = courses.find(item => item.id === cId);
                                return (
                                  <span key={cId} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[10px] border border-blue-200">
                                    {c?.titleBn || cId}
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-3.5 text-slate-500">{student.joinDate}</td>
                          <td className="px-6 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setEditingStudent({ ...student })}
                                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                                title="Edit Student Info"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(student.id)}
                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title="Delete Student"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {students.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400 text-xs">
                          কোনো নিবন্ধিত শিক্ষার্থী পাওয়া যায়নি।
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fee Management & Verification */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>{language === 'bn' ? 'শিক্ষার্থী ফি লেজার ও পেমেন্ট অনুমোদন' : 'Student Fee Clearing & Audit Ledger'}</span>
                </h3>

                <div className="flex items-center gap-1.5">
                  {(['all', 'pending', 'verified', 'rejected'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFeeStatusFilter(f)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        feeStatusFilter === f
                          ? 'bg-indigo-700 text-white'
                          : 'bg-slate-200/80 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {f === 'all' ? 'সব' : f === 'pending' ? 'পেন্ডিং' : f === 'verified' ? 'অনুমোদিত' : 'বাতিল'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3">শিক্ষার্থী ও কোর্স</th>
                      <th className="px-6 py-3">মোট ফি</th>
                      <th className="px-6 py-3">পরিশোধিত</th>
                      <th className="px-6 py-3">বকেয়া</th>
                      <th className="px-6 py-3">মাধ্যম ও TrxID</th>
                      <th className="px-6 py-3">স্ট্যাটাস</th>
                      <th className="px-6 py-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fees
                      .filter(fee => feeStatusFilter === 'all' || fee.status === feeStatusFilter)
                      .map(fee => (
                        <tr key={fee.id} className="hover:bg-slate-50/80 transition">
                          <td className="px-6 py-3.5">
                            <p className="font-bold text-slate-900">{fee.studentName}</p>
                            <p className="text-[11px] text-slate-500">{fee.courseName}</p>
                          </td>
                          <td className="px-6 py-3.5 font-semibold text-slate-800">৳{fee.totalFee}</td>
                          <td className="px-6 py-3.5 font-bold text-emerald-600">৳{fee.paidAmount}</td>
                          <td className="px-6 py-3.5 font-bold text-rose-600">৳{fee.balance}</td>
                          <td className="px-6 py-3.5">
                            <span className="font-bold text-indigo-700">{fee.paymentMethod}</span>
                            <p className="text-[11px] text-slate-500 font-mono">{fee.transactionRef}</p>
                          </td>
                          <td className="px-6 py-3.5">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                              fee.status === 'verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : fee.status === 'pending'
                                ? 'bg-amber-100 text-amber-800 animate-pulse'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {fee.status}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-right">
                            {fee.status === 'pending' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleVerifyFee(fee.id, true)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition cursor-pointer"
                                >
                                  অনুমোদন
                                </button>
                                <button
                                  onClick={() => handleVerifyFee(fee.id, false)}
                                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition cursor-pointer"
                                >
                                  বাতিল
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 font-medium">সম্পন্ন</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 4: NOTICES & EXAM ROUTINE ===================== */}
        {activeTab === 'notices' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-600" />
                  <span>{language === 'bn' ? '৪. নোটিশ ও পরীক্ষার রুটিন প্রকাশনা' : '4. Notices & Exam Routine Management'}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'bn' ? 'ক্লাস রুটিন, লাইভ জুম লিংক এবং গুরুত্বপূর্ণ নোটিশ তৈরি ও নিয়ন্ত্রণ করুন।' : 'Publish schedules, circulars, exam dates and live class links.'}
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingNotice({
                    id: `notice-${Date.now()}`,
                    title: '',
                    titleBn: '',
                    content: '',
                    contentBn: '',
                    category: 'routine',
                    date: new Date().toISOString().split('T')[0],
                    isPinned: false,
                    meetingLink: ''
                  });
                }}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'bn' ? 'নতুন নোটিশ / রুটিন প্রকাশ' : 'Create Notice / Routine'}</span>
              </button>
            </div>

            {/* Notices List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notices.map(notice => (
                <div key={notice.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      notice.category === 'routine'
                        ? 'bg-blue-100 text-blue-800'
                        : notice.category === 'exam'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {notice.category === 'routine' ? 'ক্লাস রুটিন' : notice.category === 'exam' ? 'পরীক্ষা নির্দেশিকা' : 'বিজ্ঞপ্তি'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">📅 {notice.date}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900">
                      {language === 'bn' ? notice.titleBn : notice.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-3">
                      {language === 'bn' ? notice.contentBn : notice.content}
                    </p>
                  </div>

                  {notice.meetingLink && (
                    <div className="p-2 bg-indigo-50 border border-indigo-200 rounded-lg text-xs flex items-center gap-2 text-indigo-700">
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      <a href={notice.meetingLink} target="_blank" rel="noreferrer" className="truncate hover:underline">
                        {notice.meetingLink}
                      </a>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {notice.isPinned ? '📌 পিন করা নোটিশ' : ''}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingNotice({ ...notice })}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition cursor-pointer"
                      >
                        এডিট
                      </button>
                      <button
                        onClick={() => handleDeleteNotice(notice.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 5: EXAMS & CERTIFICATES ===================== */}
        {activeTab === 'exams' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span>{language === 'bn' ? '৫. পরীক্ষার ফলাফল ও সার্টিফিকেট ব্যবস্থাপনা' : '5. Exam Results & Certificate Issuance'}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'bn' ? 'শিক্ষার্থীদের পরীক্ষার সাবমিশন দেখুন এবং সরকারি স্ট্যান্ডার্ড ভেরিফিকেশন কোডসহ সার্টিফিকেট ইস্যু করুন।' : 'Review exam scores and generate unique verifiable completion certificates.'}
                </p>
              </div>

              <button
                onClick={() => setShowIssueCertModal(true)}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition"
              >
                <Award className="w-4 h-4" />
                <span>{language === 'bn' ? 'নতুন সার্টিফিকেট ইস্যু করুন' : 'Issue Certificate'}</span>
              </button>
            </div>

            {/* Submissions Section */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h3 className="font-bold text-sm text-slate-800">
                  {language === 'bn' ? 'শিক্ষার্থীদের পরীক্ষার ফলাফল ও মূল্যায়ন' : 'Student Exam Submissions & Automatic Scoring'} ({submissions.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3">শিক্ষার্থী</th>
                      <th className="px-6 py-3">পরীক্ষা</th>
                      <th className="px-6 py-3">প্রাপ্ত নম্বর</th>
                      <th className="px-6 py-3">শতাংশ</th>
                      <th className="px-6 py-3">ফলাফল</th>
                      <th className="px-6 py-3">তারিখ</th>
                      <th className="px-6 py-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {submissions.map(sub => (
                      <tr key={sub.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-3 font-bold text-slate-900">{sub.studentName}</td>
                        <td className="px-6 py-3 text-slate-600">{sub.examTitle}</td>
                        <td className="px-6 py-3 font-bold">{sub.score} / {sub.totalQuestions * 10}</td>
                        <td className="px-6 py-3 font-extrabold text-blue-600">{sub.percentage}%</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            sub.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {sub.passed ? 'পাস (PASSED)' : 'ফেইল (FAILED)'}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-slate-400">{sub.submittedAt.split('T')[0]}</td>
                        <td className="px-6 py-3 text-right">
                          {sub.passed && (
                            <button
                              onClick={() => {
                                setShowIssueCertModal(true);
                              }}
                              className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-lg transition"
                            >
                              সনদপত্র তৈরি
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {submissions.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-6 text-center text-slate-400 text-xs">
                          কোনো পরীক্ষার ফলাফল এখনও পাওয়া যায়নি।
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Issued Certificates */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h3 className="font-bold text-sm text-slate-800">
                  {language === 'bn' ? 'ইস্যুকৃত সার্টিফিকেটসমূহ' : 'Issued Verified Certificates'} ({certificates.length})
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                {certificates.map(cert => (
                  <div key={cert.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                          {cert.certificateNumber}
                        </span>
                        <span className="font-bold text-slate-900">{cert.studentName}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {cert.courseName} | গ্রেড: <span className="font-bold text-emerald-600">{cert.grade}</span> ({cert.scorePercentage}%) | ইস্যু: {cert.issueDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewingCertificate(cert)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>সার্টিফিকেট দেখুন</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCert(cert.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Revoke Certificate"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 6: CONTACT INFORMATION ===================== */}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Phone className="w-5 h-5 text-indigo-600" />
                <span>{language === 'bn' ? '৬. ওয়েবসাইটের যোগাযোগের তথ্য পরিবর্তন' : '6. Edit Website Contact Information'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'bn' ? 'হটলাইন, হোয়াটসঅ্যাপ, অফিসিয়াল ইমেইল ও ক্যাম্পাসের ঠিকানা আপডেট করুন।' : 'Update phone numbers, WhatsApp, official email, and campus address.'}
              </p>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'হটলাইন নাম্বার' : 'Hotline Number'}
                  </label>
                  <input
                    type="text"
                    value={contactSettingsForm.hotline}
                    onChange={(e) => setContactSettingsForm({ ...contactSettingsForm, hotline: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'হোয়াটসঅ্যাপ নাম্বার' : 'WhatsApp Number'}
                  </label>
                  <input
                    type="text"
                    value={contactSettingsForm.whatsapp}
                    onChange={(e) => setContactSettingsForm({ ...contactSettingsForm, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'অফিসিয়াল ইমেইল' : 'Official Email Address'}
                  </label>
                  <input
                    type="email"
                    value={contactSettingsForm.emailContact}
                    onChange={(e) => setContactSettingsForm({ ...contactSettingsForm, emailContact: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'ক্যাম্পাসের ঠিকানা (বাংলা)' : 'Institute Location (Bengali)'}
                  </label>
                  <input
                    type="text"
                    value={contactSettingsForm.instituteLocationBn}
                    onChange={(e) => setContactSettingsForm({ ...contactSettingsForm, instituteLocationBn: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'ক্যাম্পাসের ঠিকানা (English)' : 'Institute Location (English)'}
                  </label>
                  <input
                    type="text"
                    value={contactSettingsForm.instituteLocationEn}
                    onChange={(e) => setContactSettingsForm({ ...contactSettingsForm, instituteLocationEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'অফিস সময় (বাংলা)' : 'Office Hours (Bengali)'}
                  </label>
                  <input
                    type="text"
                    value={contactSettingsForm.officeHoursBn}
                    onChange={(e) => setContactSettingsForm({ ...contactSettingsForm, officeHoursBn: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'অফিস সময় (English)' : 'Office Hours (English)'}
                  </label>
                  <input
                    type="text"
                    value={contactSettingsForm.officeHoursEn}
                    onChange={(e) => setContactSettingsForm({ ...contactSettingsForm, officeHoursEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'শীর্ষ বারের ভর্তি নোটিশ (বাংলা)' : 'Top Bar Admission Ticker (Bengali)'}
                  </label>
                  <input
                    type="text"
                    value={contactSettingsForm.admissionsNoticeBn}
                    onChange={(e) => setContactSettingsForm({ ...contactSettingsForm, admissionsNoticeBn: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'শীর্ষ বারের ভর্তি নোটিশ (English)' : 'Top Bar Admission Ticker (English)'}
                  </label>
                  <input
                    type="text"
                    value={contactSettingsForm.admissionsNoticeEn}
                    onChange={(e) => setContactSettingsForm({ ...contactSettingsForm, admissionsNoticeEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{language === 'bn' ? 'যোগাযোগের তথ্য সংরক্ষণ করুন' : 'Save Contact Information'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ===================== MODALS ===================== */}

      {/* 1. EDIT COURSE MODAL */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900">
                {editingCourse.title ? 'কোর্সের তথ্য পরিবর্তন করুন' : 'নতুন কোর্স তৈরি করুন'}
              </h3>
              <button onClick={() => setEditingCourse(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">কোর্সের নাম (বাংলা)</label>
                  <input
                    type="text"
                    required
                    value={editingCourse.titleBn}
                    onChange={(e) => setEditingCourse({ ...editingCourse, titleBn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">কোর্সের নাম (English)</label>
                  <input
                    type="text"
                    required
                    value={editingCourse.title}
                    onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">রেগুলার ফি (BDT)</label>
                  <input
                    type="number"
                    required
                    value={editingCourse.feeBDT}
                    onChange={(e) => setEditingCourse({ ...editingCourse, feeBDT: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ডিসকাউন্ট ফি (BDT)</label>
                  <input
                    type="number"
                    value={editingCourse.discountBDT || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, discountBDT: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">কোর্স মেয়াদ (সপ্তাহ)</label>
                  <input
                    type="number"
                    value={editingCourse.durationWeeks}
                    onChange={(e) => setEditingCourse({ ...editingCourse, durationWeeks: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মেন্টর / ট্রেইনার</label>
                  <input
                    type="text"
                    value={editingCourse.instructor}
                    onChange={(e) => setEditingCourse({ ...editingCourse, instructor: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ব্যাচ নাম্বার</label>
                  <input
                    type="text"
                    value={editingCourse.batchNumber}
                    onChange={(e) => setEditingCourse({ ...editingCourse, batchNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">থাম্বনেইল ইমেজ URL</label>
                <input
                  type="url"
                  value={editingCourse.thumbnail}
                  onChange={(e) => setEditingCourse({ ...editingCourse, thumbnail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">কোর্সের বিবরণ (বাংলা)</label>
                <textarea
                  rows={3}
                  value={editingCourse.descriptionBn}
                  onChange={(e) => setEditingCourse({ ...editingCourse, descriptionBn: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. ADD LESSON MODAL */}
      {showAddLessonModal && selectedCourseForLesson && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">
                নতুন লেসন যুক্ত করুন ({selectedCourseForLesson.titleBn})
              </h3>
              <button onClick={() => setShowAddLessonModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const titleBn = (form.elements.namedItem('lessonTitleBn') as HTMLInputElement).value;
              const titleEn = (form.elements.namedItem('lessonTitleEn') as HTMLInputElement).value;
              const videoUrl = (form.elements.namedItem('videoUrl') as HTMLInputElement).value;
              const studyMaterialUrl = (form.elements.namedItem('studyUrl') as HTMLInputElement).value;
              const duration = Number((form.elements.namedItem('duration') as HTMLInputElement).value) || 45;

              if (!selectedCourseForLesson.modules || selectedCourseForLesson.modules.length === 0) {
                selectedCourseForLesson.modules = [{
                  id: `mod-${Date.now()}`,
                  courseId: selectedCourseForLesson.id,
                  title: 'Module 1: Foundations',
                  titleBn: 'মডিউল ১: মৌলিক ধারণা',
                  order: 1,
                  lessons: []
                }];
              }

              const targetMod = selectedCourseForLesson.modules[0];
              const newLesson: Lesson = {
                id: `les-${Date.now()}`,
                moduleId: targetMod.id,
                title: titleEn || titleBn,
                titleBn: titleBn,
                durationMinutes: duration,
                videoUrl: videoUrl,
                description: 'Lecture notes & practical instructions',
                descriptionBn: 'ক্লাস লেকচার ও প্র্যাক্টিক্যাল নির্দেশিকা',
                studyMaterialUrl: studyMaterialUrl || undefined
              };

              targetMod.lessons = targetMod.lessons || [];
              targetMod.lessons.push(newLesson);

              await StorageService.saveCourse(selectedCourseForLesson);
              setShowAddLessonModal(false);
              showFeedback('নতুন লেসন ও ভিডিও/পিডিএফ লিংক যুক্ত হয়েছে!');
            }} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">লেসনের শিরোনাম (বাংলা)</label>
                <input name="lessonTitleBn" required placeholder="যেমন: অ্যাডভান্সড মেটা পিক্সেল সেটআপ" className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">লেসনের শিরোনাম (English)</label>
                <input name="lessonTitleEn" placeholder="e.g. Advanced Meta Pixel Setup" className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ভিডিও এম্বেড URL (YouTube Embed)</label>
                <input name="videoUrl" required defaultValue="https://www.youtube.com/embed/DvwS7cV9GmQ" className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs font-mono" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">PDF নোটস বা ডকুমেন্টেশন লিংক</label>
                <input name="studyUrl" placeholder="https://drive.google.com/... অথবা অফিসিয়াল গাইড" className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs font-mono" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">মেয়াদ (মিনিট)</label>
                <input name="duration" type="number" defaultValue={45} className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs" />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setShowAddLessonModal(false)} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-lg">বাতিল</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg">সংরক্ষণ করুন</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. EDIT STUDENT MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">শিক্ষার্থীর তথ্য সংশোধন</h3>
              <button onClick={() => setEditingStudent(null)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">নাম</label>
                <input
                  type="text"
                  required
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নাম্বার</label>
                <input
                  type="text"
                  value={editingStudent.phone || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">জেলা / ঠিকানা</label>
                <input
                  type="text"
                  value={editingStudent.district || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, district: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ভর্তি হওয়া কোর্সসমূহ</label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-lg border text-xs">
                  {courses.map(c => {
                    const isChecked = editingStudent.enrolledCourseIds?.includes(c.id);
                    return (
                      <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            let list = editingStudent.enrolledCourseIds || [];
                            if (e.target.checked) list = [...list, c.id];
                            else list = list.filter(id => id !== c.id);
                            setEditingStudent({ ...editingStudent, enrolledCourseIds: list });
                          }}
                        />
                        <span>{c.titleBn}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setEditingStudent(null)} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-lg">বাতিল</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg">সংরক্ষণ করুন</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. EDIT/ADD NOTICE MODAL */}
      {editingNotice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingNotice.title ? 'নোটিশ / রুটিন সম্পাদনা' : 'নতুন নোটিশ বা ক্লাস রুটিন তৈরি'}
              </h3>
              <button onClick={() => setEditingNotice(null)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNotice} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">শিরোনাম (বাংলা)</label>
                <input
                  type="text"
                  required
                  value={editingNotice.titleBn}
                  onChange={(e) => setEditingNotice({ ...editingNotice, titleBn: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                <select
                  value={editingNotice.category}
                  onChange={(e) => setEditingNotice({ ...editingNotice, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs font-bold"
                >
                  <option value="routine">ক্লাস রুটিন (Routine)</option>
                  <option value="exam">পরীক্ষার রুটিন ও নির্দেশিকা (Exam)</option>
                  <option value="general">সাধারণ নোটিশ (General)</option>
                  <option value="event">বিশেষ সেমিনার / ইভেন্ট (Event)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বিস্তারিত বিবরণ (বাংলা)</label>
                <textarea
                  rows={3}
                  required
                  value={editingNotice.contentBn}
                  onChange={(e) => setEditingNotice({ ...editingNotice, contentBn: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Zoom / Google Meet লিংক (ঐচ্ছিক)</label>
                <input
                  type="url"
                  value={editingNotice.meetingLink || ''}
                  onChange={(e) => setEditingNotice({ ...editingNotice, meetingLink: e.target.value })}
                  placeholder="https://zoom.us/j/..."
                  className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs font-mono"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={editingNotice.isPinned}
                  onChange={(e) => setEditingNotice({ ...editingNotice, isPinned: e.target.checked })}
                />
                <span>এই নোটিশটি শীর্ষে পিন করে রাখুন (Pinned)</span>
              </label>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setEditingNotice(null)} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-lg">বাতিল</button>
                <button type="submit" className="px-5 py-2 bg-amber-600 text-white text-xs font-bold rounded-lg">প্রকাশ করুন</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. ISSUE CERTIFICATE MODAL */}
      {showIssueCertModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">সরকারি স্ট্যান্ডার্ড সার্টিফিকেট ইস্যু</h3>
              <button onClick={() => setShowIssueCertModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const studentId = (form.elements.namedItem('studentSelect') as HTMLSelectElement).value;
              const courseId = (form.elements.namedItem('courseSelect') as HTMLSelectElement).value;
              const grade = (form.elements.namedItem('gradeSelect') as HTMLSelectElement).value as any;
              const score = Number((form.elements.namedItem('scoreInput') as HTMLInputElement).value);

              const student = students.find(s => s.id === studentId);
              const course = courses.find(c => c.id === courseId);
              if (!student || !course) return;

              const issued = await StorageService.issueCertificate({
                studentId: student.id,
                studentName: student.name,
                studentEmail: student.email,
                courseId: course.id,
                courseName: course.title,
                courseNameBn: course.titleBn,
                issueDate: new Date().toISOString().split('T')[0],
                grade: grade,
                scorePercentage: score,
                verified: true,
                directorName: 'Engr. Mahmudul Hasan',
                instructorName: course.instructor
              });

              setShowIssueCertModal(false);
              showFeedback(`সার্টিফিকেট ইস্যু সম্পন্ন! আইডি: ${issued.certificateNumber}`);
            }} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষার্থী নির্বাচন করুন</label>
                <select name="studentSelect" required className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs font-semibold">
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">কোর্স নির্বাচন করুন</label>
                <select name="courseSelect" required className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs font-semibold">
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.titleBn}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">গ্রেড</label>
                  <select name="gradeSelect" defaultValue="A+" className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs font-bold">
                    <option value="A+">A+ (Outstanding)</option>
                    <option value="A">A (Excellent)</option>
                    <option value="B+">B+ (Very Good)</option>
                    <option value="B">B (Good)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">স্কোর শতকরা (%)</label>
                  <input name="scoreInput" type="number" defaultValue={92} min={60} max={100} className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs font-bold" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setShowIssueCertModal(false)} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-lg">বাতিল</button>
                <button type="submit" className="px-5 py-2 bg-purple-600 text-white text-xs font-bold rounded-lg">ইস্যু করুন</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Viewer Modal */}
      {viewingCertificate && (
        <CertificateView
          certificate={viewingCertificate}
          onClose={() => setViewingCertificate(null)}
        />
      )}
    </div>
  );
};
