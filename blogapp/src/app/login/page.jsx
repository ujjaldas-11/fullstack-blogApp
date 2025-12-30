'use client';

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = createSupabaseBrowserClient();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    let error;
    if (isSignUp) {
      ({ error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/blog`,  // Redirect here after confirm
        },
      }));
    } else {
      ({ error } = await supabase.auth.signInWithPassword({ email, password }));
    }

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      // Success! Redirect manually (safe way)
      window.location.href = '/blog';  // This avoids the router mounting issue
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 mt-20">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {isSignUp ? 'Sign Up' : 'Log In'}
      </h1>
      <form onSubmit={handleAuth} className="space-y-6">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Log In')}
        </button>
      </form>
      <p className="text-center mt-4">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-600 hover:underline"
        >
          {isSignUp ? 'Log In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
}