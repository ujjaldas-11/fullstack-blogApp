import { createPost } from "@/server/actions/posts"

export default function writePage() {
    return (
        <>
            <h1 className="text-3xl font-bold mb-8">write tour post</h1>

            <form action={createPost} className="space-y-6">
                <div>
                    <label>Title</label>
                    <input
                        name="title"
                        id="title"
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your post title.."
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
                        placeholder="# Your Markdown content here...\n\n**Bold**, *italic*, lists, code blocks, etc."
                    />
                </div>

                <button type="submit"
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">publish post</button>
            </form>
        </>
    )
}