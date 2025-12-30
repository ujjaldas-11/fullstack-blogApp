import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm";
import DeletePostButtno from "@/components/DeletePostButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function PostPage({ params }) {

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { slug } = await params;
    const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single(); // for exactly one post

    if (error || !post) {
        notFound(); // 404 page
    }


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
            {/* <div className="mt-8">
                <p>{post.content}</p>
                </div> */}

            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
            </ReactMarkdown>

            {user && user.id === post.author_id && (


                <div className="flex gap-4 mt-10">
                    <a
                        href={`/write/${post.id}`}
                        className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
                    >
                        Edit Post
                    </a>

                    {/* delete post from components */}

                    <DeletePostButtno slug={post.slug} />
                </div>
            )}

        </div>
    );
}
