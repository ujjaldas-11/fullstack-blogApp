'use client'
import { useEffect, useState } from "react";
import React from 'react';
import { Settings, LogOut, Mail, Calendar, FileText, Plus, Edit3, Trash2 } from 'lucide-react';
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import BlogCard from "@/components/BlogCard";

export default function profilePage() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const supabase = createSupabaseBrowserClient();

    useEffect(() => {
        async function loadUserData() {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                window.location.href = '/login';
                return;
            }

            setUser(user);

            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            setProfile(profileData);

            const { data: posts } = await supabase
                .from('posts')
                .select('*')
                .eq('author_id', user.id)
                .order('created_at', { ascending: false });

            setUserPosts(posts);
            setLoading(false);
        }

        loadUserData();
    }, [supabase]);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-8 mt-20">
                <p className="text-center">Loading profile...</p>
            </div>
        );
    }



    
    return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto p-4 sm:p-8 pt-24">
        
        {/* Hero Section with Cover & Profile */}
        <div className="relative mb-8">
          {/* Cover Image */}
          <div className="h-48 sm:h-64 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 backdrop-blur-3xl bg-gradient-to-br from-purple-500/30 to-pink-500/30"></div>
          </div>

          {/* Profile Card Overlay */}
          <Card className="relative -mt-20 mx-4 sm:mx-8">
            <CardContent className=" rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-5xl font-bold shadow-xl ring-4 ring-white">
                    {profile?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white"></div>
                </div>

                {/* Profile Info */}
                <CardHeader className="flex-1">
                  <CardAction className="text-3xl sm:text-4xl font-bold bg-clip-text mb-2">
                    {profile?.full_name || 'User'}
                  </CardAction>
                  <p className="text-lg  mb-3">@{profile?.username || 'username'}</p>
                  <p className="max-w-2xl">{profile?.bio || 'No bio yet'}</p>
                </CardHeader>

                {/* Action Buttons */}
                <div className="flex gap-2 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2">
                    <Settings className="w-5 h-5" />
                    <span className="hidden sm:inline">Edit Profile</span>
                  </button>
                  <button className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Mail className="w-4 h-4 text-purple-500" />
                    <p className="text-xs font-medium uppercase tracking-wide">Email</p>
                  </div>
                  <p className="font-semibold text-sm truncate">{user?.email}</p>
                </div>

                <div className="text-center border-x border-slate-100">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-pink-500" />
                    <p className="text-xs font-medium uppercase tracking-wide">Joined</p>
                  </div>
                  <p className="font-semibold">
                    {new Date(user?.created_at).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-orange-500" />
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Posts</p>
                  </div>
                  <p className="font-semibold text-2xl">{userPosts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Section */}
        <div className="mx-4 sm:mx-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">My Posts</h2>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Post
            </button>
          </div>

          {userPosts.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center shadow-lg border border-slate-100">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">No posts yet</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Start sharing your thoughts with the world. Create your first blog post today!
              </p>
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
                Create Your First Post
              </button>
            </div>
          ) : (
            <>
              <BlogCard posts={userPosts}/>
            </>
          )}
        </div>
      </div>
    </div>
  );
}