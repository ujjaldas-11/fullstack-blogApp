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

    if (isSignUp) {
      // Sign up with username in metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/blog`,
          data: {
            username: email.split('@')[0] || 'user', // fallback
          },
        },
      });

      if (error) {
        alert('Signup error: ' + error.message);
        setLoading(false);
        return;
      }
      
      if (data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            username: email.split('@')[0] || 'user',
          });

        if (profileError) {
          console.error('Profile creation failed:', profileError);
        }
      }
    } else {
      // Log in
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert('Login error: ' + error.message);
        setLoading(false);
        return;
      }
    }

    // Success — redirect
    window.location.href = '/blog';
  };

  return (
    <div className="max-w-md mx-auto p-8 mt-20 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {isSignUp ? 'Create Account' : 'Welcome Back'}
      </h1>

      <form onSubmit={handleAuth} className="space-y-6">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition"
        >
          {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Log In')}
        </button>
      </form>

      <p className="text-center mt-6 text-gray-600">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-600 font-medium hover:underline"
        >
          {isSignUp ? 'Log In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
}