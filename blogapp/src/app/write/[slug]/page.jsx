import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { updatePost } from "@/server/actions/posts";
import { ReactJsxRuntime } from "next/dist/server/route-modules/app-page/vendored/rsc/entrypoints";

export default async function EditPost({ params }) {
    const { slug } = params;

    const { data: post, error } = await supabase
        .from('post')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !post) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Edit post</h1>

            <form action={updatePost}  className="space-y-6">
                <input type="hidden" name="slug" value={post.slug} />
                <div>
                    <label>Title</label>
                    <input
                        name="title"
                        id="title"
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={post.title}
                    />
                </div>

                <div>
                    <label>Content, (markdown supported!)</label>
                    <textarea
                        name="content"
                        id="content"
                        type="text"
                        rows="15"
                        required
                        className="w-full px-4 py-3 border border-gray-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={post.content}
                    />
                </div>

                <button type="submit"
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">Update Post</button>
            </form>
        </div>
    )
}