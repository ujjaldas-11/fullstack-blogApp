import React from 'react'
import { supabase } from "@/lib/supabase";
import { createSupabaseServerClient } from '@/lib/supabase/server';


export default async function blogPage() {
    const supabase = await createSupabaseServerClient();
    const {data: {user}} = await supabase.auth.getUser();
    
    console.log('Current user: ', user);

    const isLoggedIn = !!user;

    const {data: posts, error} = await supabase
    .from('posts')
    .select('*')
    .order('created_at', {ascending: false});

    if(error) {
        console.log('Error fetching posts: ', error);
        return <p>Error Loading page..</p>
    }

    if(!posts || posts.length == 0) {
        return <p>No posts added yet. Please add some posts in  your supabase dashboard!</p>
    }

    return(
        <div className='text-center mb-8'>
            {isLoggedIn ? (
                <p>Welcome Back! <a href="/write">Write a new post</a></p>
            ): (
                <p><a href="/login">Log in</a> to write posts</p>
            )}
            <h1 className='text-4xl font-bold text-center mt-10'>Blog page</h1>
            <div className='w-full grid grid-cols-3 gap-2'>
                {posts.map((post)=> (
                    <div key={post.id} className='bg-white text-black border rounded-2xl w-[300px] m-10 p-4'>
                        <a href={`/blog/${post.slug}`} className='no-underline'>
                        <h2 className='text-center font-bold'>{post.title}</h2>
                        </a>
                        <h2 className='text-center'>{post.content}</h2>
                        <p className='text-gray-500 text-sm text-right'>{new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                ))  }
            </div>
            <button className='p-4 text-white text-center bg-blue-600 rounded-lg font-semibold cursor-pointer'>
                <a href='/write' className='hover-underline'>write a new post</a>
            </button>
        </div>
    ) 
}