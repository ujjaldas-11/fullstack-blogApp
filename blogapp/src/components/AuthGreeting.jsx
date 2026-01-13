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
    let userName= user.email.split("@")[0].replace(/[0-9]/g, "");
    return (
      <p className="text-xl mb-2">
        Hello, <span className="font-semibold">{userName}</span>! 
      </p>
    );
  }

  return (
    <p className="text-xl mb-8">
      <a href="/login" className="text-red-600 hover:underline font-medium">
        Log in
      </a> to write posts
    </p>
  );
}