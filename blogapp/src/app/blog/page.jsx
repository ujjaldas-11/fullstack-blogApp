import React from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import AuthGreeting from '@/components/AuthGreeting';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import SearchBlog from '@/components/SearchBlog';



export const dynamic = 'force-dynamic';

export default async function BlogPage() {
    const supabase = await createSupabaseServerClient();


    const { data: { user } } = await supabase.auth.getUser();

    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, title, content, slug, created_at, author_id, featured_image')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error:', error);
        return <p className="text-center p-8 text-red-500">Error loading posts.</p>;
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="text-center p-16">
                <p className="text-2xl mb-6">No posts yet!</p>
                <AuthGreeting />
            </div>
        );
    }

    // Fetch usernames
    const authorIds = [...new Set(posts.map(p => p.author_id).filter(Boolean))];
    let authorMap = {};

    if (authorIds.length > 0) {
        const { data: profiles } = await supabase
            .from('profiles')
            .select('user_id, username')
            .in('user_id', authorIds);

        if (profiles) {
            authorMap = Object.fromEntries(profiles.map(p => [p.user_id, p.username || 'Anonymous']));
        }
    }

    // Add username to each post
    const postsWithData = posts.map(post => ({
        ...post,
        username: authorMap[post.author_id] || 'Anonymous',
    }));



    return (
        <div className="max-w-7xl mx-auto p-8 mt-20">



            {/* SearchBlog component */}

            <SearchBlog posts={postsWithData} />


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