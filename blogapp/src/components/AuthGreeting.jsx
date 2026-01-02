'use client';

import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';

export default function AuthGreeting() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  if (loading) return null; // or a skeleton

  if (user) {
    return (
      <p className="text-xl mb-8">
        Hello, <span className="font-semibold">{user.email}</span>! 
        <a href="/write" className="ml-4 text-blue-600 hover:underline font-medium">
          Write a new post →
        </a>
      </p>
    );
  }

  return (
    <p className="text-xl mb-8">
      <a href="/login" className="text-blue-600 hover:underline font-medium">
        Log in
      </a> to write posts
    </p>
  );
}