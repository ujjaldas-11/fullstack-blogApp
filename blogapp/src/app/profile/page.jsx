'use client'
import { useEffect, useState } from "react";
import React from 'react';
import { Settings, LogOut, Mail, Calendar, FileText, Plus, Eye, Clock, Edit3, Trash2, ThermometerSnowflake } from 'lucide-react';
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Card, CardAction, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import BlogCard from "@/components/BlogCard";

export default function profilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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

      // fetch username with post
      const authorIds = [...new Set(posts.map(p => p.author_id).filter(Boolean))];
      console.log('author id: ', authorIds)
      let authorMap = {};

      if (authorIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, username, full_name')
          .in('user_id', authorIds);

        console.log('profilesdata: ', profiles);
        if (profiles) {
          authorMap = Object.fromEntries(profiles.map(p => [p.user_id, p.full_name || 'Anonymous']));
        }
      }

      // Add username to each post
      const postsWithData = posts.map(post => ({
        ...post,
        username: authorMap[post.author_id] || 'Anonymous',

      }));

      setUserPosts(postsWithData);
      setLoading(false);
    }

    loadUserData();
  }, [supabase]);



  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = '/';
    } catch (error) {
      console.error('signout error: ', error);
      alert('LogOut error: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2">
        {/* <div className="flex gap-2 space-y-2">
          <Skeleton className="h-[50px] w-[50px] rounded-full" />
        </div> */}
        <Skeleton className="h-[300px] w-[90vw] rounded-lg" />
        <div className="flex justify-center items-center gap-2">
          <Skeleton className="h-[250px] w-[250px] rounded-xl" />
          <Skeleton className="h-[250px] w-[250px] rounded-xl" />
          <Skeleton className="h-[250px] w-[250px] rounded-xl" />
        </div>
        {/* <Skeleton className="h-[300px] w-[350px] rounded-xl" /> */}
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
          <Card className="relative -mt-20 mx-2 sm:mx-4 md:mx-8 p-4">
            <CardContent className="rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-slate-100">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">

                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl sm:text-5xl font-bold shadow-xl ring-4 ring-white">
                    {profile?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full border-4 border-white"></div>
                </div>

                {/* Profile Info */}
                <CardHeader className="flex flex-col text-center w-full">
                  <CardAction className="text-4xl text-center font-bold bg-clip-text mb-2">
                    {profile?.full_name || 'User'}
                  </CardAction>
                  <p className="text-base text-center text-slate-600 mb-2 sm:mb-3">
                    @{profile?.username || 'username'}
                  </p>
                  <p className="text-sm sm:text-base text-center text-slate-500 max-w-2xl">
                    {profile?.bio || 'No bio yet'}
                  </p>
                </CardHeader>

                {/* Action Buttons */}
                <div className="flex gap-2 w-full sm:w-auto m-10">
                  <Link href="/profile/settings" className="flex-1 sm:flex-none">
                    <button className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2">
                      <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Edit Profile</span>
                    </button>
                  </Link>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      {/* <Button
                        type="button"
                        variant="ghost"
                        className="px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-100 text-slate-700 rounded-lg sm:rounded-xl font-semibold hover:bg-slate-200 transition-all" */}
                      {/* > */}
                      <Button className="h-[3rem] rounded-lg text-center p-4 px-2 cursor-pointer">
                        <LogOut className="w-5 h-5" />
                      </Button>
                      {/* </Button> */}
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg sm:text-xl">
                          Are you sure you want to logout?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm sm:text-base">
                          You will need to login again to access your account.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleLogout}
                          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                        >
                          Logout
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-100">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                    <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide hidden sm:block">
                      Email
                    </p>
                  </div>
                  <p className="font-semibold text-xs sm:text-sm truncate px-1">
                    {user?.email}
                  </p>
                </div>

                <div className="text-center border-x border-slate-100">
                  <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500" />
                    <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide hidden sm:block">
                      Joined
                    </p>
                  </div>
                  <p className="font-semibold text-xs sm:text-sm">
                    {new Date(user?.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                    <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide hidden sm:block">
                      Posts
                    </p>
                  </div>
                  <p className="font-semibold text-lg sm:text-2xl">{userPosts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Section */}
        <div className="mx-4 sm:mx-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">My Posts</h2>
            <Link href="/blog">
              <button className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2">
                {/* <Plus className="w-5 h-5" /> */}
                Explore Blogs
              </button>
            </Link>
          </div>

          {userPosts.length === 0 ? (
            <Card className=" rounded-3xl p-16 text-center shadow-lg border">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3">No posts yet</h3>
              <p className="mb-8 max-w-md mx-auto">
                Start sharing your thoughts with the world. Create your first blog post today!
              </p>
              <Link href="/write">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
                  Create Your First Post
                </button>
              </Link>
            </Card>
          ) : (
            <>
              <BlogCard posts={userPosts} />
            </>
          )}
        </div>
      </div>
          {/* write post button */}
      <div className="fixed bottom-8 right-8">
        <Button size="lg" className="rounded-full shadow-2xl">
          <Link href="/write" className="flex items-center gap-2">
            <span className="text-2xl">+</span>
            New Post
          </Link>
        </Button>
      </div>

    </div>
  );
}