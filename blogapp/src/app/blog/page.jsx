import React from 'react'
import { supabase } from "@/lib/supabase";
import { createSupabaseServerClient } from '@/lib/supabase/server';
import AuthGreeting from '@/components/AuthGreeting';


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
            <div className='w-full grid grid-cols-3 gap-2'>
                {posts.map((post) => (
                    <div key={post.id} className='h-100% bg-white text-black border rounded-2xl w-[300px] m-10 p-2 '>
                        <a href={`/blog/${post.slug}`} className='no-underline'>
                            <h2 className='text-center font-bold'>{post.title}</h2>
                        </a>


                        <div
                            className="prose prose-lg max-w-none text-center overflow-hidden"
                            style={{ maxWidth: '100%' }}
                            dangerouslySetInnerHTML={{
                                __html: post.content.replace(/<img/g, '<img style="width: 100vw; height:20vh; border-radius:8px;"')
                            }}
                        />


                        <div className='flex justify-between items-center mt-5'>
                            <span className='text-gray-900 text-sm text-left font-bold'>By {post.username || 'Anonymous'}</span>
                            <p className='text-gray-600 text-sm text-right font-semibold'>{new Date(post.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
            {
                isLoggedIn && (
                    <div className="fixed bottom-8 right-8">
                        <a
                            href="/write"
                            className="bg-blue-600 text-white px-8 py-4 rounded-full shadow-2xl hover:bg-blue-700 transition text-lg font-semibold"
                        >
                            + New Post
                        </a>
                    </div>
                )
            }
        </div>
    )
}