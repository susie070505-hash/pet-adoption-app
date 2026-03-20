
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// TODO: 替换为你的 Supabase 项目 URL 和 Anon Key
const supabaseUrl = 'https://rckmurstbdmhjyvokzkk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJja211cnN0YmRtaGp5dm9remtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MTc2MDUsImV4cCI6MjA4OTQ5MzYwNX0.6RgGv9NW89kaNszD96HJernXMTkPLp32yT2O8XIpnxI';

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
