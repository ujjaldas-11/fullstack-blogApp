import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';

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
                <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow p-6 border border-gray-200">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                  </p>
                  <time className="text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                </div>
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
