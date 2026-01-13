import React from 'react';
import { Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import BlogCard from '@/components/BlogCard';
import Link from 'next/link';

export default async function EasyWriteLanding() {
  const supabase = await createSupabaseServerClient();
  // Fetch latest 3 posts for preview
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, created_at, content, featured_image')
    .order('created_at', { ascending: false })
    .limit(3);


  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground mt-10">
      {/* Hero Section */}
      <section className="pt-20 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-block mb-6 animate-bounce">
              <div className="px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-semibold">
                ✨ AI-Powered Blog Creation
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 transition-all duration-500 transform hover:scale-105">
              Write Blogs
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                The Easy Way
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-muted-foreground">
              Transform your ideas into stunning blog posts with AI assistance. Built with Next.js and Supabase for blazing-fast performance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">

              <Link href='/blog'>
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg group">
                  Explore Blogs
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                Watch Demo
              </Button>
              </a>
            </div>
          </div>



          {/* Latest Posts Section */}
          <div className="demo mt-22">
            <h2 className="text-4xl font-bold text-center mb-16 animate-pulse">Latest Posts</h2>

            {/* Blog Cards Container */}
            <div className="w-full max-w-6xl mx-auto px-4">
              <div className="rounded-3xl bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 shadow-xl border border-border backdrop-blur-sm overflow-hidden">
                <div className="p-8 md:p-12">
                  {posts && posts.length > 0 ? (
                    <BlogCard posts={posts} />
                  ) : (
                    <div className="text-center space-y-6 py-12">
                      <Sparkles className="w-16 h-16 mx-auto text-purple-600 dark:text-purple-400 animate-pulse" />
                      <div>
                        <p className="text-lg font-semibold text-muted-foreground mb-2">No posts yet</p>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                          Start creating your first blog post to see it here
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>


        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to create amazing content
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="w-12 h-12" />,
                title: "AI-Powered Writing",
                description: "Let AI help you write, edit, and improve your content with intelligent suggestions and auto-completion."
              },
              {
                icon: <Zap className="w-12 h-12" />,
                title: "Lightning Fast",
                description: "Built on Next.js and Supabase for incredible performance and real-time collaboration."
              },
              {
                icon: <Shield className="w-12 h-12" />,
                title: "Secure & Reliable",
                description: "Your data is encrypted and backed up automatically with enterprise-grade security."
              }
            ].map((feature, idx) => (
              <Card key={idx} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card">
                <CardContent className="p-8">
                  <div className="mb-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Start writing in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Sign Up", desc: "Create your free account in seconds" },
              { step: "02", title: "Start Writing", desc: "Use AI assistance to craft your content" },
              { step: "03", title: "Publish", desc: "Share your blog with the world instantly" }
            ].map((item, idx) => (
              <div key={idx} className="text-center group">
                <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="rounded-3xl p-12 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50 border">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Writing?
            </h2>
            <p className="text-xl mb-8 text-muted-foreground">
              Join thousands of writers who trust EasyWrite for their blog
            </p>
            <Link href="/write">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}