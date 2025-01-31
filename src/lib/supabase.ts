import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'flexflow@1.0.0'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  db: {
    schema: 'public'
  }
});

// Initialize auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session) {
    console.log('Session initialized');
  }
});

// Add error handling for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    // Clear any cached data when user signs out
    console.log('User signed out, clearing cache');
    localStorage.removeItem('supabase.auth.token');
  } else if (event === 'SIGNED_IN') {
    // Initialize user data when signed in
    console.log('User signed in, initializing data');
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('Auth token refreshed');
  }
});

// Add error handling for realtime subscriptions
supabase.realtime.setAuth(supabaseAnonKey);