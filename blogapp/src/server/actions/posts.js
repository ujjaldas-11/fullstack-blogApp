'use server';
import { supabase } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// import { Erica_One } from "next/font/google";


export async function createPost(formData) {
    console.log('createPost called!', formData.get('title'));

    const supabase = await createSupabaseServerClient();
    const {data: {user}} = await supabase.auth.getUser();

    if(!user) {
        throw new Error('Unauthorized');
        // alert('you are unauthorized!');                                     w
    } 

    const title = formData.get('title');
    const content = formData.get('content');
    const featured_image = formData.get('featured_image') || null; 

    const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');

    const {data, error} = await supabase
        .from('posts')
        .insert({title, content, slug, author_id: user.id, featured_image,})
        .select()
        .single();
    
    if(error) {
            console.error('Error creating post: ',error);
            return {success: false, error: error.message}
    }

    revalidatePath('/blog');
    redirect(`/blog/${slug}`);
    // return {success: true};
}

export async function updatePost(formData) {

    const supabase = await createSupabaseServerClient();
    const {data: { user }} = await supabase.auth.getUser();
    if(!user) throw new Error('Unauthorized');

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

    const supabase = await createSupabaseServerClient();
    const {data: { user }} = await supabase.auth.getUser();
    if(!user) throw new Error('Unauthorized');

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