import React from 'react'
import { supabase } from "@/lib/supabase";


export default async function blogPage() {
    const {data: posts, error} = await supabase
    .from('posts')
    .select('*')
    .order('createdAt', {ascending: false});

    if(error) {
        console.log('Error fetching posts: ', error);
        return <p>Error Loading page..</p>
    }
    return(
        <>
            <h1>
                {posts.map((post)=> (
                    <div key={post.id}>
                        <h2>{post.title}</h2>
                        <h2>{post.content}</h2>
                    </div>
                ))  }
            </h1>
        </>
    )
}