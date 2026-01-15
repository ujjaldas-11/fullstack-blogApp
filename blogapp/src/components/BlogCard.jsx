import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function BlogCard({ posts }) {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {posts.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.id}>
                    <Card className="hover:shadow-xl transition-shadow overflow-hidden h-full">

                        {/* blog image  */}
                        <div className='rounded-lg p-2 sm:p-4'>
                            {post.featured_image && (
                                <div className="relative w-full aspect-video">
                                    <img
                                        src={post.featured_image}
                                        alt={post.title}
                                        className="w-full h-full object-cover rounded-xl shadow-lg"
                                    />
                                </div>
                            )}
                        </div>
                        <CardHeader className="flex flex-col">
                            <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                            <CardDescription className='text-md'>
                                {/* <CardAction>{post.category}</CardAction> */}
                                <div>
                                    By {post.full_name} • {new Date(post.created_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </div>
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            ))}
        </div>

    )
}
