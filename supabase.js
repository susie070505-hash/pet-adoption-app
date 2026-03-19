
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// TODO: 替换为你的 Supabase 项目 URL 和 Anon Key
const supabaseUrl = 'https://rckmurstbdmhjyvokzkk.supabase.co';
const supabaseAnonKey = 'sb_publishable_mUDAM9pVVZ0MCMn61lufXQ__94KNOa0';

if (!supabaseAnonKey || !supabaseAnonKey.startsWith('eyJ')) {
  console.warn('Supabase key does not look like a standard JWT. This might cause issues.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
