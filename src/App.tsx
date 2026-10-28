import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SiteProvider } from './context/SiteContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PublicHome } from './components/PublicHome';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { PublicVerification } from './components/PublicVerification';
import { NoticesPage } from './components/NoticesPage';
import { CourseModal } from './components/CourseModal';
import { AuthModal } from './components/AuthModal';
import { Course } from './types';
import { StorageService } from './services/storage';

const MainAppContent: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();

  const getInitialView = (): string => {
    const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
    if (path === 'admin') return 'admin';
    if (path === 'dashboard') return 'dashboard';
    if (path === 'courses') return 'courses';
    if (path === 'notices') return 'notices';
    if (path === 'verify') return 'verify';
    return 'home';
  };

  const [currentView, setCurrentView] = useState<string>(getInitialView);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Sync with browser URL
  const handleSetCurrentView = (view: string) => {
    setCurrentView(view);
    const targetPath = view === 'home' ? '/' : `/${view}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
      if (path === 'admin') setCurrentView('admin');
      else if (path === 'dashboard') setCurrentView('dashboard');
      else if (path === 'courses') setCurrentView('courses');
      else if (path === 'notices') setCurrentView('notices');
      else if (path === 'verify') setCurrentView('verify');
      else setCurrentView('home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Auth modal
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [preSelectedCourseId, setPreSelectedCourseId] = useState<string>('');

  const handleOpenAuth = (mode: 'login' | 'register' = 'login', courseId: string = '') => {
    setAuthModalMode(mode);
    setPreSelectedCourseId(courseId);
    setAuthModalOpen(true);
  };

  const handleEnrollCourse = async (courseId: string) => {
    if (!currentUser) {
      handleOpenAuth('register', courseId);
    } else {
      if (!currentUser.enrolledCourseIds.includes(courseId)) {
        currentUser.enrolledCourseIds.push(courseId);
        await StorageService.saveUserProfile(currentUser);

        // Create fee record in Firestore
        const courses = await StorageService.getCourses();
        const course = courses.find(c => c.id === courseId);
        if (course) {
          await StorageService.saveFee({
            id: `fee-${currentUser.id}_${course.id}`,
            studentId: currentUser.id,
            studentName: currentUser.name,
            studentEmail: currentUser.email,
            courseId: course.id,
            courseName: course.title,
            totalFee: course.discountBDT || course.feeBDT,
            paidAmount: 0,
            balance: course.discountBDT || course.feeBDT,
            status: 'pending',
            paymentMethod: 'bKash',
            transactionRef: 'PENDING_PAYMENT',
            lastPaymentDate: new Date().toISOString().split('T')[0],
            auditTrail: [
              {
                id: `audit-${Date.now()}`,
                timestamp: new Date().toISOString(),
                action: 'CREATED',
                changedBy: currentUser.email,
                amount: course.discountBDT || course.feeBDT,
                previousBalance: 0,
                newBalance: course.discountBDT || course.feeBDT,
                notes: `Enrolled in ${course.title}`
              }
            ]
          });
        }
      }
      setSelectedCourse(null);
      handleSetCurrentView('dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={handleSetCurrentView}
        onOpenAuth={handleOpenAuth}
        onSelectCourse={(course) => setSelectedCourse(course)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <PublicHome
            onSelectCourse={(course) => setSelectedCourse(course)}
            onOpenAuth={handleOpenAuth}
            setCurrentView={handleSetCurrentView}
          />
        )}

        {currentView === 'courses' && (
          <div className="py-6">
            <PublicHome
              onSelectCourse={(course) => setSelectedCourse(course)}
              onOpenAuth={handleOpenAuth}
              setCurrentView={handleSetCurrentView}
            />
          </div>
        )}

        {currentView === 'notices' && (
          <NoticesPage />
        )}

        {currentView === 'verify' && (
          <PublicVerification />
        )}

        {currentView === 'dashboard' && (
          <StudentDashboard />
        )}

        {currentView === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Course Details Modal */}
      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onEnroll={handleEnrollCourse}
          isEnrolled={Boolean(currentUser?.enrolledCourseIds?.includes(selectedCourse.id))}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        preSelectedCourseId={preSelectedCourseId}
        onSuccessRedirect={(view) => handleSetCurrentView(view)}
      />

      {/* Footer */}
      <Footer
        setCurrentView={handleSetCurrentView}
        onRefreshData={() => handleSetCurrentView('home')}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SiteProvider>
          <MainAppContent />
        </SiteProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

