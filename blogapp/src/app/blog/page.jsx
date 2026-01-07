import { createSupabaseServerClient } from '@/lib/supabase/server';
import AuthGreeting from '@/components/AuthGreeting';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
    const supabase = await createSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();

    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, title, content, slug, created_at, author_id, featured_image')
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

    // Add username to each post
    const postsWithData = posts.map(post => ({
        ...post,
        username: authorMap[post.author_id] || 'Anonymous',
    }));

    return (
        <div className="max-w-7xl mx-auto p-8 mt-30">
            <div className="text-center mb-12">
                <AuthGreeting />
            </div>

            <h1 className="text-5xl font-bold text-center mb-16">My Blog</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {postsWithData.map((post) => (
                    <Link href={`/blog/${post.slug}`} key={post.id}>
                        <Card className="hover:shadow-xl transition-shadow overflow-hidden h-full">
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
                            {/* Display featured image if it exists */}
                            <div className='rounded-lg p-4'>
                                {post.featured_image && (
                                    <img
                                        src={post.featured_image}
                                        alt={post.title}
                                        className="w-full h-[30vh] object-cover rounded-xl shadow-lg"
                                    />
                                )}
                            </div>

                            {/* <CardContent>
                                <div
                                    className="text-sm text-gray-600 line-clamp-4"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />
                            </CardContent> */}
                        </Card>
                    </Link>
                ))}
            </div>

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