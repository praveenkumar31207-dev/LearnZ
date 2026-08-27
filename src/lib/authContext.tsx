'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { UserProfile, EducationLevel, PreferredStudyTime } from '@/types';
import { initialProfile } from './mockData';

interface AuthContextType {
  user: {
    id: string;
    email: string;
    fullName?: string;
  } | null;
  profile: UserProfile;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    pass: string,
    fullName: string,
    educationLevel?: EducationLevel,
    courseDegree?: string
  ) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  loginAsDemoUser: (demoName?: string, demoEmail?: string) => void;
  resetPassword: (email: string) => Promise<{ error?: string; success?: boolean }>;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'cognistudy_auth_user_v1';
const AUTH_PROFILE_KEY = 'cognistudy_user_profile_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string; fullName?: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    const initAuth = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            const u = data.session.user;
            setUser({
              id: u.id,
              email: u.email || '',
              fullName: u.user_metadata?.full_name || 'Student',
            });

            // Fetch profile from supabase
            const { data: profData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', u.id)
              .single();

            if (profData) {
              setProfile({
                id: profData.id,
                email: profData.email,
                fullName: profData.full_name,
                educationLevel: profData.education_level || 'Undergraduate',
                courseDegree: profData.course_degree || 'Computer Science',
                currentSemester: profData.current_semester || 'Semester 4',
                targetGpaGrade: profData.target_gpa_grade || '9.0 CGPA',
                dailyMaxStudyHours: Number(profData.daily_max_study_hours) || 6.0,
                preferredStudyTime: profData.preferred_study_time || 'evening',
                pomodoroFocusMins: profData.pomodoro_focus_mins || 50,
                pomodoroBreakMins: profData.pomodoro_break_mins || 10,
                longBreakMins: profData.long_break_mins || 20,
                stabilityThresholdMins: profData.stability_threshold_mins || 10,
                streakDays: profData.streak_days || 1,
                totalXp: profData.total_xp || 100,
                onboardingCompleted: profData.onboarding_completed || false,
              });
            }
          }
        } catch (e) {
          console.warn('Supabase session fetch error, fallback to local', e);
        }
      } else {
        // Local storage session check
        try {
          const savedUser = localStorage.getItem(AUTH_USER_KEY);
          const savedProfile = localStorage.getItem(AUTH_PROFILE_KEY);

          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            // Default demo guest session so app works seamlessly immediately
            const demoUser = {
              id: initialProfile.id,
              email: initialProfile.email,
              fullName: initialProfile.fullName,
            };
            setUser(demoUser);
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(demoUser));
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
      }
      setIsLoading(false);
    };

    initAuth();

    // Listen to Supabase auth changes
    if (isSupabaseConfigured) {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              fullName: session.user.user_metadata?.full_name || 'Student',
            });
          } else {
            setUser(null);
          }
        }
      );
      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  const signIn = async (email: string, pass: string) => {
    setIsLoading(true);
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass,
        });
        if (error) {
          setIsLoading(false);
          return { error: error.message };
        }
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            fullName: data.user.user_metadata?.full_name || 'Student',
          });
        }
        setIsLoading(false);
        return {};
      } catch (err: any) {
        setIsLoading(false);
        return { error: err.message || 'Login failed' };
      }
    } else {
      // Local Auth validation
      const newUser = {
        id: `user-${email.replace(/[^a-zA-Z0-9]/g, '') || Date.now()}`,
        email,
        fullName: email.split('@')[0],
      };
      const updatedProfile: UserProfile = {
        ...initialProfile,
        id: newUser.id,
        email,
        fullName: newUser.fullName,
      };

      setUser(newUser);
      setProfile(updatedProfile);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
      localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(updatedProfile));
      setIsLoading(false);
      return {};
    }
  };

  const signUp = async (
    email: string,
    pass: string,
    fullName: string,
    educationLevel?: EducationLevel,
    courseDegree?: string
  ) => {
    setIsLoading(true);
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) {
          setIsLoading(false);
          return { error: error.message };
        }

        if (data.user) {
          // Insert initial row in public.profiles table
          await supabase.from('profiles').insert([
            {
              id: data.user.id,
              email,
              full_name: fullName,
              education_level: educationLevel || 'Undergraduate',
              course_degree: courseDegree || 'Engineering',
            },
          ]);

          setUser({
            id: data.user.id,
            email: data.user.email || '',
            fullName,
          });
        }
        setIsLoading(false);
        return {};
      } catch (err: any) {
        setIsLoading(false);
        return { error: err.message || 'Sign up failed' };
      }
    } else {
      // Local Sign Up
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        fullName,
      };
      const newProfile: UserProfile = {
        ...initialProfile,
        id: newUser.id,
        email,
        fullName,
        educationLevel: educationLevel || 'Undergraduate',
        courseDegree: courseDegree || 'B.Tech in Computer Science',
      };

      setUser(newUser);
      setProfile(newProfile);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
      localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(newProfile));
      setIsLoading(false);
      return {};
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  const loginAsDemoUser = (demoName: string = 'Alex Dev', demoEmail: string = 'student@cognistudy.ai') => {
    const demoUser = {
      id: initialProfile.id,
      email: demoEmail,
      fullName: demoName,
    };
    setUser(demoUser);
    setProfile({
      ...initialProfile,
      fullName: demoName,
      email: demoEmail,
    });
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(demoUser));
    localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(initialProfile));
  };

  const resetPassword = async (email: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) return { error: error.message };
    }
    return { success: true };
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(next));

      if (isSupabaseConfigured && user) {
        supabase
          .from('profiles')
          .update({
            full_name: next.fullName,
            education_level: next.educationLevel,
            course_degree: next.courseDegree,
            current_semester: next.currentSemester,
            target_gpa_grade: next.targetGpaGrade,
            daily_max_study_hours: next.dailyMaxStudyHours,
            preferred_study_time: next.preferredStudyTime,
            pomodoro_focus_mins: next.pomodoroFocusMins,
            pomodoro_break_mins: next.pomodoroBreakMins,
          })
          .eq('id', user.id)
          .then(() => {});
      }
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: Boolean(user),
        isLoading,
        signIn,
        signUp,
        signOut,
        loginAsDemoUser,
        resetPassword,
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
