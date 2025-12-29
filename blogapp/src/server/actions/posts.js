'use server';
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// import { Erica_One } from "next/font/google";


export async function createPost(formData) {
    console.log('createPost called!', formData.get('title'));
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
    redirect(`/blog/${data.slug}`);
    return {success: true};
}

export async function updatePost(formData) {
    const slug = formData.get('slug');
    const title = formData.get('title');
    const content = formData.get('content');

    const newSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');

    const {data, error} = await supabase
    .from('posts')
    .update({title, content, slug: newSlug})
    .eq('slug', slug);

    if(error) {
        console.error("Error updating post: ", error);
        return {error: error.message};
    }

    revalidatePath('/blog');
    redirect(`/blog/${newSlug}`);

}


export async function deletePost(currentSlug) {
    const {error} = await supabase
    .from('posts')
    .delete()
    .eq('slug', currentSlug);

    if(error) {
        console.error("Error deleteing post: ", error);
        return {error: error.message};
    }
    revalidatePath('/blog');
    redirect('/blog');
}