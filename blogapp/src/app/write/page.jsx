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

export const dynamic = 'force-dynamic';

export default function writePage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [aiPrompt, setAiPromt] = useState('');
    const [generating, setGenerating] = useState(false);


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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);

        await createPost(formData);
    }


    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">write tour post</h1>

            <Card className="mb-8 p-6 bg-purple-100 rounded-lg border border-purple-200">
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
                        {generating ? 'Generating...' : 'Generate Draft'}
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