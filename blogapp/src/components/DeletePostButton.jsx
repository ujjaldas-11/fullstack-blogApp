'use client';

import { deletePost } from "@/server/actions/posts";

export default function DeletePostButtno({ slug }) {
    const handleDelete = async (formData) => {
        if (!confirm('Are you sure you want to delete this post?')) {
            e.preventDefault();
        }
        await deletePost(slug);
    };

    return (
        <form action={handleDelete}>
            <button
                type="submit"
                className="w-full px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
            >
                Delete Post
            </button>
        </form>
    )
}

