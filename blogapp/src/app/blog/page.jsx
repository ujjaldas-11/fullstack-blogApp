import React from 'react'
import { supabase } from "@/lib/supabase";
import { createSupabaseServerClient } from '@/lib/supabase/server';


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
            {isLoggedIn ? (
                <p><a href="/write">hello {posts.email} </a></p>
            ) : (
                <p><a href="/login">Log in</a> to write posts</p>
            )}
            <h1 className='text-4xl font-bold text-center mt-10'>Blog page</h1>
            <div className='w-full grid grid-cols-3 gap-2'>
                {posts.map((post) => (
                    <div key={post.id} className='h-[30vh] bg-white text-black border rounded-2xl w-[300px] m-10 p-4 '>
                        <a href={`/blog/${post.slug}`} className='no-underline'>
                            <h2 className='text-center font-bold'>{post.title}</h2>
                        </a>
                        <div
                            className="prose prose-lg max-w-none h-[15vh] overflow-hidden"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                        <span>By {post.username || 'Anonymous'}</span>
                        <p className='text-gray-500 text-sm text-right'>{new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
            <button className='p-4 text-white text-center bg-blue-600 rounded-lg font-semibold cursor-pointer'>
                <a href='/write' className='hover-underline'>write a new post</a>
            </button>
        </div>
    )
}