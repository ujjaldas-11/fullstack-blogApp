'use client';

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import {
  Card,
  CardAction,
  CardContent,
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
    <Card className="max-w-md mx-auto p-8 mt-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {isSignUp ? 'Create Account' : 'Welcome Back'}
      </h1>

      <CardHeader>
        <CardTitle>{isSignUp ? "Create your account" : "Login to your account"}</CardTitle>
        <CardDescription>
          {isSignUp ? "Enter your email below to create to your account" :

            "Enter your email below to login to your account"}
        </CardDescription>
      </CardHeader>


      <form onSubmit={handleAuth} >
        <div className='flex flex-col gap-6 ml-6 mr-7'>

          <div className='grid gap-2'>
            <Label htmlFor="email">Email</Label>
            <Input
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
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        <CardFooter className='flex-col gap-2'>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-4"
          >
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Log In')}
          </Button>

          <CardAction>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Button
              variant='link'
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className='text-md'
            >
              {isSignUp ? 'Log In' : 'Sign Up'}
            </Button>
          </CardAction>
        </CardFooter>

      </form>
    </Card>
  );
}