'use client';
import { createPost } from "@/server/actions/posts"
import { useState } from "react";
import QuillEditor from "@/components/QuillEditor";
import { GeneratePostContent } from "@/server/actions/GeneratePostContent";
import { Button } from "@/components/ui/button";
import { Pointer } from "lucide-react";

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

            <div className="mb-8 p-6 bg-purple-50 rounded-lg border border-purple-200">
                <h2 className="text-xl font-semibold mb-4 text-purple-900">Generate with AI</h2>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPromt(e.target.value)}
                        placeholder="e.g., A beginner's guide to Next.js in 2026"
                        className="flex-1 px-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={generating}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={generating || !aiPrompt.trim()}
                        className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-60 transition cursor-pointer"
                    >
                        {generating ? 'Generating...' : 'Generate Draft'}
                    </button>
                </div>
            </div>




            <form
                // action={createPost}
                onSubmit={handleSubmit}
                className="space-y-6"
            >
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
                        placeholder="Enter your post title.."
                    />
                </div>

                <div>
                    <label className="block text-lg font-medium mb-2">Content</label>
                    <QuillEditor value={content} onChange={setContent} />
                </div>

                <Button type="submit" className={Pointer}>
                    publish post
                    </Button>
            </form>
        </div>
    )
}