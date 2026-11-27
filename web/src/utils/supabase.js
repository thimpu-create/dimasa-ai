import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Cloud Sync
 * Reads VITE_ or NEXT_PUBLIC_ prefixed environment variables from Vercel / .env.local
 */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isCloudSyncEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = isCloudSyncEnabled 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

export async function fetchCloudFeed() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('community_feed')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Cloud sync fetch error:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Cloud sync fetch exception:', err);
    return null;
  }
}

export async function postCloudSentence(entry) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('community_feed')
      .insert([entry])
      .select();

    if (error) {
      console.warn('Cloud sync post error:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Cloud sync post exception:', err);
    return null;
  }
}

export async function voteCloudSentence(id, upvotes, downvotes, status) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('community_feed')
      .update({ upvotes, downvotes, status })
      .eq('id', id)
      .select();

    if (error) {
      console.warn('Cloud sync vote error:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Cloud sync vote exception:', err);
    return null;
  }
}
