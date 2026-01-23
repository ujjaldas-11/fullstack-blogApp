'use client'
import { use, useRef } from "react";
import { supabase } from "@/lib/supabase";
import DeletePostButtno from "@/components/DeletePostButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Eye, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export const dynamic = 'force-dynamic';



export default function PostPage({ params }) {
    const { slug } = use(params);

    const supabase = createSupabaseBrowserClient();

    const [post, setPost] = useState(null);
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('Anonymous');
    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const commentSectionRef = useRef(null);


    // --- EFFECT 1: Fetch Post Data ---
    useEffect(() => {
        const fetchPostUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);

                const { data: post, error } = await supabase
                    .from('posts')
                    .select('id, title, content, slug, created_at, author_id, featured_image, views')
                    .eq('slug', slug)
                    .single();

                if (error || !post) {
                    setLoading(false);
                    return;
                }

                setPost(post);

                // Increment views per load 
                await supabase
                    .from('posts')
                    .update({ views: (post.views || 0) + 1 })
                    .eq('id', post.id);

                // fetch likes count from likes table

                const { count } = await supabase
                    .from('likes')
                    .select('*', { count: 'exact', head: true })
                    .eq('post_id', post.id);

                setLikes(count || 0);

                //check if current user liked this post
                if (user) {
                    const { data: likeData } = await supabase
                        .from('likes')
                        .select('*')
                        .eq('post_id', post.id)
                        .eq('user_id', user.id)
                        .single();

                    setIsLiked(!!likeData);
                }


                // fetch comments
                const { data } = await supabase
                    .from('comments')
                    .select('*')
                    .eq('post_id', post.id)
                    .order('created_at', { ascending: false });

                setComments(data || []);

                // fetch username 

                if (post.author_id) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('full_name')
                        .eq('user_id', post.author_id)
                        .single();

                    if (profile?.full_name) {
                        setUsername(profile.full_name);
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }
        };

        fetchPostUser();
    }, [slug, supabase]);



    //  EFFECT 2: Realtime Comments Subscription 
    useEffect(() => {
        if (!post?.id) return;

        const fetchComments = async () => {
            const { data: commentsData } = await supabase
                .from('comments')
                .select(`*, profiles(full_name)`)
                .eq('post_id', post.id)
                .order('created_at', { ascending: false });

            setLoading(false)
            setComments(commentsData || []);
        };


        // Initial fetch of comments
        fetchComments();

        // Setup subscription
        const subscription = supabase
            .channel(`comments-${post.id}`) // Unique channel per post
            .on('postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'comments',
                    filter: `post_id=eq.${post.id}`
                },
                (payload) => {
                    fetchComments();
                }
            )
            .subscribe();


        return () => {
            supabase.removeChannel(subscription);
        };
    }, [post?.id, supabase]); 


    // handle like 
    const handleLike = async () => {
        if (!user) {
            alert('Please login to like posts');
            return;
        }

        if (!post) return;

        try {
            //unlike
            if (isLiked) {
                const { error } = await supabase
                    .from('likes')
                    .delete()
                    .eq('post_id', post.id)
                    .eq('user_id', user.id)

                if (error) {
                    console.error('like error', error)
                    return;
                }
                //decreament like

                setLikes(likes - 1)
                setIsLiked(false);

            } else {
                // like
                const { error } = await supabase
                    .from('likes')
                    .insert({ post_id: post.id, 'user_id': user.id })

                if (error) {
                    console.log('like error', error);
                    alert('Like failed ', error.message);
                }

                setLikes(likes + 1);
                setIsLiked(true);
            }

        } catch (error) {
            console.error('Error handling like ', error);
        }
    };

    // handle comments

    const handleComments = async () => {
        if (!newComment.trim() || !user) return;

        const { error } = await supabase
            .from('comments')
            .insert({ 'post_id': post.id, content: newComment, 'user_id': user.id })

        if (error) {
            alert('comment failed: ' + error.message);
            return;
        } else {
            setNewComment('');
        };
        console.log(newComment);

    }

    const scrollCommentSection = ()=> {
        commentSectionRef.current?.scrollIntoView({behaviour: 'smooth'})
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-2">
                <div className="flex gap-2 space-y-2">
                    <Skeleton className="h-[50px] w-[50px] rounded-full" />
                    <Skeleton className="h-10 w-[250px]" />
                </div>
                <Skeleton className="h-[300px] w-[350px] rounded-xl" />
                {/* <Skeleton className="h-[300px] w-[350px] rounded-xl" /> */}
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg">Post not found</p>
            </div>
        );
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
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background"></div>
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

                        {/* profile meta data */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 gap-4 sm:gap-6 pt-6 border-t border-slate-800">
                            {/* avatar image  */}
                            <div className="flex items-center gap-3">
                                <Avatar className="w-16 h-16">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="text-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                        {username ? username.charAt(0).toUpperCase() : 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-base sm:text-lg">{username}</p>
                                    <p className="text-sm ">Author</p>
                                </div>

                                <div className=" sm:block w-1.5 h-1.5 rounded-full bg-slate-700"></div>

                                <time className="text-slate-400 text-sm sm:text-base">
                                    {new Date(post.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </time>
                            </div>

                            {/* views, like, comment, save */}

                            <div className="flex flex-row gap-2">

                                <Button className="flex gap-2 bg-transparent text-gray-600 border hover:bg-gray-200">
                                    <Eye />
                                    <p className="font-semibold text-base sm:text-lg">{(post.views || 0) + 1}</p>
                                </Button>

                                <Button
                                    className="flex gap-2 bg-transparent hover:bg-transparent cursor-pointer"
                                    onClick={handleLike}
                                // disabled={isLiked}
                                >
                                    <Heart
                                        className={`
                                            transition-all duration-300 transform cursor-pointer
                                            ${isLiked
                                                ? "text-red-500 fill-red-500 scale-110 animate-heart"
                                                : "text-gray-400 fill-transparent scale-100 hover:scale-110"}
                                        `}
                                    />
                                    <p>{likes}</p>
                                </Button>

                                <Button 
                                    onClick={scrollCommentSection}
                                    className="flex gap-2 bg-transparent text-gray-600 border hover:bg-gray-200 cursor-pointer">
                                    <MessageCircle />
                                </Button>

                                <Button className="flex gap-2 bg-transparent text-gray-600 border hover:bg-gray-200 cursor-pointer">BookMark</Button>
                            </div>

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
                        <div className="grid sm:grid-cols-2 gap-3">
                            <Button className='cursor-pointer'>

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

                {user ? (
                    <section ref={commentSectionRef}>
                        <div className="mb-4">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full p-4 border rounded-lg"
                            />

                            <Button
                                type="button"
                                onClick={handleComments}
                                className="mt-4 cursor-pointer"
                            >Submit</Button>
                        </div>
                    </section>
                ) : (
                    <p>login to comment</p>
                )}





                {/* comments display */}
                {loading ? (
                    <>
                        <Skeleton className="mt-4 h-[50px] w-[70vw]" />
                        <Skeleton className="mt-4 h-[50px] w-[70vw]" />
                        <Skeleton classname="mt-4 h-[50px] w-[70vw]" />
                    </>
                ) : comments.length > 0 ? (

                    comments.map((comment, index) => (
                        <Card key={index} className='mb-4'>
                            <CardContent>
                                <p className="mb-2">{comment.content}</p>
                                <p className="text-sm text-gray-500">
                                    By {comment.profiles?.full_name || 'Anonymous'} • {new Date(comment.created_at).toLocaleDateString()}
                                </p>
                            </CardContent>
                        </Card>
                    ))) : (
                    <p>No comments yet. Be the first!</p>
                )}

                <Link href="/blog" className="text-center mt-4"> <Button className="w-full cursor-pointer">Back to Blog page </Button></Link>
            </div>




            {/* Bottom Spacing */}
            <div className="h-12 sm:h-20"></div>
        </div >
    );
}