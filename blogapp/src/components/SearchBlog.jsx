'use client'

import { useState, useMemo } from "react";
import { Input } from "./ui/input";
import BlogCard from "./BlogCard";

export default function ({ posts }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filterBlogs = useMemo(() => {
        if (!searchTerm.trim()) {
            return posts;
        }

        const search = searchTerm.toLowerCase();

        return posts
            .map(post => {
                const title = post.title.toLowerCase();
                let matchScore = 0;

                // exact match 

                if (title === search) {
                    matchScore = 100;
                }
                else if (title.startsWith(search)) {
                    matchScore = 75;
                }
                else if (title.includes(search)) {
                    matchScore = 50;
                }
                else if (title.split(' ').some(word => word.startsWith(search))) {
                    matchScore = 25;
                }

                return matchScore > 0 ? { ...post, matchScore } : null;
            })
            .filter(Boolean)
            .sort((a, b) => b.matchScore - a.matchScore);
    }, [searchTerm, posts]);



    return (
        <>

            {/* search blog */}
            <div className='flex justify-center items-center p-2'>
                <Input
                    className="w-[50vw] rounded-full"
                    type="text"
                    placeholder="search any blog..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>


            {/*  blog List */}

            {
                filterBlogs.length === 0 ?
                    (
                        <p className="text-center text-3xl text-purple-600 font-semibold">{`No blogs found matching:  ${searchTerm}`}</p>

                    ) :
                    (
                        <>
                        {/* blog count */}
                        <h2 className="text-2xl text-center font-bold">Blogs found: {filterBlogs.length}</h2>

                            {/* // blog catagories */}
                            <div>
                                <ul className='flex justify-center items-center gap-4 m-5'>
                                    <li>All</li>
                                    <li>Politics</li>
                                    <li>Technology</li>
                                    <li>Ai</li>
                                </ul>
                            </div>


                                {/* // BlogCard component */}
                            <BlogCard posts={filterBlogs} />
                        </>

                    )
            }


        </>
    )
}