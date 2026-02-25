
import Navbar from "../../globals/types/components/Navbar/navbar";
import { Plus, Minus, ArrowRight, Trash } from 'lucide-react';
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { handleCartItemDelete, handleCartItemUpdate } from "../../store/cartSlice";
import { Link } from "react-router";

const MyCart = () => {
  const { items } = useAppSelector((store) => store.cart)
  const dispatch = useAppDispatch()
  const handleUpdate = (productId: string, quantity: number) => {
    dispatch(handleCartItemUpdate(productId, quantity))
  }

  const handleDelete = (productId: string,) => {
    dispatch(handleCartItemDelete(productId))
  }
  const subTotal = items.reduce((total, item) => Number(item.product.productPrice) * item.quantity + total, 0)

  const totalItemInCarts = items.reduce((total, item) => item.quantity + total, 0)

  const shippingPrice = 100
  const total = subTotal + shippingPrice


  return (
    <div className="bg-[#F9FAFB] min-h-screen font-sans text-[#111827]">
      <Navbar />

      <div className="container mx-auto px-6 lg:px-12 py-24">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-10">Shopping Cart</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT SIDE - Product Table */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-2xl shadow-sm border border-[#111827]-100 p-8 mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#111827]-100">
                    <th className="text-left font-black uppercase text-[10px] tracking-[0.2em] text-[#111827]-400 pb-4">Product</th>
                    <th className="text-left font-black uppercase text-[10px] tracking-[0.2em] text-[#111827]-400 pb-4">Price  </th>
                    <th className="text-left font-black uppercase text-[10px] tracking-[0.2em] text-[#111827]-400 pb-4">Quantity</th>
                    <th className="text-right font-black uppercase text-[10px] tracking-[0.2em] text-[#111827]-400 pb-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    items.length > 0 && items.map((item) => {


                      return (

                        <tr className="group">
                          <td className="py-8">
                            <div className="flex items-center">
                              <div className="h-20 w-20 bg-[#F9FAFB] rounded-xl overflow-hidden mr-6 border border-[#111827]-50">
                                <img
                                  className="h-full w-full object-cover"
                                  src={`http://localhost:8000/${item.product?.productImageUrl}`}
                                  alt="Product"
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-lg tracking-tight">{item?.product?.productName}</span>

                              </div>
                            </div>
                          </td>
                          <td className="py-8">
                            <div className="flex flex-col">
                              <span className="font-bold text-[#111827]">{item.product.productPrice}</span>

                            </div>
                          </td>
                          <td className="py-8">
                            <div className="flex items-center">
                              <button className="border border-gray-200 rounded-lg p-2 hover:bg-[#111827] hover:text-white transition-colors" onClick={() => handleUpdate(item.product.id, item.quantity - 1)}>
                                <Minus size={14} />
                              </button>
                              <span className="text-center w-10 font-bold text-sm">{item.quantity}</span>
                              <button className="border border-gray-200 rounded-lg p-2 hover:bg-[#111827] hover:text-white transition-colors" onClick={() => handleUpdate(item.product.id, item.quantity + 1)}>
                                <Plus size={14} />
                              </button>
                            </div>
                          </td>
                          <td className="py-8 text-right font-black text-lg tracking-tighter">
                            {(item.product.productPrice ?? 0) * item.quantity}
                          </td>
                          <Trash className="mt-4 " size={16} color="red" onClick={() => handleDelete(item.product.id)} />
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT SIDE - Summary */}
          <div className="md:w-1/4">
            <div className="bg-[#111827] rounded-2xl shadow-2xl p-8 text-white sticky top-28">
              <h2 className="text-xl font-bold uppercase tracking-tighter mb-8 border-b border-white/10 pb-4">Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium tracking-tight">Subtotal</span>
                  <span className="font-bold">Rs {subTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium tracking-tight">Total Quantity</span>
                  <span className="text-[#F59E0B] font-bold">{totalItemInCarts}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium tracking-tight">Shipping</span>
                  <span className="font-bold">Rs {shippingPrice}</span>
                </div>

              </div>

              <hr className="my-6 border-white/10" />

              <div className="flex justify-between items-end mb-8">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#F59E0B]">Total</span>
                <span className="text-3xl font-black tracking-tighter">Rs {total}</span>
              </div>

              <Link to="/my-checkout">
                <button className="bg-[#F59E0B] text-[#111827] py-4 px-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] w-full flex items-center justify-center gap-2 hover:bg-white transition-all group">
                  Checkout Now
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCart;