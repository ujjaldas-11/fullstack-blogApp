import React from 'react'
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function BlogCard({posts}) {
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {posts.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.id}>
                    <Card className="hover:shadow-xl transition-shadow overflow-hidden h-full">

                        <div className='rounded-lg p-4'>
                            {post.featured_image && (
                                <img
                                    src={post.featured_image}
                                    alt={post.title}
                                    className="w-full h-[35vh] object-cover rounded-xl shadow-lg"
                                />
                            )}
                        </div>
                        <CardHeader>
                            <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                            <CardAction>{post.category}</CardAction>
                            <CardDescription className='text-md'>
                                By {post.username} • {new Date(post.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            ))}
        </div>

    )
}
