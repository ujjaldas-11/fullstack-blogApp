import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import DeletePostButtno from "@/components/DeletePostButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function PostPage({ params }) {

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { slug } = await params;


    // Fetch the post
    const { data: post, error } = await supabase
        .from('posts')
        .select('id, title, content, slug, created_at, author_id')
        .eq('slug', slug)
        .single();

    if (error || !post) {
        notFound(); // 404 page
    }


    let username = 'Anonymous';
    if (post.author_id) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('user_id', post.author_id)
            .single();

        if (profile?.username) {
            username = profile.username;
        
        }
    }

    const isOwner = user && user.id === post.author_id;


    return (
        <div className="max-w-4xl mx-auto p-8 prose prose-lg dark:prose-invert">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <time className="text-gray-500 text-sm block mb-8">
                {new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })}
            </time>

            <div
                className="prose prose-lg max-w-none"
                style={{ maxWidth: '100%' }}
                dangerouslySetInnerHTML={{
                    __html: post.content.replace(/<img/g, '<img style="max-width:130%; height:250px; border-radius:8px;"')
                }}
            />

            <p>Posted By {username}</p>

            {isOwner && (


                <div className="flex gap-4 mt-10">
                    <Button>
                        <a
                            href={`/write/${post.id}`}
                            className="px-4 py-2 rounded-lg  cursor-pointer"
                        >
                            Edit Post
                        </a>
                    </Button>

                    {/* delete post from components */}
                    <DeletePostButtno slug={post.slug} />
                </div>
            )}
        </div>
    );
}
