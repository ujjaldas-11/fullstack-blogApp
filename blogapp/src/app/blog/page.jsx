import { createSupabaseServerClient } from '@/lib/supabase/server';
import AuthGreeting from '@/components/AuthGreeting';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
    const supabase = await createSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();

    // Fetch posts
    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, title, content, slug, created_at, author_id')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error:', error);
        return <p className="text-center p-8 text-red-500">Error loading posts.</p>;
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="text-center p-16">
                <p className="text-2xl mb-6">No posts yet!</p>
                <AuthGreeting />
            </div>
        );
    }

    // Fetch usernames
    const authorIds = [...new Set(posts.map(p => p.author_id).filter(Boolean))];
    let authorMap = {};

    if (authorIds.length > 0) {
        const { data: profiles } = await supabase
            .from('profiles')
            .select('user_id, username')
            .in('user_id', authorIds);

        if (profiles) {
            authorMap = Object.fromEntries(profiles.map(p => [p.user_id, p.username || 'Anonymous']));
        }
    }

    // Add username & featured image preview to each post
    const postsWithData = posts.map(post => {
        const imageMatch = post.content.match(/<img[^>]+src=["']([^"']+)["']/i);
        return {
            ...post,
            username: authorMap[post.author_id] || 'Anonymous',
            featuredImage: imageMatch ? imageMatch[1] : null,
            // Remove first image from content preview
            previewContent: imageMatch
                ? post.content.replace(/<img[^>]*>/, '').trim()
                : post.content,
        };
    });

    return (
        <div className="max-w-7xl mx-auto p-8">
            {/* Greeting */}
            <div className="text-center mb-12">
                <AuthGreeting />
            </div>

            <h1 className="text-5xl font-bold text-center mb-16">My Blog</h1>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {postsWithData.map((post) => (
                    <Link href={`/blog/${post.slug}`} key={post.id}>
                        <Card
                        //  className="hover:shadow-xl transition-shadow overflow-hidden"
                        >

                            <CardHeader>
                                <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                                <CardDescription>
                                    By {post.username} • {new Date(post.created_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>

                                <div>
                                    {post.featuredImage && (
                                        <img
                                            src={post.featuredImage}
                                            alt={post.title}
                                            className="h-[20vh] w-full object-cover rounded-lg mb-2"
                                        />
                                    )}
                                </div>

                                {/* <div
                                    className="text-sm text-gray-600 line-clamp-4"
                                    dangerouslySetInnerHTML={{ __html: post.previewContent }}
                                /> */}
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Floating New Post Button */}
            <div className="fixed bottom-8 right-8">
                <Button size="lg" className="rounded-full shadow-2xl">
                    <Link href="/write" className="flex items-center gap-2">
                        <span className="text-2xl">+</span>
                        New Post
                    </Link>
                </Button>
            </div>
        </div>
    );
}