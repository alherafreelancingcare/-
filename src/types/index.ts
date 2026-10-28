export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  name: string;
  nameBn?: string;
  email: string;
  role: UserRole;
  phone?: string;
  district?: string;
  avatar?: string;
  enrolledCourseIds: string[];
  joinDate: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  titleBn: string;
  durationMinutes: number;
  videoUrl: string; // Embeddable video URL
  description: string;
  descriptionBn: string;
  studyMaterialUrl?: string; // PDF link or notes
  isFreePreview?: boolean;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  titleBn: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  titleBn: string;
  subtitle: string;
  subtitleBn: string;
  category: 'digital-marketing' | 'graphic-design' | 'excel-analytics' | 'email-marketing';
  categoryLabel: string;
  categoryLabelBn: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: string;
  instructorRole: string;
  durationWeeks: number;
  totalHours: number;
  feeBDT: number;
  discountBDT?: number;
  thumbnail: string;
  badge?: string;
  rating: number;
  enrolledCount: number;
  description: string;
  descriptionBn: string;
  modules: CourseModule[];
  features: string[];
  featuresBn: string[];
  prerequisites: string;
  prerequisitesBn: string;
  batchNumber: string;
  nextBatchStart: string;
}

export interface LessonProgress {
  studentId: string;
  courseId: string;
  completedLessonIds: string[];
  lastAccessedLessonId?: string;
  updatedAt: string;
}

export interface ExamOption {
  id: string;
  text: string;
  textBn: string;
}

export interface ExamQuestion {
  id: string;
  questionText: string;
  questionTextBn: string;
  options: ExamOption[];
  correctOptionId: string;
  explanation?: string;
  explanationBn?: string;
}

export interface Exam {
  id: string;
  courseId: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  durationMinutes: number;
  passPercentage: number;
  totalMarks: number;
  questions: ExamQuestion[];
  isActive: boolean;
  createdAt: string;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  percentage: number;
  passed: boolean;
  submittedAt: string;
  userAnswers: Record<string, string>;
}

export type PaymentMethod = 'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer' | 'Cash';
export type PaymentStatus = 'verified' | 'pending' | 'rejected';

export interface FeeAuditLog {
  id: string;
  timestamp: string;
  action: 'CREATED' | 'PAYMENT_ADDED' | 'VERIFIED' | 'REJECTED' | 'ADJUSTED';
  changedBy: string;
  amount: number;
  previousBalance: number;
  newBalance: number;
  notes?: string;
  reference?: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseName: string;
  totalFee: number;
  paidAmount: number;
  balance: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionRef: string;
  senderPhone?: string;
  lastPaymentDate: string;
  auditTrail: FeeAuditLog[];
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseName: string;
  courseNameBn: string;
  issueDate: string;
  grade: 'A+' | 'A' | 'B+' | 'B';
  scorePercentage: number;
  verified: boolean;
  directorName: string;
  instructorName: string;
  verificationUrl: string;
}

export interface Notice {
  id: string;
  title: string;
  titleBn: string;
  content: string;
  contentBn: string;
  category: 'routine' | 'exam' | 'general' | 'event';
  date: string;
  targetCourseId?: string;
  isPinned?: boolean;
  meetingLink?: string;
}

export interface SiteSettings {
  id: string;
  heroBadgeBn: string;
  heroBadgeEn: string;
  heroTitleBn: string;
  heroTitleEn: string;
  heroSubtitleBn: string;
  heroSubtitleEn: string;
  heroBannerUrl: string;
  statStudents: string;
  statSuccessRate: string;
  statBatches: string;
  statSupport: string;
  hotline: string;
  whatsapp: string;
  emailContact: string;
  instituteLocationBn: string;
  instituteLocationEn: string;
  officeHoursBn: string;
  officeHoursEn: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  admissionsNoticeBn: string;
  admissionsNoticeEn: string;
  updatedAt: string;
}

