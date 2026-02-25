import React from 'react';
import { ArrowRight } from 'lucide-react';

const Categories: React.FC = () => {
  const categories = [
    { name: "Electronics", img: "https://i.pinimg.com/736x/e2/ac/85/e2ac8573878a0dc2e30b22b0674ce13c.jpg" },
    { name: "Fashion", img: "https://i.pinimg.com/1200x/49/37/4b/49374b0ff961f155d6c3c4beb41db662.jpg" },
    { name: "Beauty", img: "https://i.pinimg.com/736x/93/4e/b2/934eb20ece0e64a26ee26f1c97f5d1d0.jpg" },
    { name: "Shoes", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80" },
    { name: "Accessories", img: "https://i.pinimg.com/1200x/5e/c1/ac/5ec1acee784c22bf3729cf914b8e55ac.jpg" },
    { name: "Gadgets", img: "https://i.pinimg.com/736x/44/7b/33/447b333911f933795f59645cf9f25611.jpg" },
  ];

  return (
    <section className="bg-[#111827] py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 border-l-2 border-[#F59E0B] pl-6">
          <div>
            <h2 className="text-4xl font-black text-[#F9FAFB] tracking-tighter uppercase italic leading-none">
              Shop by <span className="text-[#F59E0B]">Categories</span>
            </h2>
            <p className="text-gray-500 text-[10px] font-bold tracking-[0.3em] uppercase mt-2">
              Premium Selection
            </p>
          </div>

          <button className="flex items-center gap-2 group text-[#F9FAFB] hover:text-[#F59E0B] transition-colors">
            <span className="text-xs font-black uppercase tracking-widest">Show All Categories</span>
            <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#F59E0B] transition-all">
              <ArrowRight size={14} />
            </div>
          </button>
        </div>

        {/* Categories Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-800 cursor-pointer shadow-2xl"
            >
              {/* Image with Dark Grading */}
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover brightness-100 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-700 ease-in-out"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-80" />

              {/* Text Inside Picture */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-[0.2em] mb-1">
                  Explore
                </p>
                <h3 className="text-xl font-black text-[#F9FAFB] uppercase italic tracking-tighter leading-none">
                  {cat.name}
                </h3>

                {/* Decorative Bottom Bar */}
                <div className="w-0 group-hover:w-full h-[2px] bg-[#F59E0B] mt-3 transition-all duration-500" />
              </div>

              {/* Subtle Noise Texture Overlay (Modern Aesthetic) */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Categories;