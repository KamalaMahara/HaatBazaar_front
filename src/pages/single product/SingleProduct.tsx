import { useEffect, useState } from 'react';
import Navbar from "../../globals/types/components/Navbar/navbar";
import { ShoppingBag, ShieldCheck, Truck, RefreshCcw, Plus, Minus, Heart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSingleProduct } from '../../store/productSlice';
import { useParams } from 'react-router';

const SingleProduct = () => {
  const { id } = useParams()
  const { product } = useAppSelector((store) => store.products)

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const dispatch = useAppDispatch()
  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id))
      console.log(id)
    }
  }, [])


  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#111827] text-[#F9FAFB] pt-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto py-12 lg:py-20">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* 1. Left: Product Gallery Visual */}
            <div className="space-y-6">
              <div className="relative aspect-square bg-[#F9FAFB] rounded-[2.5rem] overflow-hidden group border border-white/5">
                <img
                  src={`http://localhost:8000/${product?.productImageUrl}`}
                  alt={product?.productName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 bg-[#111827]/80 backdrop-blur-xl text-[#F59E0B] text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-white/10 shadow-2xl">
                    Premium Edition
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Right: Product Details Info */}
            <div className="flex flex-col">
              <p className="text-[#F59E0B] text-xs font-black uppercase tracking-[0.4em] mb-4">
                {product?.category.categoryName}
              </p>

              <h1 className="text-5xl lg:text-6xl font-bold tracking-tighter mb-6 leading-none uppercase">
                {product?.productName}
              </h1>

              <div className="flex items-center justify-between border-b border-white/5 pb-8 mb-8">
                <div className="space-y-1">
                  {/* <div className="flex items-center gap-1 text-[#F59E0B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} strokeWidth={2} />
                    ))}
                    <span className="ml-2 text-sm text-[#F9FAFB] font-bold">{product.rating}</span>

                  </div> */}
                  <p className="text-[12px] font-bold text-gray-500  tracking-widest text-center lg:text-left">
                    <span className='text-amber-500'>{product?.productTotalStock} </span> Units available in stock.
                  </p>

                </div>
                <p className="text-4xl font-black text-[#F9FAFB] tracking-tight">
                  ${product?.productPrice?.toFixed(2)}
                </p>
              </div>

              <div className="space-y-6 mb-10">
                <p className="text-gray-400 leading-relaxed font-medium">
                  {product?.productDescription}
                </p>

              </div>

              {/* Selection & Action Controls */}
              <div className="space-y-6 mb-12">
                <div className="flex items-center gap-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-white/10 rounded-xl bg-white/5 overflow-hidden h-14">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 hover:bg-white/5 text-gray-400 hover:text-white transition-colors h-full"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 hover:bg-white/5 text-gray-400 hover:text-white transition-colors h-full"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button className="flex-1 h-14 bg-[#F59E0B] text-[#111827] font-black uppercase text-[11px] tracking-[0.2em] rounded-xl flex items-center justify-center gap-3 hover:bg-[#F9FAFB] transition-all shadow-lg active:scale-[0.98]">
                    <ShoppingBag size={18} strokeWidth={2.5} />
                    Add to Cart
                  </button>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`h-14 w-14 rounded-xl flex items-center justify-center border transition-all duration-300 ${isWishlisted
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-500'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:text-[#F9FAFB] hover:border-white/20'
                      }`}
                  >
                    <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                  </button>
                </div>


              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-8">
                <div className="flex flex-col items-center gap-2 text-center group">
                  <ShieldCheck size={20} className="text-[#F59E0B] opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center group">
                  <Truck size={20} className="text-[#F59E0B] opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Global Ddelivery</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center group">
                  <RefreshCcw size={20} className="text-[#F59E0B] opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">30d Returns</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default SingleProduct;