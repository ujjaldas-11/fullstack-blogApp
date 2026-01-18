import React from "react";


export default function BlogCategorieList({ activeCategory, setActiveCategory }) {
  const categories = [
    { name: 'All', icon: '🌐', gradient: 'from-purple-500 to-pink-500' },
    { name: 'Technology', icon: '💻', gradient: 'from-green-500 to-emerald-500' },
    { name: 'AI', icon: '🤖', gradient: 'from-orange-500 to-red-500' },
    { name: 'Politics', icon: '🏛️', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Science', icon: '🔬', gradient: 'from-indigo-500 to-purple-500' },
    { name: 'Travel', icon: '✈️', gradient: 'from-teal-500 to-blue-500' }
  ];


  return (
    <div className="w-full py-4 md:py-6">
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Smooth scroll behavior */
        .category-container {
          scroll-behavior: smooth;
        }
      `}</style>

      <div className="relative w-full px-2 md:px-4">

        {/* fade indicator for mobile scroll */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-400 to-transparent z-10 pointer-events-none md:hidden" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-400 to-transparent z-10 pointer-events-none md:hidden" />

        <div className="category-container flex justify-center items-center gap-2 md:gap-3 overflow-x-scroll p-4 pb-3 md:pb-4 md:jsutify-center">
          {
            categories.map((category, index) => {
              const isActive = activeCategory === category.name;


              return (
                <button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className="group relative flex-shrink-0 snap-center cursor-pointer"
                  style={{
                    animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  {isActive && (
                    <div
                      className={`absolute -inset-1 bg-gradient-to-r ${category.gradient} rounded-2xl blur opacity-75`}
                      style={{ animation: 'pulse 2s ease-in-out infinite' }}
                    />
                  )}

                  <div className={`
                    relative flex items-center gap-3 px-6 py-1 rounded-2xl
                    transition-all duration-300 ease-out 
                    ${isActive
                      ? `bg-gradient-to-r ${category.gradient} text-white shadow-xl scale-105`
                      : 'bg-transparent hover:shadow-lg hover:scale-105 border'
                    }
                  `}>
                    <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </span>
                    <span className="font-semibold whitespace-nowrap">
                      {category.name}
                    </span>

                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </button>
              );
            })
          }


        </div>

      </div>
    </div>
  );
}