import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Eye, Clock, Calendar } from 'lucide-react';

export default function BlogCard({ posts }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {posts.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.id} className="group">
                    <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-md hover:scale-[1.02]">
                        {/* Featured Image */}
                        {post.featured_image && (
                            <div className="relative w-full aspect-video overflow-hidden p-2">
                                <div className="relative w-full aspect-video">
                                    <img
                                        src={post.featured_image}
                                        alt={post.title}
                                        className="w-full h-full object-cover rounded-xl shadow-lg"
                                    />
                                </div>
                                {/* Category Badge (if available) */}
                                {post.category && (
                                    <Badge className="absolute top-3 right-3 bg-white/90 text-slate-800 hover:bg-white backdrop-blur-sm">
                                        {post.category}
                                    </Badge>
                                )}
                            </div>
                        )}

                        <CardHeader className="space-y-3 pb-3">
                            {/* Title */}
                            <h3 className="text-xl font-bold line-clamp-2 group-hover:text-purple-600 transition-colors">
                                {post.title}
                            </h3>

                           
                        </CardHeader>

                        <CardFooter className="flex flex-col gap-4 pt-0">
                            {/* Author Info */}
                            <div className="flex items-center gap-3 w-full">
                                <Avatar className="w-10 h-10 border-2 border-slate-100">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm">
                                        {post.username ? post.username.charAt(0).toUpperCase() : 'A'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-md font-medium truncate">
                                        {post.username || 'Anonymous'}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(post.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-between w-full pt-3 border-t border-slate-100">
                                <div className="flex items-center gap-4 text-sm text-slate-600">
                                    {/* Views */}
                                    <div className="flex items-center gap-1.5">
                                        <Eye className="w-4 h-4" />
                                        <span>{post.views || 0}</span>
                                    </div>

                                    {/* Reading Time (optional) */}
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        <span>{Math.ceil((post.content?.length || 0) / 1000)} min</span>
                                    </div>
                                </div>

                                {/* Read More Arrow */}
                                <div className="text-purple-600 group-hover:translate-x-1 transition-transform">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                </Link>
            ))}
        </div>
    );
}