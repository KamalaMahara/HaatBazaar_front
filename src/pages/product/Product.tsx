import React, { useEffect } from 'react';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';


import ProductCard from './component/ProductCard';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchproducts } from '../../store/productSlice';





const ProductPage: React.FC = () => {

  const dispatch = useAppDispatch()
  const { products } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchproducts())
  }, [dispatch])

  return (<>

    <div className="min-h-screen bg-[#111827] text-[#F9FAFB] font-sans">
      <header className="pt-24 pb-12 px-6 lg:px-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Latest Releases</h1>
            <p className="text-sm text-gray-400 font-medium">Browse our premium collection.</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all">
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-16 px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {products.length > 0 && products.map((product) => {
            return (
              <ProductCard key={product.id} product={product} />
            )
          })}



        </div>
      </main>

      <footer className="py-20 border-t border-white/5 text-center">
        <button className="text-sm font-bold text-gray-400 hover:text-[#F59E0B] uppercase tracking-widest group">
          Load More <ArrowRight size={16} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </footer>
    </div>
  </>);
};

export default ProductPage;