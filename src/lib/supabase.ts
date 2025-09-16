import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Helper function to get current user from our users table
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('google_id', user.id)
    .single();

  return userData;
};

// Helper function to create or update user in our users table
export const upsertUser = async (authUser: any) => {
  const { data, error } = await supabase
    .from('users')
    .upsert({
      google_id: authUser.id,
      email: authUser.email,
      name: authUser.user_metadata?.full_name || authUser.email,
      profile_picture: authUser.user_metadata?.avatar_url,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'google_id'
    })
    .select()
    .single();

  return { data, error };
};