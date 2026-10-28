import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { StorageService } from '../services/storage';
import {
  Course, Lesson, Exam, ExamSubmission, FeeRecord,
  Certificate, Notice, LessonProgress
} from '../types';
import { CertificateView } from './CertificateView';
import confetti from 'canvas-confetti';
import {
  BookOpen, Video, Award, CreditCard, Calendar, FileText,
  User as UserIcon, CheckCircle2, Clock, AlertCircle, PlayCircle,
  ExternalLink, Download, Send, TrendingUp, ShieldCheck, Lock
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { language, t } = useLanguage();

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'classroom' | 'exams' | 'fees' | 'certificates' | 'routine' | 'profile'
  >('classroom');

  // Courses and selected course
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress | null>(null);

  // Exam state
  const [exams, setExams] = useState<Exam[]>([]);
  const [activeExam, setActiveExam] = useState<any | null>(null);
  const [examTimeLeft, setExamTimeLeft] = useState<number>(0);
  const [userExamAnswers, setUserExamAnswers] = useState<Record<string, string>>({});
  const [examResult, setExamResult] = useState<{ submission: ExamSubmission; answerKeys: Record<string, { correctOptionId: string; explanation?: string }> } | null>(null);
  const [isExamRunning, setIsExamRunning] = useState(false);

  // Fee state
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
  const [paymentAmount, setPaymentAmount] = useState<number>(2000);
  const [paymentMethod, setPaymentMethod] = useState<FeeRecord['paymentMethod']>('bKash');
  const [trxId, setTrxId] = useState('');
  const [senderPhone, setSenderPhone] = useState(currentUser?.phone || '');
  const [feeSubmitMsg, setFeeSubmitMsg] = useState<string | null>(null);

  // Certificate state
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [viewingCertificate, setViewingCertificate] = useState<Certificate | null>(null);

  // Routine & notices
  const [notices, setNotices] = useState<Notice[]>([]);

  // Profile Edit
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileDistrict, setProfileDistrict] = useState(currentUser?.district || 'Dhaka');
  const [profileSavedMsg, setProfileSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    loadAllData();
  }, [currentUser]);

  const loadAllData = async () => {
    if (!currentUser) return;
    const allCourses = await StorageService.getCourses();
    setCourses(allCourses);

    const studentCourses = allCourses.filter(c => currentUser.enrolledCourseIds?.includes(c.id));
    if (studentCourses.length > 0) {
      const crs = selectedCourse || studentCourses[0];
      setSelectedCourse(crs);
      if (crs.modules?.[0]?.lessons?.[0]) {
        setActiveLesson(crs.modules[0].lessons[0]);
      }
      const prog = await StorageService.getLessonProgress(currentUser.id, crs.id);
      setLessonProgress(prog);
    }

    const fees = await StorageService.getFeesForStudent(currentUser.id);
    setFeeRecords(fees);

    const certs = await StorageService.getCertificatesForStudent(currentUser.id);
    setCertificates(certs);

    const allNotices = await StorageService.getNotices();
    setNotices(allNotices);

    const allExams = await StorageService.getExams();
    setExams(allExams);
  };

  useEffect(() => {
    if (selectedCourse && currentUser) {
      StorageService.getLessonProgress(currentUser.id, selectedCourse.id).then(setLessonProgress);
    }
  }, [selectedCourse]);

  // Exam Countdown Timer
  useEffect(() => {
    let timer: any;
    if (isExamRunning && examTimeLeft > 0) {
      timer = setInterval(() => {
        setExamTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isExamRunning, examTimeLeft]);

  const handleStartExam = async (examId: string) => {
    const studentExam = await StorageService.getStudentExam(examId);
    if (!studentExam) return;
    setActiveExam(studentExam);
    setExamTimeLeft(studentExam.durationMinutes * 60);
    setUserExamAnswers({});
    setExamResult(null);
    setIsExamRunning(true);
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setUserExamAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleSubmitExam = async () => {
    if (!activeExam || !currentUser) return;
    setIsExamRunning(false);

    const result = await StorageService.submitExam(
      activeExam.id,
      currentUser.id,
      currentUser.name,
      userExamAnswers
    );

    setExamResult(result);

    if (result.submission.passed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleToggleLessonComplete = async (lessonId: string) => {
    if (!currentUser || !selectedCourse) return;
    const updated = await StorageService.toggleLessonProgress(currentUser.id, selectedCourse.id, lessonId);
    setLessonProgress({ ...updated });
  };

  const handleSubmitFeeReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || feeRecords.length === 0) return;
    const targetFee = feeRecords[0];

    await StorageService.submitPaymentReceipt(
      targetFee.id,
      Number(paymentAmount),
      paymentMethod,
      trxId.trim().toUpperCase(),
      senderPhone.trim(),
      currentUser.email
    );

    setTrxId('');
    setFeeSubmitMsg(t('paymentSubmittedSuccess'));
    loadAllData();
    setTimeout(() => setFeeSubmitMsg(null), 6000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    currentUser.name = profileName.trim();
    currentUser.phone = profilePhone.trim();
    currentUser.district = profileDistrict.trim();
    await StorageService.saveUserProfile(currentUser);
    await refreshUser();
    setProfileSavedMsg(language === 'bn' ? 'প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে!' : 'Profile updated successfully!');
    setTimeout(() => setProfileSavedMsg(null), 4000);
  };

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 shadow-md text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          {language === 'bn' ? 'শিক্ষার্থী পোর্টালে লগইন করুন' : 'Sign in to Student Portal'}
        </h2>
        <p className="text-xs text-slate-600">
          {language === 'bn' 
            ? 'আপনার এনরোল করা কোর্স, ভিডিও লেকচার ও সার্টিফিকেট দেখতে লগইন করুন।' 
            : 'Access your enrolled courses, video lectures, and certificates by signing in.'}
        </p>
      </div>
    );
  }

  const enrolledCourses = courses.filter(c => currentUser.enrolledCourseIds?.includes(c.id));
  const totalLessonsInCourse = selectedCourse
    ? selectedCourse.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0
    : 0;
  const completedLessonsCount = lessonProgress?.completedLessonIds?.length || 0;
  const progressPercent = totalLessonsInCourse > 0
    ? Math.round((completedLessonsCount / totalLessonsInCourse) * 100)
    : 0;

  const currentFee = feeRecords[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner: Student Welcome & Quick Stats */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser?.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-blue-300 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/40 text-blue-200 border border-blue-400/30">
                {language === 'bn' ? 'শিক্ষার্থী' : 'Student'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Verified Account</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold mt-1 text-white">
              {t('welcomeBack')} {currentUser?.name}
            </h1>
            <p className="text-xs text-blue-200">
              UID: {currentUser?.id.substring(0, 12)}... • {currentUser?.email}
            </p>
          </div>
        </div>

        {/* Quick Progress Cards */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/15 flex-1 md:flex-initial text-center min-w-[110px]">
            <span className="text-[11px] text-blue-200 block">{t('learningProgress')}</span>
            <span className="text-lg font-extrabold text-white">{progressPercent}%</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/15 flex-1 md:flex-initial text-center min-w-[110px]">
            <span className="text-[11px] text-blue-200 block">{t('dueBalance')}</span>
            <span className={`text-lg font-extrabold ${currentFee && currentFee.balance > 0 ? 'text-amber-300' : 'text-emerald-300'}`}>
              ৳{currentFee ? currentFee.balance.toLocaleString() : 0}
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/15 flex-1 md:flex-initial text-center min-w-[110px]">
            <span className="text-[11px] text-blue-200 block">{t('certificates')}</span>
            <span className="text-lg font-extrabold text-amber-300">{certificates.length}</span>
          </div>
        </div>
      </div>

      {/* Main Tab Bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('classroom')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'classroom'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{t('courseClassroom')}</span>
        </button>

        <button
          onClick={() => setActiveTab('exams')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'exams'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t('upcomingExams')}</span>
        </button>

        <button
          onClick={() => setActiveTab('fees')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'fees'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>{t('feeStatus')}</span>
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'certificates'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{t('certificates')}</span>
          {certificates.length > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-400 text-slate-900 text-[10px] font-extrabold rounded-full">
              {certificates.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('routine')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'routine'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{t('classRoutine')}</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>{t('profile')}</span>
        </button>
      </div>

      {/* ===================== TAB 1: CLASSROOM ===================== */}
      {activeTab === 'classroom' && (
        <div className="space-y-6">
          {enrolledCourses.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                {language === 'bn' ? 'কোর্স নির্বাচন:' : 'Select Course:'}
              </span>
              {enrolledCourses.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCourse(c);
                    if (c.modules?.[0]?.lessons?.[0]) setActiveLesson(c.modules[0].lessons[0]);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedCourse?.id === c.id
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {language === 'bn' ? c.titleBn : c.title}
                </button>
              ))}
            </div>
          )}

          {selectedCourse ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Video Player & Lesson Details */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-black rounded-2xl overflow-hidden aspect-video shadow-md relative">
                  {activeLesson?.videoUrl ? (
                    <iframe
                      src={activeLesson.videoUrl}
                      title={activeLesson.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                      <PlayCircle className="w-12 h-12 text-blue-500 mb-2" />
                      <p className="text-sm font-semibold">Select a lesson to begin lecture</p>
                    </div>
                  )}
                </div>

                {activeLesson && (
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                          {selectedCourse.batchNumber} • Lecture
                        </span>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                          {language === 'bn' ? activeLesson.titleBn : activeLesson.title}
                        </h2>
                        <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3.5 h-3.5" />
                          {activeLesson.durationMinutes} {language === 'bn' ? 'মিনিট' : 'Minutes'}
                        </span>
                      </div>

                      {lessonProgress && (
                        <button
                          onClick={() => handleToggleLessonComplete(activeLesson.id)}
                          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                            lessonProgress.completedLessonIds.includes(activeLesson.id)
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            {lessonProgress.completedLessonIds.includes(activeLesson.id)
                              ? t('completed')
                              : t('markAsCompleted')}
                          </span>
                        </button>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        {language === 'bn' ? 'লেকচার সারসংক্ষেপ ও রিসোর্স' : 'Lecture Notes & Resources'}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {language === 'bn' ? activeLesson.descriptionBn : activeLesson.description}
                      </p>
                    </div>

                    {activeLesson.studyMaterialUrl && (
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Download className="w-4 h-4 text-blue-700" />
                          <span className="text-xs font-semibold text-blue-900">
                            {t('downloadMaterial')}
                          </span>
                        </div>
                        <a
                          href={activeLesson.studyMaterialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                        >
                          <span>Open PDF / Notes</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Col: Curriculum Module Tree & Progress */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {t('learningProgress')}
                    </span>
                    <span className="text-xs font-extrabold text-blue-700">
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    {completedLessonsCount} / {totalLessonsInCourse} {language === 'bn' ? 'লেকচার সম্পন্ন হয়েছে' : 'Lectures completed'}
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {language === 'bn' ? 'কোর্স সূচিপত্র ও লেকচার' : 'Curriculum Lessons'}
                  </h3>

                  <div className="space-y-3">
                    {selectedCourse.modules?.map(mod => (
                      <div key={mod.id} className="space-y-1.5">
                        <h4 className="text-xs font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md">
                          {language === 'bn' ? mod.titleBn : mod.title}
                        </h4>

                        <div className="space-y-1 pl-1">
                          {mod.lessons?.map(les => {
                            const isCurrent = activeLesson?.id === les.id;
                            const isDone = lessonProgress?.completedLessonIds.includes(les.id);

                            return (
                              <button
                                key={les.id}
                                onClick={() => setActiveLesson(les)}
                                className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                                  isCurrent
                                    ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200'
                                    : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0 pr-2">
                                  {isDone ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  ) : (
                                    <PlayCircle className="w-4 h-4 text-slate-400 shrink-0" />
                                  )}
                                  <span className="truncate">
                                    {language === 'bn' ? les.titleBn : les.title}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-400 shrink-0">
                                  {les.durationMinutes}m
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-600">{t('noEnrolledCourses')}</p>
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 2: EXAMS & QUIZZES ===================== */}
      {activeTab === 'exams' && (
        <div className="space-y-6">
          {activeExam && isExamRunning && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-blue-600 shadow-xl space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase">
                    Live Examination
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                    {language === 'bn' ? activeExam.titleBn : activeExam.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl">
                  <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="text-xs text-slate-300">{t('timeLeft')}:</span>
                  <span className="font-mono font-extrabold text-base text-amber-300">
                    {Math.floor(examTimeLeft / 60)}:{(examTimeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {activeExam.questions?.map((q: any, qIdx: number) => (
                  <div key={q.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {qIdx + 1}
                      </span>
                      <p className="font-bold text-sm text-slate-900">
                        {language === 'bn' ? q.questionTextBn : q.questionText}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8">
                      {q.options?.map((opt: any) => {
                        const isSelected = userExamAnswers[q.id] === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectOption(q.id, opt.id)}
                            className={`p-3 rounded-xl text-left text-xs sm:text-sm font-medium transition cursor-pointer border ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            <span>{language === 'bn' ? opt.textBn : opt.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Answered {Object.keys(userExamAnswers).length} of {activeExam.questions?.length || 0} questions
                </span>
                <button
                  onClick={handleSubmitExam}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer"
                >
                  {t('submitExam')}
                </button>
              </div>
            </div>
          )}

          {examResult && (
            <div className={`bg-white rounded-2xl p-6 sm:p-8 border-2 shadow-xl space-y-6 animate-in zoom-in-95 ${
              examResult.submission.passed ? 'border-emerald-500' : 'border-rose-400'
            }`}>
              <div className="text-center space-y-2">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${
                  examResult.submission.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                }`}>
                  {examResult.submission.passed ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  {examResult.submission.passed ? t('statusPassed') : t('statusFailed')}
                </h3>

                <p className="text-xs text-slate-500">
                  {examResult.submission.examTitle}
                </p>

                <div className="flex items-center justify-center gap-4 py-2">
                  <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 block">{t('yourScore')}</span>
                    <span className="text-lg font-extrabold text-blue-700">
                      {examResult.submission.score} Marks ({examResult.submission.percentage}%)
                    </span>
                  </div>
                  <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 block">Correct Answers</span>
                    <span className="text-lg font-extrabold text-emerald-700">
                      {examResult.submission.correctCount} / {examResult.submission.totalQuestions}
                    </span>
                  </div>
                </div>
              </div>

              {/* Secure Answer Review (Unlocked after submission) */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {t('reviewAnswers')}
                </h4>

                <div className="space-y-3">
                  {activeExam?.questions?.map((q: any, idx: number) => {
                    const chosen = examResult.submission.userAnswers[q.id];
                    const key = examResult.answerKeys[q.id];
                    const isRight = chosen === key.correctOptionId;

                    return (
                      <div key={q.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                            isRight ? 'bg-emerald-600' : 'bg-rose-500'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="font-bold text-slate-800">
                            {language === 'bn' ? q.questionTextBn : q.questionText}
                          </span>
                        </div>
                        <div className="pl-7 space-y-0.5 text-slate-600">
                          <p>
                            Your Answer: <strong className={isRight ? 'text-emerald-700' : 'text-rose-600'}>
                              {q.options.find((o: any) => o.id === chosen)?.text || 'None'}
                            </strong>
                          </p>
                          {!isRight && (
                            <p className="text-emerald-700 font-semibold">
                              Correct: {q.options.find((o: any) => o.id === key.correctOptionId)?.text}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    setActiveExam(null);
                    setExamResult(null);
                  }}
                  className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Done Reviewing
                </button>
              </div>
            </div>
          )}

          {(!activeExam || !isExamRunning) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exams.map(exam => (
                <div key={exam.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        Pass Mark: {exam.passPercentage}%
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900">
                      {language === 'bn' ? exam.titleBn : exam.title}
                    </h3>

                    <p className="text-xs text-slate-600">
                      {language === 'bn' ? exam.descriptionBn : exam.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        {exam.durationMinutes} Minutes
                      </span>
                      <span>•</span>
                      <span>{exam.questions?.length || 0} MCQs</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Online Evaluation</span>
                    <button
                      onClick={() => handleStartExam(exam.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                    >
                      {t('startExam')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 3: FEES & PAYMENTS ===================== */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          {currentFee ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block">{t('totalPayable')}</span>
                <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
                  ৳{currentFee.totalFee.toLocaleString()}
                </span>
                <span className="text-xs text-blue-600 font-semibold">{currentFee.courseName}</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block">{t('paidAmount')}</span>
                <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">
                  ৳{currentFee.paidAmount.toLocaleString()}
                </span>
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {currentFee.status === 'verified' ? 'Verified (অনুমোদিত)' : 'Ledger Active'}
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block">{t('dueBalance')}</span>
                <span className={`text-2xl font-extrabold mt-1 block ${currentFee.balance > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
                  ৳{currentFee.balance.toLocaleString()}
                </span>
                <span className={`text-xs font-semibold ${currentFee.balance > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {currentFee.balance === 0 ? 'সম্পূর্ণ পরিশোধিত (Cleared)' : 'বকেয়া রয়েছে (Due)'}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl text-center border border-slate-200">
              <CreditCard className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600">No active fee record. Enroll in a course to activate payment ledger.</p>
            </div>
          )}

          {currentFee && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                  {language === 'bn' ? 'ফি পরিশোধের সহজ নির্দেশিকা' : 'Official Payment Channels'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t('paymentInstruction')}
                </p>

                <div className="space-y-2.5 pt-2">
                  <div className="p-3 bg-pink-50 rounded-xl border border-pink-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-pink-900 block">bKash বিকাশ মার্চেন্ট নম্বর</span>
                      <span className="font-mono text-sm font-extrabold text-pink-700">01712-345678</span>
                    </div>
                    <span className="text-[11px] bg-pink-200 text-pink-900 font-bold px-2 py-0.5 rounded">
                      Payment / Send
                    </span>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-amber-900 block">Nagad নগদ মার্চেন্ট নম্বর</span>
                      <span className="font-mono text-sm font-extrabold text-amber-700">01712-345678</span>
                    </div>
                    <span className="text-[11px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">
                      Merchant Pay
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                  {t('submitNewPayment')}
                </h3>

                {feeSubmitMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{feeSubmitMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmitFeeReceipt} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t('paymentMethod')}
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="bKash">bKash (বিকাশ)</option>
                      <option value="Nagad">Nagad (নগদ)</option>
                      <option value="Rocket">Rocket (রকেট)</option>
                      <option value="Bank Transfer">Bank Wire Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t('amountInBDT')}
                    </label>
                    <input
                      type="number"
                      min="500"
                      step="500"
                      required
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t('trxId')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BK-9X487A21"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t('senderNumber')}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="018XXXXXXXX"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                  >
                    {t('submitReceiptBtn')}
                  </button>
                </form>
              </div>
            </div>
          )}

          {currentFee && currentFee.auditTrail?.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center justify-between">
                <span>{t('auditTrailHeading')}</span>
                <span className="text-xs font-normal text-slate-500">
                  {currentFee.auditTrail.length} Records
                </span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <th className="py-2.5 px-3 font-semibold">Date & Time</th>
                      <th className="py-2.5 px-3 font-semibold">{t('auditAction')}</th>
                      <th className="py-2.5 px-3 font-semibold">Changed By</th>
                      <th className="py-2.5 px-3 font-semibold">Amount (৳)</th>
                      <th className="py-2.5 px-3 font-semibold">Balance</th>
                      <th className="py-2.5 px-3 font-semibold">Notes / Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentFee.auditTrail.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                          {log.timestamp.replace('T', ' ').substring(0, 16)}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            log.action === 'VERIFIED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.action === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">
                          {log.changedBy}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          ৳{log.amount.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-700">
                          ৳{log.newBalance.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">
                          {log.reference && <strong className="font-mono text-blue-700 mr-1">[{log.reference}]</strong>}
                          {log.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 4: CERTIFICATES ===================== */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900">
            {t('certificateCenter')}
          </h2>

          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map(cert => (
                <div
                  key={cert.id}
                  className="bg-white rounded-2xl p-6 border-2 border-amber-300 shadow-md space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-700" />
                        Grade: {cert.grade} ({cert.scorePercentage}%)
                      </span>
                      <span className="text-xs font-mono text-slate-500 font-bold">
                        {cert.certificateNumber}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 font-serif">
                      {cert.courseName}
                    </h3>

                    <p className="text-xs text-blue-800 font-medium">
                      {cert.courseNameBn}
                    </p>

                    <div className="text-xs text-slate-500 pt-1 space-y-0.5">
                      <p>Recipient: <strong>{cert.studentName}</strong></p>
                      <p>Issue Date: <strong>{cert.issueDate}</strong></p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Online
                    </span>

                    <button
                      onClick={() => setViewingCertificate(cert)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      <span>{t('viewCertificate')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <Award className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No certificates earned yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Complete all course lectures, pass the MCQ evaluation exam, and your official certificate will appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 5: ROUTINE & NOTICES ===================== */}
      {activeTab === 'routine' && (
        <div className="space-y-6">
          <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 bg-blue-700 text-blue-200 text-xs font-bold rounded-full uppercase">
                Live Interactive Classroom
              </span>
              <h3 className="text-lg font-bold text-white">
                Live Class Batch Routine
              </h3>
              <p className="text-xs text-blue-200">
                Regular sessions in Bangladesh Standard Time (BST)
              </p>
            </div>

            <a
              href="https://zoom.us/j/9876543210"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-sm flex items-center gap-2 transition"
            >
              <Video className="w-4 h-4" />
              <span>{t('zoomJoin')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              {language === 'bn' ? 'ইনস্টিটিউট নোটিশ বোর্ড' : 'Official Notice Board'}
            </h3>

            <div className="divide-y divide-slate-100">
              {notices.map(notice => (
                <div key={notice.id} className="py-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    {notice.isPinned && (
                      <span className="px-2 py-0.2 bg-rose-100 text-rose-700 text-[10px] font-bold rounded">
                        PINNED
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-mono">{notice.date}</span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900">
                    {language === 'bn' ? notice.titleBn : notice.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {language === 'bn' ? notice.contentBn : notice.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 6: PROFILE ===================== */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900">
            {t('profile')}
          </h2>

          {profileSavedMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{profileSavedMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('nameLabel')}
              </label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('emailLabel')}
              </label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('phoneLabel')}
              </label>
              <input
                type="tel"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                District / City (বাংলাদেশ জেলা)
              </label>
              <input
                type="text"
                value={profileDistrict}
                onChange={(e) => setProfileDistrict(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition cursor-pointer"
            >
              {t('save')}
            </button>
          </form>
        </div>
      )}

      {/* Certificate Modal */}
      {viewingCertificate && (
        <CertificateView
          certificate={viewingCertificate}
          onClose={() => setViewingCertificate(null)}
        />
      )}
    </div>
  );
};
