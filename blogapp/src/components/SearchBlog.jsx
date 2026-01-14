'use client'

import { useState, useMemo } from "react";
import { Input } from "./ui/input";
import BlogCard from "./BlogCard";
import BlogCategorieList from "./BlogCategorieList";

export default function SearchBlog({ posts }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');


    const filterBlogs = useMemo(() => {

        let result = posts;

        if(activeCategory !== "All")  {
            result = result.filter(post => 
                post.category?.toLowerCase() === activeCategory.toLowerCase()
            )
        }

        if (!searchTerm.trim()) {
            return result;
        }

        const search = searchTerm.toLowerCase();

        return result
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

    }, [searchTerm, activeCategory, posts]);



    return (
        <>

            {/* search blog */}
            <div className='flex justify-center items-center p-2'>
                <Input
                    className="w-[50vw] rounded-full px-4 py-6"
                    type="text"
                    placeholder="search any blog..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Blog Category list component */}
            <BlogCategorieList
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
            />



             {/* Results Info */}
            <div className="text-center text-sm text-slate-600 mb-6">
                Showing {filterBlogs.length} {filterBlogs.length === 1 ? 'post' : 'posts'}
                {activeCategory !== 'All' && ` in ${activeCategory}`}
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
                            {/* <h2 className="text-sm text-center font-bold">Blogs found: {filterBlogs.length}</h2> */}


                            {/* // BlogCard component */}
                            <BlogCard posts={filterBlogs} />
                        </>

                    )
            }


        </>
    )
}