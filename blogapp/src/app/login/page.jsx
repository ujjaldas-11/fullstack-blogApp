'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const supabase = createSupabaseBrowserClient();

  return (
    <div className="max-w-md mx-auto p-8 mt-20">
      <h1 className="text-3xl font-bold mb-8 text-center">Welcome</h1>

      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#3b82f6',
                brandAccent: '#2563eb',
              },
            },
          },
        }}
        providers={['google', 'github']} // optional social logins
        redirectTo={`proces.env.NEXT_PUBLIC_SUPABASE_URL/blog`}
        onlyThirdPartyProviders={false} // set true if you want ONLY social
      />
    </div>
  );
}

