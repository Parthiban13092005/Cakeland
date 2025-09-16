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
    .eq('id', user.id)
    .single();

  return userData;
};

// Helper function to create user profile after signup
export const createUserProfile = async (authUser: any, additionalData: any) => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: authUser.id,
      email: authUser.email,
      name: additionalData.name,
      phone: additionalData.phone,
      loyalty_points: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  return { data, error };
};

// Admin authentication
export const adminSignIn = async (username: string, password: string) => {
  // In a real app, you'd verify against the admin_users table
  // For now, we'll use the hardcoded credentials
  if (username === 'AdminPRG' && password === 'Cake@123') {
    return { success: true, admin: { username, email: 'admin@prgcakeland.com' } };
  }
  return { success: false, error: 'Invalid credentials' };
};