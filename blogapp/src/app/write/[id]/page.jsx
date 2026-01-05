'use client';
import { supabase } from "@/lib/supabase";
// import { notFound } from "next/navigation";
import React from "react";
import { updatePost } from "@/server/actions/posts";
import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import QuillEditor from "@/components/QuillEditor";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"


export const dynamic = 'force-dynamic';

export default function EditPost({ params }) {
    const { id } = React.use(params);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [slug, setSlug] = useState('');
    const [loading, setLoading] = useState(true);

    const supabase = createSupabaseBrowserClient();

    useEffect(() => {
        const fetchPost = async () => {
            const { data: post, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !post) {
                alert('Post not found or error loading!');
                window.location.href = '/blog';
                return;
            }

            setTitle(post.title);
            setContent(post.content || '');
            setSlug(post.slug);
            setLoading(false);
        };

        fetchPost();
    }, [id, supabase]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);


        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('slug', slug);

        const result = await updatePost(formData);

        if (result?.error) {
            alert('Error: ', + result.error);
            setLoading(false);
        } else {
            const newSlug = title
                .toLowerCase()
                .replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim('-');

            window.location.href = `/blog`;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col space-y-3 justify-center items-center">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Edit post</h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-6">
                <input type="hidden" name="slug" value={slug} />
                <div>
                    <label>Title</label>
                    <input
                        name="title"
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-lg font-medium mb-2">Content</label>
                    <QuillEditor value={content} onChange={setContent} />
                </div>

                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Upadet Post'}
                    </Button>
                    <Button
                        type="submit"
                        onClick={() => window.history.back()}
                    >
                        Cencel
                    </Button>
                </div>
            </form>
        </div>
    );
}