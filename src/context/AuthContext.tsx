import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut,
  sendPasswordResetEmail, signInWithPopup, User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider, testConnection } from '../services/firebase';
import { StorageService } from '../services/storage';
import { User, UserRole, FeeRecord } from '../types';

interface AuthContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  isAdmin: boolean;
  isStudent: boolean;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; isAdmin?: boolean; message?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; isAdmin?: boolean; message?: string }>;
  registerWithEmail: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    courseId: string;
  }) => Promise<{ success: boolean; isAdmin?: boolean; message?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize and listen to Auth state changes
  useEffect(() => {
    testConnection();
    StorageService.initDefaults();

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      try {
        setFirebaseUser(fbUser);
        if (fbUser) {
          const cleanEmail = (fbUser.email || '').trim().toLowerCase();
          const adminCheck = (cleanEmail === 'nisadandnisanfoodltd@gmail.com') ||
            (await StorageService.isUserAdmin(fbUser.uid, fbUser.email || ''));
          
          setIsAdmin(adminCheck);

          let userProfile = await StorageService.getUser(fbUser.uid);
          if (!userProfile) {
            // Create initial user profile
            userProfile = {
              id: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || (adminCheck ? 'Admin' : 'Student'),
              email: fbUser.email || '',
              role: adminCheck ? 'admin' : 'student',
              phone: fbUser.phoneNumber || '',
              avatar: fbUser.photoURL || undefined,
              enrolledCourseIds: [],
              joinDate: new Date().toISOString().split('T')[0]
            };
            StorageService.saveUserProfile(userProfile).catch(console.warn);
          } else {
            // Sync role
            if (adminCheck && userProfile.role !== 'admin') {
              userProfile.role = 'admin';
              StorageService.saveUserProfile(userProfile).catch(console.warn);
            }
          }
          setCurrentUser(userProfile);
        } else {
          setCurrentUser(null);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Error during onAuthStateChanged:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const refreshUser = async () => {
    if (firebaseUser) {
      const u = await StorageService.getUser(firebaseUser.uid);
      if (u) {
        const isAdm = (firebaseUser.email?.trim().toLowerCase() === 'nisadandnisanfoodltd@gmail.com') ||
          (await StorageService.isUserAdmin(firebaseUser.uid, firebaseUser.email || ''));
        setIsAdmin(isAdm);
        setCurrentUser(u);
      }
    }
  };

  const loginWithEmail = async (email: string, password: string): Promise<{ success: boolean; isAdmin?: boolean; message?: string }> => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const isAdm = (cred.user.email?.trim().toLowerCase() === 'nisadandnisanfoodltd@gmail.com') ||
        (await StorageService.isUserAdmin(cred.user.uid, cred.user.email || ''));
      
      setIsAdmin(isAdm);
      let userProfile = await StorageService.getUser(cred.user.uid);
      if (!userProfile) {
        userProfile = {
          id: cred.user.uid,
          name: cred.user.displayName || cred.user.email?.split('@')[0] || (isAdm ? 'Admin' : 'Student'),
          email: cred.user.email || '',
          role: isAdm ? 'admin' : 'student',
          phone: cred.user.phoneNumber || '',
          avatar: cred.user.photoURL || undefined,
          enrolledCourseIds: [],
          joinDate: new Date().toISOString().split('T')[0]
        };
        StorageService.saveUserProfile(userProfile).catch(console.warn);
      }
      setCurrentUser(userProfile);
      return { success: true, isAdmin: isAdm };
    } catch (err: any) {
      console.error('Email Login Error:', err);
      let msg = err.message || 'Login failed';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।';
      } else if (err.code === 'auth/user-not-found') {
        msg = 'এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি।';
      } else if (err.code === 'auth/operation-not-allowed') {
        msg = 'Email/Password sign-in is not enabled in Firebase Console. Please use Google Sign-In or enable Email/Password provider.';
      }
      return { success: false, message: msg };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; isAdmin?: boolean; message?: string }> => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const isAdm = (cred.user.email?.trim().toLowerCase() === 'nisadandnisanfoodltd@gmail.com') ||
        (await StorageService.isUserAdmin(cred.user.uid, cred.user.email || ''));
      
      setIsAdmin(isAdm);
      let userProfile = await StorageService.getUser(cred.user.uid);
      if (!userProfile) {
        userProfile = {
          id: cred.user.uid,
          name: cred.user.displayName || cred.user.email?.split('@')[0] || (isAdm ? 'Admin' : 'Student'),
          email: cred.user.email || '',
          role: isAdm ? 'admin' : 'student',
          phone: cred.user.phoneNumber || '',
          avatar: cred.user.photoURL || undefined,
          enrolledCourseIds: [],
          joinDate: new Date().toISOString().split('T')[0]
        };
        StorageService.saveUserProfile(userProfile).catch(console.warn);
      }
      setCurrentUser(userProfile);
      return { success: true, isAdmin: isAdm };
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      return { success: false, message: err.message || 'Google Sign-In was cancelled or failed.' };
    }
  };

  const registerWithEmail = async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    courseId: string;
  }): Promise<{ success: boolean; isAdmin?: boolean; message?: string }> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, data.email.trim(), data.password);
      const isAdm = await StorageService.isUserAdmin(cred.user.uid, data.email.trim());

      const newUser: User = {
        id: cred.user.uid,
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        role: isAdm ? 'admin' : 'student',
        phone: data.phone.trim(),
        district: 'Dhaka',
        enrolledCourseIds: data.courseId ? [data.courseId] : [],
        joinDate: new Date().toISOString().split('T')[0]
      };

      await StorageService.saveUserProfile(newUser);

      // Create initial fee record if course selected
      if (data.courseId) {
        const courses = await StorageService.getCourses();
        const course = courses.find(c => c.id === data.courseId);
        if (course) {
          const feeRec: FeeRecord = {
            id: `fee-${cred.user.uid}_${course.id}`,
            studentId: newUser.id,
            studentName: newUser.name,
            studentEmail: newUser.email,
            courseId: course.id,
            courseName: course.title,
            totalFee: course.discountBDT || course.feeBDT,
            paidAmount: 0,
            balance: course.discountBDT || course.feeBDT,
            status: 'pending',
            paymentMethod: 'bKash',
            transactionRef: 'NEW_REGISTRATION',
            lastPaymentDate: new Date().toISOString().split('T')[0],
            auditTrail: [
              {
                id: `audit-${Date.now()}`,
                timestamp: new Date().toISOString(),
                action: 'CREATED',
                changedBy: newUser.email,
                amount: course.discountBDT || course.feeBDT,
                previousBalance: 0,
                newBalance: course.discountBDT || course.feeBDT,
                notes: 'Student registered and enrolled via Firebase Auth.'
              }
            ]
          };
          await StorageService.saveFee(feeRec);
        }
      }

      setCurrentUser(newUser);
      setIsAdmin(isAdm);
      return { success: true, isAdmin: isAdm };
    } catch (err: any) {
      console.error('Registration Error:', err);
      let msg = err.message || 'Registration failed';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে। অনুগ্রহ করে লগইন করুন।';
      } else if (err.code === 'auth/weak-password') {
        msg = 'পাসওয়ার্ডটি অত্যন্ত সহজ। অনুগ্রহ করে অন্তত ৬ অক্ষরের শক্তিশালী পাসওয়ার্ড দিন।';
      } else if (err.code === 'auth/operation-not-allowed') {
        msg = 'Email/Password registration is not yet enabled in Firebase Console. Please sign in with Google or enable Email/Password provider.';
      }
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setIsAdmin(false);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message?: string }> => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return {
        success: true,
        message: 'পাসওয়ার্ড রিসেট লিংকটি আপনার ইমেইলে পাঠিয়ে দেওয়া হয়েছে। অনুগ্রহ করে ইনবক্স অথবা স্প্যাম ফোল্ডার চেক করুন।'
      };
    } catch (err: any) {
      console.error('Reset Password Error:', err);
      let msg = err.message || 'Could not send reset email';
      if (err.code === 'auth/user-not-found') {
        msg = 'এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি।';
      }
      return { success: false, message: msg };
    }
  };

  const isStudent = currentUser?.role === 'student' && !isAdmin;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        isAdmin,
        isStudent,
        loading,
        loginWithEmail,
        loginWithGoogle,
        registerWithEmail,
        logout,
        resetPassword,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
