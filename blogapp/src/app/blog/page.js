import React from 'react'
import { supabase } from "@/lib/supabase";


export default async function blogPage() {
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
        <div>
            <h1>Blog page</h1>
                {posts.map((post)=> (
                    <div key={post.id} className='bg-white text-black border rounded-2xl w-[300px] m-10 p-4'>
                        <a href={`/blog/${post.slug}`} className='no-underline'>
                        <h2 className='text-center font-bold'>{post.title}</h2>
                        </a>
                        <h2 className='text-center'>{post.content}</h2>
                        <p className='text-gray-500 text-sm text-right'>{new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                ))  }
                <a href='/write' className='text-blue-600 hover-underline'>write a new post</a>
        </div>
    ) 
}