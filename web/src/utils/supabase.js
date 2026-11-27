/**
 * Supabase Cloud Sync (Optional)
 * To connect a live shared database across all users' devices:
 * 1. Create a free project at https://supabase.com
 * 2. Create the table using the SQL in 'schema.sql'
 * 3. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env or hosting environment
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isCloudSyncEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export async function fetchCloudFeed() {
  if (!isCloudSyncEnabled) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/community_feed?select=*&order=created_at.desc`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    if (!res.ok) throw new Error(res.statusText);
    return await res.json();
  } catch (err) {
    console.warn('Cloud sync fetch error:', err);
    return null;
  }
}

export async function postCloudSentence(entry) {
  if (!isCloudSyncEnabled) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/community_feed`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(entry)
    });
    return await res.json();
  } catch (err) {
    console.warn('Cloud sync post error:', err);
    return null;
  }
}

export async function voteCloudSentence(id, upvotes, downvotes, status) {
  if (!isCloudSyncEnabled) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/community_feed?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ upvotes, downvotes, status })
    });
    return await res.json();
  } catch (err) {
    console.warn('Cloud sync vote error:', err);
    return null;
  }
}
