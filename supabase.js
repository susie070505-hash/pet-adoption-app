
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// TODO: 替换为你的 Supabase 项目 URL 和 Anon Key
// 💡 提醒：Supabase 的 Anon Key 通常是以 "eyJ" 开头的 JWT 长字符串。
const supabaseUrl = 'https://rckmurstbdmhjyvokzkk.supabase.co';
const supabaseAnonKey = 'sb_publishable_mUDAM9pVVZ0MCMn61lufXQ__94KNOa0';

if (!supabaseAnonKey || !supabaseAnonKey.startsWith('eyJ')) {
  console.warn('⚠️ 注意：当前的 Supabase Key (以 sb_publishable_ 开头) 格式更像 Stripe 密钥，而非 Supabase JWT。这可能导致数据库连接失败。');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
