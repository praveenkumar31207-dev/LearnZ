import { isSupabaseConfigured, supabase } from './supabaseClient';

export interface CloudStorageSyncResult {
  success: boolean;
  message: string;
  syncedAt?: string;
  counts?: {
    profiles?: number;
    materials?: number;
    attempts?: number;
    sessions?: number;
  };
}

/**
 * Cloud Storage Manager for LearnZ / iGOT Karmayogi Platform
 * Handles bidirectional cloud sync with Supabase PostgreSQL & Storage
 */
export const cloudStorage = {
  /**
   * Sync complete user profile state to Supabase cloud
   */
  async syncProfileToCloud(profileData: any): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase cloud storage is not configured' };
    }
    try {
      const { error } = await supabase.from('profiles').upsert(
        {
          email: profileData.email,
          full_name: profileData.fullName,
          role: profileData.role || 'learner',
          designation: profileData.designation,
          department: profileData.department,
          cadre: profileData.cadre,
          current_assignment: profileData.currentAssignment,
          job_role: profileData.jobRole,
          educational_qualification: profileData.educationalQualification,
          work_experience: profileData.workExperience,
          current_competency_levels: profileData.currentCompetencyLevels,
          overall_competency_score: profileData.overallCompetencyScore,
          learning_hours_logged: profileData.learningHoursLogged,
          daily_max_study_hours: profileData.dailyMaxStudyHours,
          streak_days: profileData.streakDays,
          total_xp: profileData.totalXp,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      );
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.warn('Cloud profile sync error:', err);
      return { success: false, error: err.message || 'Profile sync failed' };
    }
  },

  /**
   * Sync study session records to cloud
   */
  async syncStudySessions(sessions: any[]): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured || !sessions || sessions.length === 0) {
      return { success: false, error: 'No sessions or cloud not configured' };
    }
    try {
      const rows = sessions.map((s) => ({
        id: s.id,
        user_id: s.userId,
        subject_id: s.subjectId,
        topic_id: s.topicId,
        planned_duration_mins: s.plannedDurationMins,
        actual_duration_mins: s.actualDurationMins,
        understanding_rating: s.understandingRating,
        focus_score: s.focusScore,
        completed_at: s.completedAt || new Date().toISOString(),
      }));

      const { error } = await supabase.from('study_sessions').upsert(rows, { onConflict: 'id' });
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Sync quiz attempts to cloud
   */
  async syncQuizAttempts(attempts: any[]): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured || !attempts || attempts.length === 0) {
      return { success: false, error: 'No attempts or cloud not configured' };
    }
    try {
      const rows = attempts.map((a) => ({
        id: a.id,
        user_id: a.userId,
        quiz_id: a.quizId,
        score: a.score,
        total_questions: a.totalQuestions,
        accuracy_percentage: a.accuracyPercentage,
        time_spent_seconds: a.timeSpentSeconds,
        completed_at: a.completedAt || new Date().toISOString(),
      }));

      const { error } = await supabase.from('quiz_attempts').upsert(rows, { onConflict: 'id' });
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Upload file material into Supabase Storage Bucket ('learning-materials')
   */
  async uploadFileToCloudStorage(
    bucketName: string,
    filePath: string,
    file: File | Blob
  ): Promise<{ url?: string; error?: string }> {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase cloud storage is not configured' };
    }
    try {
      const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });
      if (error) throw error;

      const { data: publicData } = supabase.storage.from(bucketName).getPublicUrl(data.path);
      return { url: publicData?.publicUrl || '' };
    } catch (err: any) {
      return { error: err.message || 'File upload failed' };
    }
  },

  /**
   * Pull latest user data from cloud if available
   */
  async fetchCloudProfile(email: string): Promise<any | null> {
    if (!isSupabaseConfigured || !email) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Could not fetch cloud profile:', err);
      return null;
    }
  },

  /**
   * Full backup of entire local state to cloud
   */
  async fullCloudBackup(fullState: Record<string, any>): Promise<CloudStorageSyncResult> {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        message: 'Supabase Cloud not configured. Running in secure local offline storage.',
      };
    }

    let syncedCount = 0;
    try {
      if (fullState.profile) {
        await this.syncProfileToCloud(fullState.profile);
        syncedCount++;
      }
      if (fullState.studySessions?.length > 0) {
        await this.syncStudySessions(fullState.studySessions);
      }
      if (fullState.quizAttempts?.length > 0) {
        await this.syncQuizAttempts(fullState.quizAttempts);
      }

      return {
        success: true,
        message: 'Successfully backed up state and profile to Supabase Cloud.',
        syncedAt: new Date().toISOString(),
        counts: {
          profiles: syncedCount,
          sessions: fullState.studySessions?.length || 0,
          attempts: fullState.quizAttempts?.length || 0,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Full cloud backup encountered an error.',
      };
    }
  },
};
