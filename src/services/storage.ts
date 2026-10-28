import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc,
  deleteDoc, query, where, onSnapshot, getDocFromServer
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import {
  User, Course, Exam, ExamSubmission, FeeRecord,
  Certificate, Notice, LessonProgress, FeeAuditLog, SiteSettings
} from '../types';
import { INITIAL_COURSES, INITIAL_EXAMS, INITIAL_NOTICES, DEFAULT_SITE_SETTINGS } from '../data/mockData';

const COLLECTIONS = {
  USERS: 'users',
  ADMINS: 'admins',
  COURSES: 'courses',
  FEES: 'fees',
  EXAMS: 'exams',
  SUBMISSIONS: 'submissions',
  CERTIFICATES: 'certificates',
  NOTICES: 'notices',
  PROGRESS: 'progress',
  SETTINGS: 'settings'
};

export const StorageService = {
  /**
   * Bootstraps initial courses, exams, and notices into Firestore if empty
   */
  async initDefaults() {
    try {
      // Check courses
      const coursesSnap = await getDocs(collection(db, COLLECTIONS.COURSES));
      if (coursesSnap.empty) {
        for (const c of INITIAL_COURSES) {
          await setDoc(doc(db, COLLECTIONS.COURSES, c.id), c);
        }
      }

      // Check exams
      const examsSnap = await getDocs(collection(db, COLLECTIONS.EXAMS));
      if (examsSnap.empty) {
        for (const ex of INITIAL_EXAMS) {
          await setDoc(doc(db, COLLECTIONS.EXAMS, ex.id), ex);
        }
      }

      // Check notices
      const noticesSnap = await getDocs(collection(db, COLLECTIONS.NOTICES));
      if (noticesSnap.empty) {
        for (const n of INITIAL_NOTICES) {
          await setDoc(doc(db, COLLECTIONS.NOTICES, n.id), n);
        }
      }

      // Check settings
      const settingsSnap = await getDoc(doc(db, COLLECTIONS.SETTINGS, 'general'));
      if (!settingsSnap.exists()) {
        await setDoc(doc(db, COLLECTIONS.SETTINGS, 'general'), DEFAULT_SITE_SETTINGS);
      }
    } catch (err) {
      console.warn('Initial seed deferred until connection ready:', err);
    }
  },

  // ------------------- USERS & ROLES -------------------
  async getUser(userId: string): Promise<User | null> {
    try {
      const snap = await getDoc(doc(db, COLLECTIONS.USERS, userId));
      if (!snap.exists()) return null;
      return snap.data() as User;
    } catch (error) {
      console.warn(`Error fetching user ${userId} from Firestore:`, error);
      return null;
    }
  },

  async isUserAdmin(userId: string, email: string): Promise<boolean> {
    const cleanEmail = (email || '').trim().toLowerCase();
    const isPrimaryAdmin = cleanEmail === 'nisadandnisanfoodltd@gmail.com';

    try {
      if (userId) {
        // If primary authorized admin logs in, ensure their entry in /admins/{userId} is recorded in Firestore
        if (isPrimaryAdmin) {
          try {
            await setDoc(doc(db, COLLECTIONS.ADMINS, userId), {
              id: userId,
              email: cleanEmail,
              role: 'admin',
              verified: true,
              updatedAt: new Date().toISOString()
            }, { merge: true });
          } catch (writeErr) {
            console.warn('Could not write /admins doc (may already exist or offline):', writeErr);
          }
          return true;
        }

        // Check if user is registered in the Firestore admins registry
        const adminSnap = await getDoc(doc(db, COLLECTIONS.ADMINS, userId));
        return adminSnap.exists();
      }
    } catch (e) {
      console.warn('Admin check error:', e);
      if (isPrimaryAdmin) return true;
    }
    return isPrimaryAdmin;
  },

  async saveUserProfile(user: User): Promise<void> {
    try {
      await setDoc(doc(db, COLLECTIONS.USERS, user.id), user, { merge: true });
    } catch (error) {
      console.warn('Error saving user profile to Firestore:', error);
    }
  },

  async getAllStudents(): Promise<User[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.USERS));
      const list: User[] = [];
      snap.forEach(d => {
        const u = d.data() as User;
        if (u.role === 'student') list.push(u);
      });
      return list;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, COLLECTIONS.USERS);
      return [];
    }
  },

  async deleteStudent(studentId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.USERS, studentId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.USERS}/${studentId}`);
    }
  },

  // ------------------- COURSES & CURRICULUM -------------------
  async getCourses(): Promise<Course[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.COURSES));
      if (snap.empty) return INITIAL_COURSES;
      const list: Course[] = [];
      snap.forEach(d => list.push(d.data() as Course));
      return list;
    } catch {
      return INITIAL_COURSES;
    }
  },

  async saveCourse(course: Course): Promise<void> {
    try {
      await setDoc(doc(db, COLLECTIONS.COURSES, course.id), course);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.COURSES}/${course.id}`);
    }
  },

  async deleteCourse(courseId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.COURSES, courseId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.COURSES}/${courseId}`);
    }
  },

  // ------------------- LESSON PROGRESS -------------------
  async getLessonProgress(studentId: string, courseId: string): Promise<LessonProgress> {
    const key = `${studentId}_${courseId}`;
    try {
      const snap = await getDoc(doc(db, COLLECTIONS.PROGRESS, key));
      if (snap.exists()) return snap.data() as LessonProgress;
    } catch {}

    return {
      studentId,
      courseId,
      completedLessonIds: [],
      updatedAt: new Date().toISOString()
    };
  },

  async toggleLessonProgress(studentId: string, courseId: string, lessonId: string): Promise<LessonProgress> {
    const key = `${studentId}_${courseId}`;
    let prog = await this.getLessonProgress(studentId, courseId);
    if (prog.completedLessonIds.includes(lessonId)) {
      prog.completedLessonIds = prog.completedLessonIds.filter(id => id !== lessonId);
    } else {
      prog.completedLessonIds.push(lessonId);
    }
    prog.lastAccessedLessonId = lessonId;
    prog.updatedAt = new Date().toISOString();

    try {
      await setDoc(doc(db, COLLECTIONS.PROGRESS, key), prog);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.PROGRESS}/${key}`);
    }
    return prog;
  },

  // ------------------- EXAMS & SECURE ANSWER KEY -------------------
  async getExams(): Promise<Exam[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.EXAMS));
      if (snap.empty) return INITIAL_EXAMS;
      const list: Exam[] = [];
      snap.forEach(d => list.push(d.data() as Exam));
      return list;
    } catch {
      return INITIAL_EXAMS;
    }
  },

  async saveExam(exam: Exam): Promise<void> {
    try {
      await setDoc(doc(db, COLLECTIONS.EXAMS, exam.id), exam);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.EXAMS}/${exam.id}`);
    }
  },

  async deleteExam(examId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.EXAMS, examId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.EXAMS}/${examId}`);
    }
  },

  /**
   * Secure getter for student: strips correctOptionId and explanation
   */
  async getStudentExam(examId: string): Promise<any | null> {
    const exams = await this.getExams();
    const ex = exams.find(e => e.id === examId);
    if (!ex) return null;
    return {
      ...ex,
      questions: ex.questions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        questionTextBn: q.questionTextBn,
        options: q.options
      }))
    };
  },

  async submitExam(
    examId: string,
    studentId: string,
    studentName: string,
    userAnswers: Record<string, string>
  ): Promise<{ submission: ExamSubmission; answerKeys: Record<string, { correctOptionId: string; explanation?: string }> }> {
    const exams = await this.getExams();
    const exam = exams.find(e => e.id === examId);
    if (!exam) throw new Error('Exam not found');

    let correctCount = 0;
    const answerKeys: Record<string, { correctOptionId: string; explanation?: string }> = {};

    exam.questions.forEach(q => {
      answerKeys[q.id] = {
        correctOptionId: q.correctOptionId,
        explanation: q.explanation || q.explanationBn
      };
      if (userAnswers[q.id] === q.correctOptionId) {
        correctCount++;
      }
    });

    const totalQuestions = exam.questions.length;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const score = Math.round((correctCount / totalQuestions) * exam.totalMarks);
    const passed = percentage >= exam.passPercentage;

    const subId = `sub-${Date.now()}`;
    const submission: ExamSubmission = {
      id: subId,
      examId: exam.id,
      examTitle: exam.title,
      studentId,
      studentName,
      score,
      totalQuestions,
      correctCount,
      percentage,
      passed,
      submittedAt: new Date().toISOString(),
      userAnswers
    };

    try {
      await setDoc(doc(db, COLLECTIONS.SUBMISSIONS, subId), submission);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.SUBMISSIONS}/${subId}`);
    }

    return { submission, answerKeys };
  },

  async getSubmissionsForStudent(studentId: string): Promise<ExamSubmission[]> {
    try {
      const q = query(collection(db, COLLECTIONS.SUBMISSIONS), where('studentId', '==', studentId));
      const snap = await getDocs(q);
      const list: ExamSubmission[] = [];
      snap.forEach(d => list.push(d.data() as ExamSubmission));
      return list;
    } catch {
      return [];
    }
  },

  // ------------------- FEES & AUDIT LEDGER -------------------
  async getFees(): Promise<FeeRecord[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.FEES));
      const list: FeeRecord[] = [];
      snap.forEach(d => list.push(d.data() as FeeRecord));
      return list;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, COLLECTIONS.FEES);
      return [];
    }
  },

  async getFeesForStudent(studentId: string): Promise<FeeRecord[]> {
    try {
      const q = query(collection(db, COLLECTIONS.FEES), where('studentId', '==', studentId));
      const snap = await getDocs(q);
      const list: FeeRecord[] = [];
      snap.forEach(d => list.push(d.data() as FeeRecord));
      return list;
    } catch {
      return [];
    }
  },

  async saveFee(fee: FeeRecord): Promise<void> {
    try {
      await setDoc(doc(db, COLLECTIONS.FEES, fee.id), fee);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.FEES}/${fee.id}`);
    }
  },

  async submitPaymentReceipt(
    feeId: string,
    amount: number,
    paymentMethod: FeeRecord['paymentMethod'],
    transactionRef: string,
    senderPhone: string,
    studentEmail: string
  ): Promise<void> {
    const feeSnap = await getDoc(doc(db, COLLECTIONS.FEES, feeId));
    if (!feeSnap.exists()) throw new Error('Fee record not found');
    const fee = feeSnap.data() as FeeRecord;

    const auditEntry: FeeAuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'PAYMENT_ADDED',
      changedBy: studentEmail,
      amount,
      previousBalance: fee.balance,
      newBalance: fee.balance,
      reference: transactionRef,
      notes: `Receipt submitted via ${paymentMethod} (${senderPhone}) - Pending verification.`
    };

    fee.paymentMethod = paymentMethod;
    fee.transactionRef = transactionRef;
    fee.senderPhone = senderPhone;
    fee.status = 'pending';
    fee.lastPaymentDate = new Date().toISOString().split('T')[0];
    fee.auditTrail = fee.auditTrail || [];
    fee.auditTrail.push(auditEntry);

    await this.saveFee(fee);
  },

  async verifyPayment(
    feeId: string,
    adminEmail: string,
    isApproved: boolean,
    verifiedAmount?: number,
    notes?: string
  ): Promise<void> {
    const feeSnap = await getDoc(doc(db, COLLECTIONS.FEES, feeId));
    if (!feeSnap.exists()) throw new Error('Fee record not found');
    const fee = feeSnap.data() as FeeRecord;

    const prevBalance = fee.balance;
    const amountApproved = verifiedAmount !== undefined ? verifiedAmount : (fee.totalFee - fee.paidAmount);

    if (isApproved) {
      const newPaid = Math.min(fee.totalFee, fee.paidAmount + amountApproved);
      const newBalance = Math.max(0, fee.totalFee - newPaid);

      const auditEntry: FeeAuditLog = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'VERIFIED',
        changedBy: adminEmail,
        amount: amountApproved,
        previousBalance: prevBalance,
        newBalance: newBalance,
        reference: fee.transactionRef,
        notes: notes || `Approved & verified by administrator (${adminEmail}).`
      };

      fee.paidAmount = newPaid;
      fee.balance = newBalance;
      fee.status = 'verified';
      fee.auditTrail = fee.auditTrail || [];
      fee.auditTrail.push(auditEntry);
    } else {
      const auditEntry: FeeAuditLog = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'REJECTED',
        changedBy: adminEmail,
        amount: 0,
        previousBalance: prevBalance,
        newBalance: prevBalance,
        reference: fee.transactionRef,
        notes: notes || 'Rejected by administrator: Transaction reference mismatch.'
      };
      fee.status = 'rejected';
      fee.auditTrail = fee.auditTrail || [];
      fee.auditTrail.push(auditEntry);
    }

    await this.saveFee(fee);
  },

  // ------------------- CERTIFICATES -------------------
  async getCertificates(): Promise<Certificate[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.CERTIFICATES));
      const list: Certificate[] = [];
      snap.forEach(d => list.push(d.data() as Certificate));
      return list;
    } catch {
      return [];
    }
  },

  async getCertificatesForStudent(studentId: string): Promise<Certificate[]> {
    try {
      const q = query(collection(db, COLLECTIONS.CERTIFICATES), where('studentId', '==', studentId));
      const snap = await getDocs(q);
      const list: Certificate[] = [];
      snap.forEach(d => list.push(d.data() as Certificate));
      return list;
    } catch {
      return [];
    }
  },

  async getCertificateByNumber(certNumber: string): Promise<Certificate | null> {
    try {
      const q = query(
        collection(db, COLLECTIONS.CERTIFICATES),
        where('certificateNumber', '==', certNumber.trim().toUpperCase())
      );
      const snap = await getDocs(q);
      if (snap.empty) return null;
      return snap.docs[0].data() as Certificate;
    } catch {
      return null;
    }
  },

  async issueCertificate(cert: Omit<Certificate, 'id' | 'certificateNumber' | 'verificationUrl'>): Promise<Certificate> {
    const certId = `cert-${Date.now()}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const code = `AHFC-2025-${cert.courseId.replace('course-', '').substring(0, 2).toUpperCase()}-${randomSuffix}`;
    
    const newCert: Certificate = {
      ...cert,
      id: certId,
      certificateNumber: code,
      verificationUrl: `${window.location.origin}/verify?id=${code}`
    };

    try {
      await setDoc(doc(db, COLLECTIONS.CERTIFICATES, certId), newCert);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.CERTIFICATES}/${certId}`);
    }
    return newCert;
  },

  async deleteCertificate(certId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.CERTIFICATES, certId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.CERTIFICATES}/${certId}`);
    }
  },

  // ------------------- NOTICES -------------------
  async getNotices(): Promise<Notice[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.NOTICES));
      if (snap.empty) return INITIAL_NOTICES;
      const list: Notice[] = [];
      snap.forEach(d => list.push(d.data() as Notice));
      return list;
    } catch {
      return INITIAL_NOTICES;
    }
  },

  async saveNotice(notice: Notice): Promise<void> {
    try {
      await setDoc(doc(db, COLLECTIONS.NOTICES, notice.id), notice);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.NOTICES}/${notice.id}`);
    }
  },

  async deleteNotice(noticeId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.NOTICES, noticeId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.NOTICES}/${noticeId}`);
    }
  },

  // ------------------- SITE SETTINGS & CONTENT -------------------
  async getSiteSettings(): Promise<SiteSettings> {
    try {
      const snap = await getDoc(doc(db, COLLECTIONS.SETTINGS, 'general'));
      if (snap.exists()) {
        return { ...DEFAULT_SITE_SETTINGS, ...snap.data() } as SiteSettings;
      }
    } catch (e) {
      console.warn('Could not load site settings from Firestore:', e);
    }
    return DEFAULT_SITE_SETTINGS;
  },

  async saveSiteSettings(settings: SiteSettings): Promise<void> {
    try {
      await setDoc(doc(db, COLLECTIONS.SETTINGS, 'general'), {
        ...settings,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.SETTINGS}/general`);
    }
  },

  // ------------------- EXAM SUBMISSIONS -------------------
  async getAllSubmissions(): Promise<ExamSubmission[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.SUBMISSIONS));
      const list: ExamSubmission[] = [];
      snap.forEach(d => list.push(d.data() as ExamSubmission));
      return list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    } catch {
      return [];
    }
  }
};
