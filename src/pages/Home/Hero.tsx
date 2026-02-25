import React from 'react';
import { ArrowUpRight, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router';


const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] bg-[#111827] text-[#F9FAFB] flex flex-col justify-center overflow-hidden pt-20 px-4">

      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#F59E0B]/10 via-transparent to-transparent opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left: Content (5 Columns) */}
        <div className="lg:col-span-5 z-10 flex flex-col justify-center h-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit mb-8 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-gray-400">Elegance in Every Selection.</span>
          </div>

          <h1 className="text-[clamp(3rem,8vw,5.5rem)] font-black leading-[0.85] tracking-tighter mb-8 uppercase italic">
            SHOP YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] to-amber-200">FAVORITES.</span>
          </h1>

          <p className="max-w-md text-gray-400 text-lg mb-10 leading-tight font-light">
            From daily essentials to unique treasures, find everything you need in one vibrant destination.Experience commerce, redefined for 2026.
          </p>

          <div className="flex gap-4">
            <Link
              to="/login"
              className="h-16 px-10 bg-[#F59E0B] text-[#111827] font-black rounded-full flex items-center gap-3 hover:scale-105 transition-transform active:scale-95"
            >
              BUY NOW <ShoppingCart size={20} />
            </Link>


          </div>
        </div>

        {/* Right: Modern Bento Visuals (7 Columns) */}
        <div className="lg:col-span-7 grid grid-cols-6 grid-rows-6 gap-4 h-[600px] w-full">

          {/* Main Card: Tech/Fashion Mix */}
          <div className="col-span-4 row-span-4 relative rounded-3xl overflow-hidden border border-white/10 group shadow-2xl">
            <img
              src="https://miro.medium.com/v2/resize:fit:1400/0*E1lt9EKQAbugpKF9"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              alt="Luxury Tech"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent opacity-60" />
            <div className="absolute bottom-6 left-6">
              <span className="text-xs font-bold text-[#F59E0B] tracking-widest uppercase">Featured</span>
              <h3 className="text-2xl font-black italic">ULTRA-PRO SERIES</h3>
            </div>
          </div>



          {/** top card BEauty  */}
          <div className="col-span-2 row-span-3 relative rounded-3xl overflow-hidden border border-white/10">

            {/* Image */}
            <img
              src="https://i.pinimg.com/736x/92/3c/af/923caf1a0be826102b5fcffa7f4ea9d8.jpg"
              className="absolute inset-0 w-full h-full object-cover"
              alt="Shoes"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-[#F59E0B]/20 mix-blend-overlay" />

            {/* Text Content */}
            <div className="absolute bottom-6 left-6 z-10 text-white">
              <p className="text-xs font-bold uppercase tracking-tighter">
                New Arrivals
              </p>
              <h4 className="text-lg font-black italic">
                BEAUTY+
              </h4>
            </div>

          </div>


          {/* Bottom Card: Small Square */}
          <div className="col-span-2 row-span-3 relative rounded-3xl overflow-hidden border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80"
              className="w-full h-full object-cover"
              alt="Shoes"
            />
            <div className="absolute inset-0 bg-[#F59E0B]/20 mix-blend-overlay" />
          </div>

          {/* Horizontal Wide Card */}
          <div className="col-span-4 row-span-2 bg-[#F9FAFB] text-[#111827] rounded-3xl p-6 flex items-center justify-between group cursor-pointer hover:bg-[#F59E0B] transition-colors duration-500">

            <div>
              <p className="text-[40px] font-black tracking-tighter leading-none italic uppercase">SALE  40% OFF</p>
              <p className="text-xs font-bold uppercase tracking-widest mt-1 opacity-70">Summer Fashion Week</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-[#111827] text-white flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform duration-500">
              <ArrowUpRight size={24} />
            </div>
          </div>

        </div>
      </div>

      {/* Background Text Scroller (Very Modern Aesthetic) */}
      <div className="absolute bottom-4 left-0 w-full overflow-hidden opacity-[0.03] select-none pointer-events-none whitespace-nowrap">
        <span className="text-[12rem] font-black italic uppercase leading-none">
          Fashion Electronics Beauty Accessories Food Shoes Fashion Electronics Beauty
        </span>
      </div>
    </section>
  );
};

export default Hero;