'use client';
import * as React from 'react'
import { createPost } from "@/server/actions/posts"
import { useState } from "react";
import QuillEditor from "@/components/QuillEditor";
import { GeneratePostContent } from "@/server/actions/GeneratePostContent";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import AuthGreeting from "@/components/AuthGreeting";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export const dynamic = 'force-dynamic';

export default function writePage() {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
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

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
            return;
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('File size must be less than 5MB');
            return;
        }

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

        // Fixed: Correct way to get public URL
        const { data } = supabase.storage
            .from('post-images')
            .getPublicUrl(filePath);

        setFeaturedImage(data.publicUrl);
        setUploading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('content', content);
        if (featuredImage) {
            formData.append('featured_image', featuredImage);
        }

        await createPost(formData);
    }

    return (
        <div className="max-w-4xl mx-auto p-8 mt-20">

            {/* display user name */}
            <div className="text-center mb-12">
                <AuthGreeting />
            </div>


            <h1 className="text-3xl font-bold mb-8">Write Your Post</h1>

            <Card className="mb-8 p-6">
                <CardTitle className="text-xl font-semibold mb-4 block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Generate with AI</CardTitle>
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
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg cursor-pointer"
                    >
                        {generating ? 'Generating...' : 'Generate blog'}
                    </Button>
                </div>
            </Card>

            <form
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

                {/* category */}

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

                {/* Upload featured image */}
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

                        <label
                            htmlFor="cover-image-input"
                            className="cursor-pointer inline-flex items-center justify-center px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                            style={uploading ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                        >
                            {uploading ? 'Uploading...' : 'Choose Image'}
                        </label>

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

                {/* Fixed: Button className should be a string */}
                <Button type="submit" className="cursor-pointer">
                    Publish Post
                </Button>
            </form>
        </div>
    )
}