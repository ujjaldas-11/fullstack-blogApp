// src/lib/supabase/server.js
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Ignore if called from Server Component (middleware handles it)
          }
        },
        remove(name, options) {
          try {
            cookieStore.delete({ name, ...options });
          } catch (error) {
            // Ignore
          }
        },
      },
    }
  );
}