'use client';
import { createPost } from "@/server/actions/posts"
import { useState } from "react";
import QuillEditor from "@/components/QuillEditor";

export const dynamic = 'force-dynamic';

export default function writePage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e)=> {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);

        await createPost(formData);
    }


    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">write tour post</h1>

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
                    <QuillEditor value={content} onChange={setContent}/>
                </div>

                <button type="submit"
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">publish post</button>
            </form>
        </div>
    )
}