import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();

  // Fetch latest 3 posts for preview
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, created_at, content')
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Hero Section */}
      <div className="text-center py-20">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to My Blog
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Thoughts on web development, technology, cricket, and everything in between.
          Powered by Next.js, Supabase, and AI.
        </p>
        <Link
          href="/blog"
          className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg"
        >
          Read Latest Posts →
        </Link>
      </div>

      {/* Latest Posts Preview */}
      {posts && posts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-12">Latest Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="block">
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Link href={`blog/${post.slug}`}>
                      <CardTitle>{post.title}</CardTitle>
                    </Link>
                    <CardDescription>
                      By {post.username} • {new Date(post.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent
                    className="overflow-hidden h-[20vh] w-100%"
                    style={{ maxWidth: '100%' }}
                    dangerouslySetInnerHTML={{
                      __html: post.content.replace(/<img/g, '<img style="width: 100vw; height:20vh; border-radius:8px;"')
                    }}
                  />
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CTA for empty state */}
      {!posts || posts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-600 mb-8">No posts yet — be the first to write one!</p>
          <Link
            href="/login"
            className="text-blue-600 text-xl hover:underline font-medium"
          >
            Log in to start writing →
          </Link>
        </div>
      )}
    </div>
  );
}
