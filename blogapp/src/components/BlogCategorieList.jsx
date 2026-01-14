import React from "react";


export default function BlogCategorieList({ activeCategory, setActiveCategory}) {
    const categories = [
        { name: 'All', icon: '🌐', gradient: 'from-purple-500 to-pink-500' },
        { name: 'Politics', icon: '🏛️', gradient: 'from-blue-500 to-cyan-500' },
        { name: 'Technology', icon: '💻', gradient: 'from-green-500 to-emerald-500' },
        { name: 'AI', icon: '🤖', gradient: 'from-orange-500 to-red-500' },
        { name: 'Science', icon: '🔬', gradient: 'from-indigo-500 to-purple-500' },
        { name: 'Travel', icon: '✈️', gradient: 'from-teal-500 to-blue-500' }
    ];

    // const categoriesWithCounts = categories.map(cat => ({
    //     ...cat,
    //     count: cat.name === 'All'
    //         ? posts.length
    //         : posts.filter(p => p.category?.toLowerCase() === cat.name.toLowerCase()).length
    // }));

    return (
        <>
            {
                categories.map((category) => {
                    const isActive = activeCategory === category.name;  


                    return (
                        <button
                            key={category.name}
                            onClick={() => setActiveCategory(category.name)}
                            className="group relative flex-shrink-0 snap-center"
                        >
                            {isActive && (
                                <div
                                    className={`absolute -inset-1 bg-gradient-to-r ${category.gradient} rounded-2xl blur opacity-75`}
                                />
                            )}

                            <div className={`
                    relative flex items-center gap-3 px-6 py-3 rounded-2xl
                    transition-all duration-300 ease-out
                    ${isActive
                                    ? `bg-gradient-to-r ${category.gradient} text-white shadow-xl scale-105`
                                    : 'bg-white text-slate-700 hover:shadow-lg hover:scale-105 hover:bg-slate-50'
                                }
                  `}>
                                <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
                                    {category.icon}
                                </span>
                                <span className="font-semibold whitespace-nowrap">
                                    {category.name}
                                </span>

                                {/* Post Count Badge
                                {category.count > 0 && (
                                    <span className={`
                      text-xs px-2.5 py-1 rounded-full font-medium
                      transition-all duration-300
                      ${isActive
                                            ? 'bg-white/30 text-white'
                                            : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                                        }
                    `}>
                                        {category.count}
                                    </span>
                                )} */}

                                {isActive && (
                                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full" />
                                )}
                            </div>
                        </button>
                    );
                })
            }
        </>
    )
}