'use client';
import { supabase } from "@/lib/supabase";
// import { notFound } from "next/navigation";
import React from "react";
import { updatePost } from "@/server/actions/posts";
import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import QuillEditor from "@/components/QuillEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


export const dynamic = 'force-dynamic';

export default function EditPost({ params }) {
    const { id } = React.use(params);

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');
    const [slug, setSlug] = useState('');
    const [loading, setLoading] = useState(true);
    const [featuredImage, setFeaturedImage] = useState('')
    const [uploading, setUploading] = useState(false);

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
            setCategory(post.category);
            setContent(post.content || '');
            setSlug(post.slug);
            setFeaturedImage(post.featured_image || '')
            setLoading(false);
        };

        fetchPost();
    }, [id, supabase]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = fileName;

        const { error } = await supabase.storage
            .from('post-images')
            .upload(filePath, file);

        if (error) {
            alert('Upload failed: ' + error.message);
            setUploading(false);
            return;
        }

        const { data } = supabase.storage
            .from('post-images')
            .getPublicUrl(filePath);

        setFeaturedImage(data.publicUrl);
        setUploading(false);
    };

    const handleRemoveImage = () => {
        setFeaturedImage('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);


        const formData = new FormData();
        formData.append('id', id);
        formData.append('title', title);
        formData.append('category', category);
        formData.append('content', content);
        formData.append('slug', slug);
        formData.append('featured_image', featuredImage);

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
            <div className="flex flex-col space-y-3 justify-center items-center mt-30">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-[250px]" />
                    <Skeleton className="h-10 w-[250px]" />
                </div>
                <Skeleton className="h-[300px] w-[350px] rounded-xl" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-8 mt-30">
            <h1 className="text-3xl font-bold mb-8">Edit post</h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-6">
                <Input type="hidden" name="slug" value={slug} />
                <div className="grid gap-2">
                    <Label className='font-semibold text-md'>Title</Label>
                    <Input
                        name="title"
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full p-4"
                    />
                </div>

                {/* category list */}
                <div className="grid gap-2">
                    <Label className='font-semibold text-md'>Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="Technology">Technology</SelectItem>
                                <SelectItem value="Science">Science</SelectItem>
                                <SelectItem value="AI">AI</SelectItem>
                                <SelectItem value="Travel">Travel</SelectItem>
                                <SelectItem value="Politics">Politics</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>


                <div>
                    <label className="block text-lg font-medium mb-3">Cover Image (Optional)</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="hidden"
                            id="cover-image-input"
                        />

                        {featuredImage && (
                            <div className="relative">
                                <img
                                    src={featuredImage}
                                    alt="Cover preview"
                                    className="h-48 w-80 object-cover rounded-lg shadow-lg"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>
                </div>


                <div>
                    <Label className="block text-lg font-medium mb-2">Content</Label>
                    <QuillEditor value={content} onChange={setContent} />
                </div>

                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'updating...' : 'update Post'}
                    </Button>
                    <Button
                        type="button"
                        onClick={() => window.history.back()}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}