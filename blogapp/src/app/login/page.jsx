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
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseBrowserClient();

  // handle authentication 
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
              full_name: fullName,
            },
          },
        });

        if (error) {
          alert('Signup error: ' + error.message);
          return;
        }

        if (data?.user) {
          // Wait a moment for the trigger to create the profile
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Verify profile was created
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', data.user.id)
            .single();

          if (profileError || !profile) {
            console.error('Profile verification failed:', profileError);

            // If profile doesn't exist, try creating it manually
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                user_id: data.user.id,
                username: email.split('@',)[0].replace(/[0-9]/g, "") || 'user',
                full_name: fullName,
              });

            if (insertError && insertError.code !== '23505') { // Ignore duplicate key error
              console.error('Profile creation failed:', insertError);
              alert('Account created but profile setup failed. Please contact support.');
              return;
            }
          }

          alert('Signup successful! Please check your email to verify your account.');
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
      alert('An unexpected error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen w-auto flex flex-col items-center justify-center">        
          <Skeleton className="h-[250px] w-[250px] rounded-xl" />
      </div>
    );
  }


  return (
    <Card className="max-w-md mx-auto p-8 mt-30 mb-20">
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

            {/* Full Name field - only show during signup */}
          {isSignUp && (
            <div className='grid gap-2'>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          )}

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