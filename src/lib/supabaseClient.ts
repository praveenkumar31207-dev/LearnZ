import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

// Connected Supabase client (or mock client if not configured)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://mock-skill-intelligence.supabase.co', 'mock-anon-key-local-only');

/**
 * Helper to check live database status and table availability
 */
export async function checkBackendConnection(): Promise<{
  connected: boolean;
  hasTables: boolean;
  message: string;
}> {
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network error';
    return {
      connected: false,
      hasTables: false,
      message,
    };
  }
}
