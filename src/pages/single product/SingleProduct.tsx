import { useEffect, useState } from 'react';
import Navbar from "../../globals/types/components/Navbar/navbar";
import { ShoppingBag, ShieldCheck, Truck, RefreshCcw, Plus, Minus, CheckCircle2, X, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSingleProduct } from '../../store/productSlice';
import { useParams } from 'react-router';
import { addToCart } from '../../store/cartSlice';

// --- Modern Top-Right Toast Notification ---
const CartToast = ({ product, visible, onClose }: { product: any; visible: boolean; onClose: () => void }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-[100] w-full max-w-md transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${visible
        ? 'translate-x-0 opacity-100'
        : 'translate-x-12 opacity-0 pointer-events-none'
        }`}
    >
      <div className="relative overflow-hidden bg-[#1f2937]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5">
        <div className="flex gap-4">
          {/* Enhanced Product Preview */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 shadow-inner">
              {product?.productImageUrl && (
                <img
                  src={`http://localhost:8000/${product.productImageUrl}`}
                  alt={product?.productName}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1 border-2 border-[#1f2937]">
              <CheckCircle2 size={12} className="text-[#111827]" strokeWidth={3} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[15px] font-semibold  tracking-[0.2em] text-green-500">
                SuccessFully Added 🎉
              </span>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <h4 className="text-base font-bold text-white truncate pr-2">
              {product?.productName}
            </h4>
            <p className="text-sm text-amber-400 mt-1 flex items-center gap-2">
              Added to your Cart<ArrowRight size={14} className="text-amber-500" />
            </p>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-amber-500/30 w-full">
          <div
            className={`h-full bg-amber-500 transition-all linear ${visible ? 'w-full' : 'w-0'}`}
            style={{ transitionDuration: visible ? '4000ms' : '0ms' }}
          />
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const SingleProduct = () => {
  const { id } = useParams();
  const { product } = useAppSelector((store) => store.products);
  const [quantity, setQuantity] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id));
    }
  }, [id, dispatch]); // Added missing dependencies

  const handleAddToCart = () => {
    if (id) {
      dispatch(addToCart(id));
      setToastVisible(true);
    }
  };

  return (
    <>
      <Navbar />

      {/* Modern Toast Notification */}
      <CartToast
        product={product}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      <main className="min-h-screen bg-[#111827] text-[#F9FAFB] pt-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left: Product Gallery */}
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

            {/* Right: Product Details */}
            <div className="flex flex-col">
              <p className="text-[#F59E0B] text-xs font-black uppercase tracking-[0.4em] mb-4">
                {product?.category?.categoryName}
              </p>

              <h1 className="text-5xl lg:text-6xl font-bold tracking-tighter mb-6 leading-none uppercase">
                {product?.productName}
              </h1>

              <div className="flex items-center justify-between border-b border-white/5 pb-8 mb-8">
                <div className="space-y-1">
                  <p className="text-[12px] font-bold text-gray-500 tracking-widest text-center lg:text-left">
                    <span className="text-amber-500">{product?.productTotalStock} </span>
                    Units available in stock.
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
                  <button
                    className="flex-1 h-14 bg-[#F59E0B] text-[#111827] font-black uppercase text-[11px] tracking-[0.2em] rounded-xl flex items-center justify-center gap-3 hover:bg-[#F9FAFB] transition-all shadow-lg active:scale-[0.98]"
                    onClick={handleAddToCart}
                  >
                    <ShoppingBag size={18} strokeWidth={2.5} />
                    Add to Cart
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
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Global Delivery</span>
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