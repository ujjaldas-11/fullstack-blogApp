'use client';

import { deletePost } from "@/server/actions/posts";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';


export default function DeletePostButtno({ slug }) {
    const handleDelete = async () => {
        // if (!confirm('Are you sure you want to delete this post?')) {
        //     e.preventDefault();
        // }
        await deletePost(slug);
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button
                    type="button"
                    className="w-full px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
                >
                    Delete Post
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg sm:text-xl">
                        Are you sure you want to delete this post?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm sm:text-base">
                        This action cannot be undone. This will permanently delete your post.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                    >
                        Delete Post
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>  
    )
}

