import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import DeletePostButtno from "@/components/DeletePostButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import Link from "next/link";

export const dynamic = 'force-dynamic';



export default async function PostPage({ params }) {

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { slug } = await params;


    // Fetch the post
    const { data: post, error } = await supabase
        .from('posts')
        .select('id, title, content, slug, created_at, author_id, featured_image')
        .eq('slug', slug)
        .single();

    if (error || !post) {
        notFound(); // 404 page
    }


    let username = 'Anonymous';
    if (post.author_id) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', post.author_id)
            .single();

        if (profile?.full_name) {
            username = profile.full_name;

        }
    }

    const isOwner = user && user.id === post.author_id;



    return (
        <div className="min-h-screen">
            {/*  Image section */}
            <div className="relative w-full">
                {post.featured_image && (
                    <div className="w-full h-[40vh] sm:h-[50vh] lg:h-[65vh] relative overflow-hidden">
                        <img
                            src={`${post.featured_image}?t=${new Date(post.updated_at || post.created_at).getTime()}`}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background"></div>
                    </div>
                )}
            </div>



            {/* Content Container */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 sm:-mt-40 relative z-10">
                {/* Title and Meta Information */}
                <div className="mb-12 sm:mb-16">
                    <div className="space-y-6 sm:space-y-8">

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 pt-6 border-t border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-semibold text-slate-300 text-lg">
                                    {username.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-base sm:text-lg">{username}</p>
                                    <p className="text-sm ">Author</p>
                                </div>
                            </div>

                            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-700"></div>

                            <time className="text-slate-400 text-sm sm:text-base">
                                {new Date(post.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </time>
                        </div>
                    </div>
                </div>



                {/* Article Content */}
                <Card
                    className="wrap-break-word backdrop-blur-sm border p-4 sm:p-10 lg:p-12 mb-8 sm:mb-12 shadow-2xl"
                >
                    <div
                        className="prose prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none
              prose-headings:font-bold prose-headings:mt-10 prose-headings:mb-5 prose-headings:text-slate-100
              prose-p:leading-relaxed prose-p:mb-6 prose-p:text-slate-300
              prose-h2:text-2xl sm:prose-h2:text-3xl lg:prose-h2:text-4xl prose-h2:tracking-tight
              prose-a:text-slate-400 prose-a:underline prose-a:decoration-slate-600 hover:prose-a:text-slate-300 hover:prose-a:decoration-slate-500
              prose-strong:font-semibold prose-strong:text-slate-200
              prose-img:rounded-xl prose-img:shadow-lg prose-img:border prose-img:border-slate-800
              prose-code:text-slate-300 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700"
                        dangerouslySetInnerHTML={{
                            __html: post.content
                        }}
                    />
                </Card>

                {/* Action Buttons */}
                {isOwner && (
                    <div className="backdrop-blur-sm border rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-16 sm:mb-20 shadow-2xl">
                        <div className="flex flex-col justify-center sm:flex-row gap-3 sm:gap-4">
                            <Button>

                                <a
                                    href={`/write/${post.id}`}
                                >
                                    Edit Post
                                </a>
                            </Button>

                            <DeletePostButtno slug={post.slug} />
                        </div>
                    </div>
                )}
                <Link href="/blog" className="text-center"> <Button className="w-full">Back to Blog page </Button></Link>
            </div>


            {/* Bottom Spacing */}
            <div className="h-12 sm:h-20"></div>
        </div>
    );
}
