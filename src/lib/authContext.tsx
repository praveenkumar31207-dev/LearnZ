'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { UserProfile, UserRole } from '@/types';
import { initialProfile, demoTrainerProfile, demoAdminProfile } from './mockData';

interface AuthContextType {
  user: {
    id: string;
    email: string;
    fullName?: string;
    studentId?: string;
    cadre?: string;
    designation?: string;
    role?: UserRole;
  } | null;
  profile: UserProfile;
  isAuthenticated: boolean;
  isLoading: boolean;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  signInWithStudentId: (studentIdOrEmail: string, passwordOrOtp: string, role?: UserRole) => Promise<{ error?: string }>;
  signInWithIgot: (studentIdOrEmail: string, passwordOrOtp: string, role?: UserRole) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string, educationLevel?: any, courseDegree?: string) => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  loginAsDemoUser: (role: UserRole) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AUTH_USER_KEY = 'learnz_college_auth_user_v3';
export const AUTH_PROFILE_KEY = 'learnz_college_user_profile_v3';
export const AUTH_ACTIVE_ROLE_KEY = 'learnz_college_active_role_v3';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{
    id: string;
    email: string;
    fullName?: string;
    studentId?: string;
    cadre?: string;
    designation?: string;
    role?: UserRole;
  } | null>(null);

  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [activeRole, setActiveRoleState] = useState<UserRole>('learner');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from LocalStorage or Supabase
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedUser = localStorage.getItem(AUTH_USER_KEY);
        const savedProfile = localStorage.getItem(AUTH_PROFILE_KEY);
        const savedRole = localStorage.getItem(AUTH_ACTIVE_ROLE_KEY) as UserRole | null;

        if (savedRole && ['learner', 'trainer', 'admin'].includes(savedRole)) {
          setActiveRoleState(savedRole);
        }

        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          if (parsedUser.role) setActiveRoleState(parsedUser.role);
        } else {
          // Default initial college student session
          const defaultStudentUser = {
            id: initialProfile.id,
            email: initialProfile.email,
            fullName: initialProfile.fullName,
            studentId: '21BCS0842',
            cadre: initialProfile.cadre,
            designation: initialProfile.designation,
            role: 'learner' as UserRole,
          };
          setUser(defaultStudentUser);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(defaultStudentUser));
        }

        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        } else {
          setProfile(initialProfile);
          localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(initialProfile));
        }
      } catch (e) {
        console.warn('Failed to parse local auth user', e);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    try {
      localStorage.setItem(AUTH_ACTIVE_ROLE_KEY, role);
      if (user) {
        const updatedUser = { ...user, role };
        setUser(updatedUser);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
      }
    } catch (e) {}
  };

  const signInWithStudentId = async (
    studentIdOrEmail: string,
    passwordOrOtp: string,
    role: UserRole = 'learner'
  ): Promise<{ error?: string }> => {
    setIsLoading(true);

    // Validate student roll number or university email
    if (!studentIdOrEmail.trim()) {
      setIsLoading(false);
      return { error: 'Please enter your Student Roll Number (e.g. 21BCS0842) or University Email.' };
    }

    let targetProfile = initialProfile;
    let targetDesignation = 'Undergraduate Engineering Scholar';
    let targetCadre = 'B.Tech Computer Science & Engineering (Semester 6)';

    if (role === 'trainer') {
      targetProfile = demoTrainerProfile;
      targetDesignation = demoTrainerProfile.designation;
      targetCadre = demoTrainerProfile.cadre;
    } else if (role === 'admin') {
      targetProfile = demoAdminProfile;
      targetDesignation = demoAdminProfile.designation;
      targetCadre = demoAdminProfile.cadre;
    }

    const studentRollNo = studentIdOrEmail.toUpperCase().includes('BCS') || studentIdOrEmail.toUpperCase().startsWith('FAC-') || studentIdOrEmail.toUpperCase().startsWith('DEAN-')
      ? studentIdOrEmail.toUpperCase()
      : studentIdOrEmail.toUpperCase();

    const enteredName = studentIdOrEmail.includes('@')
      ? studentIdOrEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      : studentIdOrEmail.toUpperCase();

    const newUser = {
      id: `usr-${Date.now()}`,
      email: studentIdOrEmail.includes('@') ? studentIdOrEmail : `${studentIdOrEmail.toLowerCase()}@apexuniv.edu`,
      fullName: enteredName,
      studentId: studentRollNo,
      cadre: targetCadre,
      designation: targetDesignation,
      role,
    };

    const newProfile = {
      ...targetProfile,
      id: newUser.id,
      email: newUser.email,
      fullName: enteredName,
      role,
    };

    setUser(newUser);
    setProfile(newProfile);
    setActiveRoleState(role);

    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
      localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(newProfile));
      localStorage.setItem(AUTH_ACTIVE_ROLE_KEY, role);
    } catch (e) {}

    setIsLoading(false);
    return {};
  };

  const signInWithGoogle = async (): Promise<{ error?: string }> => {
    setIsLoading(true);
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined,
          },
        });
        if (error) {
          console.warn('Supabase Google provider returned error:', error.message);
        } else if (data?.url) {
          return {};
        }
      } catch (err: any) {
        console.warn('Supabase Google OAuth error, falling back to local Google session:', err);
      }
    }

    // Fast-track simulated Google authentication session for college student
    const googleUser = {
      id: `usr-google-${Date.now()}`,
      email: 'student.google@apexuniv.edu',
      fullName: 'Aarav Sharma (Google Student)',
      studentId: `21BCS0842`,
      cadre: 'B.Tech CSE - Semester 6',
      designation: 'Undergraduate Engineering Scholar',
      role: 'learner' as UserRole,
    };

    const googleProfile = {
      ...initialProfile,
      id: googleUser.id,
      email: googleUser.email,
      fullName: googleUser.fullName,
      role: 'learner' as UserRole,
    };

    setUser(googleUser);
    setProfile(googleProfile);
    setActiveRoleState('learner');

    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(googleUser));
      localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(googleProfile));
      localStorage.setItem(AUTH_ACTIVE_ROLE_KEY, 'learner');
    } catch (e) {}

    setIsLoading(false);
    return {};
  };

  const signUp = async (
    email: string,
    _password: string,
    fullName: string,
    educationLevel?: any,
    courseDegree?: string
  ): Promise<{ error?: string }> => {
    setIsLoading(true);
    const studentRollNo = `21BCS${Math.floor(1000 + Math.random() * 9000)}`;
    const newUser = {
      id: `usr-reg-${Date.now()}`,
      email,
      fullName: fullName || 'College Engineering Student',
      studentId: studentRollNo,
      cadre: 'B.Tech CSE - 6th Semester',
      designation: 'Undergraduate Engineering Scholar',
      role: 'learner' as UserRole,
    };
    const newProfile = {
      ...initialProfile,
      id: newUser.id,
      email,
      fullName: newUser.fullName,
      educationLevel: educationLevel || 'Undergraduate',
      courseDegree: courseDegree || 'B.Tech Computer Science',
      cadre: newUser.cadre,
      designation: newUser.designation,
    };
    setUser(newUser);
    setProfile(newProfile);
    setActiveRoleState('learner');
    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
      localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(newProfile));
      localStorage.setItem(AUTH_ACTIVE_ROLE_KEY, 'learner');
    } catch (e) {}
    setIsLoading(false);
    return {};
  };

  const resetPassword = async (_email: string): Promise<{ error?: string }> => {
    return {};
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    setUser(null);
    try {
      localStorage.removeItem(AUTH_USER_KEY);
    } catch (e) {}
  };

  const loginAsDemoUser = (role: UserRole = 'learner') => {
    let demoP = initialProfile;
    let demoEmail = 'aarav.sharma@apexuniv.edu';
    let demoRollNo = '21BCS0842';

    if (role === 'trainer') {
      demoP = demoTrainerProfile;
      demoEmail = 'sunita.sharma@apexuniv.edu';
      demoRollNo = 'FAC-CS-104';
    } else if (role === 'admin') {
      demoP = demoAdminProfile;
      demoEmail = 'dean.exams@apexuniv.edu';
      demoRollNo = 'DEAN-ACAD-01';
    }

    const demoUser = {
      id: demoP.id,
      email: demoEmail,
      fullName: demoP.fullName,
      studentId: demoRollNo,
      cadre: demoP.cadre,
      designation: demoP.designation,
      role,
    };

    setUser(demoUser);
    setProfile(demoP);
    setActiveRoleState(role);

    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(demoUser));
      localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(demoP));
      localStorage.setItem(AUTH_ACTIVE_ROLE_KEY, role);
    } catch (e) {}
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isLoading,
        activeRole,
        setActiveRole,
        signInWithStudentId,
        signInWithIgot: signInWithStudentId,
        signInWithGoogle,
        signUp,
        resetPassword,
        signOut,
        loginAsDemoUser,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
