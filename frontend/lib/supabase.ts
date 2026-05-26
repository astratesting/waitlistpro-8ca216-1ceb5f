import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type WaitlistEntry = {
  id: number;
  email: string;
  segment: string;
  referral_code: string;
  referrals_count: number;
  access_tier: string;
  created_at: string;
};
