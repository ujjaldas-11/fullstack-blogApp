'use client';
import { createPost } from "@/server/actions/posts"
import { useState } from "react";
import QuillEditor from "@/components/QuillEditor";
import { GeneratePostContent } from "@/server/actions/GeneratePostContent";
import { Button } from "@/components/ui/button";
import { Pointer } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export const dynamic = 'force-dynamic';

export default function writePage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [aiPrompt, setAiPromt] = useState('');
    const [generating, setGenerating] = useState(false);
    const [featuredImage, setFeaturedImage] = useState('');
    const [uploading, setUploading] = useState(false);

    const supabase = createSupabaseBrowserClient()


    const handleGenerate = async () => {
        if (!aiPrompt.trim()) return;
        setGenerating(true);

        const result = await GeneratePostContent(aiPrompt);

        if (result.error) {
            alert('AI ERROR: ' + result.error);
        } else {
            setContent(result.content);
            setTitle(aiPrompt);   // for title
        }

        setGenerating(false);
        setAiPromt('');

    }

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
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

        const { data: { publicUrl } } = supabase.storage
            .from('post-images')
            .getPublicUrl(filePath);

        setFeaturedImage(publicUrl);
        setUploading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (featuredImage) {
            formData.append('featured_image', featuredImage);
        }

        await createPost(formData);
    }


    return (
        <div className="max-w-4xl mx-auto p-8 mt-30">
            <h1 className="text-3xl font-bold mb-8">write tour post</h1>

            <Card className="mb-8 p-6">
                <CardTitle className="text-xl font-semibold mb-4 text-purple-900">Generate with AI</CardTitle>
                <div className="flex gap-3">
                    <Input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPromt(e.target.value)}
                        placeholder="e.g., A beginner's guide to Next.js in 2026"
                        disabled={generating}
                    />

                    <Button
                        onClick={handleGenerate}
                        disabled={generating || !aiPrompt.trim()}
                        className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-60 transition cursor-pointer"
                    >
                        {generating ? 'Generating...' : 'Generate blog'}
                    </Button>
                </div>
            </Card>



            <form
                // action={createPost}
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                <div className="grid gap-2">
                    <Label className='text-md font-semibold'>Title</Label>
                    <Input
                        name="title"
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your post title.."
                    />
                </div>



                {/*  upload featured image */}

                <div>
                    <Label className="block text-lg font-medium mb-3">Cover Image (Optional)</Label>
                    <div className="flex items-center gap-4">
                        <Label className="cursor-pointer">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                                className="hidden"
                            />
                            <Button className="px-6">
                                {uploading ? 'Uploading...' : 'Choose Image'}
                            </Button>
                        </Label>
                        {featuredImage && (
                            <div className="relative">
                                <img
                                    src={featuredImage}
                                    alt="Cover preview"
                                    className="h-48 w-80 object-cover rounded-lg shadow-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFeaturedImage('')}
                                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
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

                <Button type="submit" className={Pointer}>
                    publish post
                </Button>
            </form>
        </div>
    )
}