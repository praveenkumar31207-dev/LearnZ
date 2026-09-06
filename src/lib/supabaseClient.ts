import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kokbkmdsxlcdxfzekdgk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtva2JrbWRzeGxjZHhmemVrZGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4MTk3NDgsImV4cCI6MjEwMzM5NTc0OH0.TUDk_0RLAUXoL0p3cWd3QIbLcdvAHou5EXFcxOOFDBs';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

// Connected Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper to check live database status and table availability
 */
export async function checkBackendConnection(): Promise<{
  connected: boolean;
  hasTables: boolean;
  message: string;
}> {
  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    if (!error) {
      return {
        connected: true,
        hasTables: true,
        message: 'Connected to live Supabase database with schema active.',
      };
    }

    if (error.code === 'PGRST205') {
      return {
        connected: true,
        hasTables: false,
        message: "Connected to Supabase project, but tables need to be created in the SQL Editor.",
      };
    }

    return {
      connected: false,
      hasTables: false,
      message: error.message || 'Connection error',
    };
  } catch (err: any) {
    return {
      connected: false,
      hasTables: false,
      message: err?.message || 'Network error',
    };
  }
}
