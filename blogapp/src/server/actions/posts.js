'use server';
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
// import { Erica_One } from "next/font/google";


export default async function createPost(formData) {
    const title = formData.get('title');
    const content = formData.get('content');

    const {error} = await supabase
        .from('posts')
        .insert({title: content});
    
    if(error) {
            console.error(error);
            return {success: false, error: error.message}
    }

    revalidatePath('/blog');
    return {success: true};
}