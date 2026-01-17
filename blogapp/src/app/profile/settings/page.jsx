'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function profileSettingPage() {
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false)

    const supabase = createSupabaseBrowserClient();

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                setEmail(user.email || '');

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();
                if (profile) {
                    setUsername(profile.username || '');
                    setFullName(profile.full_name);
                }
            }

            setInitialLoading(false);

        }

        loadProfile();
    }, [supabase]);


    const handleUpdate = async (e) => {
        e.preventdefault();
        setLoading(true);

        const { data: error } = await supabase
            .from('profiles')
            .update({username, full_name: fullName})
            .eq('user_id', user.id);
        
        if(error) {
            alert('profile updating error: ' + error.message)
        } else {   
            alert('profile updates succesfully');
        }

        setLoading(false);
    }   

    if (initialLoading) {
    return (
      <div className="max-w-2xl mx-auto p-8 mt-20">
        <p className="text-center">Loading profile...</p>
      </div>
    );
  }

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-8 mt-20">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src="" />
              <AvatarFallback className="text-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                {username ? username.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl sm:text-3xl">Edit Profile</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Email (read-only) */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-slate-50"
              />
              <p className="text-xs text-slate-500">Email cannot be changed</p>
            </div>

            {/* Username */}
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
                required
                disabled={loading}
              />
            </div>

            {/* Full Name */}
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                disabled={loading}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => window.history.back()}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}