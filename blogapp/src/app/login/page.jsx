'use client';
import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createSupabaseBrowserClient();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        // Sign up with username in metadata
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/blog`,
            data: {
              username: email.split('@')[0] || 'user',
            },
          },
        });

        if (error) {
          alert('Signup error: ' + error.message);
          return;
        }

        if (data?.user) {
          // Wait for profile creation before redirecting
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              user_id: data.user.id,
              username: email.split('@')[0] || 'user',
            });

          if (profileError) {
            console.error('Profile creation failed:', profileError);
            alert('Account created but profile setup failed. Please contact support.');
            return;
          }
        }
      } else {
        // Log in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          alert('Login error: ' + error.message);
          return;
        }

        if (!data?.user) {
          alert('Login failed. Please try again.');
          return;
        }
      }

      // Success — redirect
      window.location.href = '/blog';
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto p-8 mt-20">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </CardTitle>
        <CardDescription className="text-center">
          {isSignUp 
            ? "Enter your email below to create your account" 
            : "Enter your email below to login to your account"}
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleAuth}>
        <div className='flex flex-col gap-6 px-6'>
          <div className='grid gap-2'>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div className='grid gap-2'>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>
        
        <CardFooter className='flex flex-col gap-4 mt-6'>
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Log In')}
          </Button>
          
          <div className="text-center text-sm">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Button
              variant='link'
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className='p-0 h-auto font-semibold'
            >
              {isSignUp ? 'Log In' : 'Sign Up'}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}