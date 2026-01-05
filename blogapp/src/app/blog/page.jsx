import React from 'react'
import { supabase } from "@/lib/supabase";
import { createSupabaseServerClient } from '@/lib/supabase/server';
import AuthGreeting from '@/components/AuthGreeting';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';



export const dynamic = 'force-dynamic';

export default async function BlogPage() {
    const supabase = await createSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    const isLoggedIn = !!user;

    // Fetch posts safely
    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, title, content, slug, created_at, author_id')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error:', error);
        return <p>Error loading posts.</p>;
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="text-center p-8">
                <p className="text-xl">No posts yet!</p>
                {isLoggedIn && <a href="/write" className="text-blue-600">Write the first one →</a>}
            </div>
        );
    }

    // Safe: posts is now confirmed to be an array
    const authorIds = [...new Set(posts.map(p => p.author_id).filter(Boolean))];

    let authorMap = {};
    if (authorIds.length > 0) {
        const { data: profiles } = await supabase
            .from('profiles')
            .select('user_id, username')
            .in('user_id', authorIds);

        if (profiles) {
            authorMap = Object.fromEntries(profiles.map(p => [p.user_id, p.username]));
        }
    }

    // Add username to each post
    posts.forEach(post => {
        post.username = authorMap[post.author_id] || 'Anonymous';
    });


    return (
        <div className='text-center mb-8'>
            <div className='text-center'>
                <AuthGreeting />
            </div>
            <h1 className='text-4xl font-bold text-center mt-10'>Blog page</h1>
            <div className='w-full grid grid-cols-4 gap-4 p-4'>
                {posts.map((post) => (

                    <Card key={post.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <a href={`blog/${post.slug}`}>
                                <CardTitle>{post.title}</CardTitle>
                            </a>
                            <CardDescription>
                                By {post.username} • {new Date(post.created_at).toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent
                            className="overflow-hidden h-[20vh] w-100%"
                            style={{ maxWidth: '100%' }}
                            dangerouslySetInnerHTML={{
                                __html: post.content.replace(/<img/g, '<img style="width: 100vw; height:20vh; border-radius:8px;"')
                            }}
                        />
                    </Card>
                ))}
            </div>
            {
                isLoggedIn && (
                    <div className="fixed bottom-8 right-8">
                        <Button>
                            <a
                                href="/write"
                                className='p-6 '
                            >
                                + New Post
                            </a>
                        </Button>
                    </div>
                )
            }
        </div>
    )
}