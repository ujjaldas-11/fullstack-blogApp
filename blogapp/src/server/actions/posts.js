'use server';
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// import { Erica_One } from "next/font/google";


export async function createPost(formData) {
    const title = formData.get('title');
    const content = formData.get('content');

    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');

    const {data, error} = await supabase
        .from('posts')
        .insert({title, content, slug})
        .select()
        .single();
    
    if(error) {
            console.error('Error creating post: ',error);
            return {success: false, error: error.message}
    }

    revalidatePath('/blog');
    redirect(`/blog/slug/${data.content}`);
    return {success: true};
}