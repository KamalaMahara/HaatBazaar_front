import React from 'react';
import { ShoppingBag, Star } from 'lucide-react';
import type { IProduct } from '../types/types';
import { Link } from 'react-router';

interface ICardProps {
  product: IProduct;
}

const ProductCard: React.FC<ICardProps> = ({ product }) => {
  return (
    <Link to={`/products/${product.id}`}>
      <div className="group flex flex-col bg-transparent">
        {/* Image Container */}
        <div className="relative aspect-[4/5] bg-[#F9FAFB] rounded-2xl overflow-hidden mb-5">
          <img
            src={`http://localhost:8000/${product.productImageUrl}`}
            alt={product.productName}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${product.productTotalStock === 0 ? 'opacity-30 grayscale' : 'opacity-100'
              }`}
          />

          {/* Stock Tag */}
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg border backdrop-blur-md ${product.productTotalStock === 0
                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                : 'bg-black/30 border-white/10 text-white'
                }`}
            >
              {product.productTotalStock === 0
                ? 'Sold Out'
                : `${product.productTotalStock} In Stock`}
            </span>
          </div>

          {/* Hover Add Button */}
          {product.productTotalStock > 0 && (
            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button className="w-full h-12 bg-[#F59E0B] text-[#111827] font-bold text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 hover:bg-[#F9FAFB] transition-colors">
                <ShoppingBag size={16} /> Add to Cart
              </button>
            </div>
          )}
        </div>

        {/* Text Info */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[#F59E0B]">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
              {product.category?.categoryName}
            </span>
            <div className="flex items-center gap-1">
              <Star size={10} fill="currentColor" />
              <span className="text-[10px] font-bold text-gray-400">4.8</span>
            </div>
          </div>

          <h3 className="text-lg font-bold tracking-tight text-[#F9FAFB] group-hover:text-[#F59E0B] transition-colors cursor-pointer">
            {product.productName}
          </h3>

          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-xl font-bold text-[#F9FAFB]">
              {product.productPrice !== null
                ? `$${product.productPrice.toFixed(2)}`
                : "Price N/A"}
            </span>
            <span className="text-[10px] text-gray-500 font-medium uppercase">
              VAT Incl.
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;