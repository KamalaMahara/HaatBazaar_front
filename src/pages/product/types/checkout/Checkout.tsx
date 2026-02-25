import React, { useState, type ChangeEvent, type SyntheticEvent } from "react";
import Navbar from "../../../../globals/types/components/Navbar/navbar";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { PaymentMethod, type IData } from "./types";
import { orderItem } from "../../../../store/checkoutSlice";

const Checkout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((store) => store.cart);

  const [paymentType, setPaymentType] = useState<"card" | "cod">("cod");

  const subTotal = items.reduce((total, item) => Number(item.product.productPrice) * item.quantity + total, 0);
  const shipping = 100;
  const total = subTotal + shipping;

  const [data, setData] = useState<IData>({
    firstName: "",
    lastName: "",
    addressLine: "",
    city: "",
    totalAmount: 0,
    zipCode: "",
    email: "",
    state: "", // State is initialized here
    phoneNumber: "",
    paymentMethod: PaymentMethod.Cod,
    products: []
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const productData = items.map((item) => ({
      productId: item.product.id,
      productQty: item.quantity
    }));

    const finalData = {
      ...data,
      products: productData,
      totalAmount: total,
      paymentMethod: paymentType === "card" ? PaymentMethod.Khalti : PaymentMethod.Cod
    };

    if (productData.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    dispatch(orderItem(finalData));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#111827] text-[#F9FAFB] py-10 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 mt-10">

          {/* LEFT: CART REVIEW */}
          <div className="bg-[#1F2937] p-6 rounded-2xl border border-white/10 h-fit">
            <h2 className="text-xl font-bold mb-6 text-[#F59E0B]">Order Review</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {items.length > 0 ? items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border-b border-white/5 pb-4">
                  <img
                    src={`http://localhost:8000/${item.product.productImageUrl}`}
                    className="w-16 h-16 rounded-lg object-cover border border-white/10"
                    alt="product"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-bold truncate w-40">{item.product.productName}</h3>
                    <p className="text-xs text-gray-400">Qty: {item.quantity} × Rs. {item.product.productPrice}</p>
                  </div>
                  <p className="font-bold text-[#F59E0B]">Rs. {Number(item.product.productPrice) * item.quantity}</p>
                </div>
              )) : <p className="text-gray-500">Your cart is empty.</p>}
            </div>
          </div>

          {/* RIGHT: SHIPPING & PAYMENT */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="bg-[#1F2937] p-8 rounded-2xl border border-white/10">
              <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="firstName" onChange={handleChange} placeholder="First Name" className="input" required />
                <input type="text" name="lastName" onChange={handleChange} placeholder="Last Name" className="input" required />
                <input type="email" name="email" onChange={handleChange} placeholder="Email Address" className="input col-span-2" required />
                <input type="tel" name="phoneNumber" onChange={handleChange} placeholder="Phone Number" className="input col-span-2" required />
                <input type="text" name="addressLine" onChange={handleChange} placeholder="Street Address / Area" className="input col-span-2" required />
                <input type="text" name="city" onChange={handleChange} placeholder="City" className="input" required />
                <input type="text" name="zipCode" onChange={handleChange} placeholder="Zip Code" className="input" required />

                {/* FIXED: Added State Input Here */}
                <input
                  type="text"
                  name="state"
                  onChange={handleChange}
                  placeholder="Province / State"
                  className="input col-span-2"
                  required
                />
              </div>
            </section>

            <section className="bg-[#1F2937] p-8 rounded-2xl border border-white/10">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="flex gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => setPaymentType("cod")}
                  className={`payment-btn flex-1 ${paymentType === "cod" ? "active" : ""}`}
                >
                  Cash on Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType("card")}
                  className={`payment-btn flex-1 ${paymentType === "card" ? "active" : ""}`}
                >
                  Online (Khalti)
                </button>
              </div>

              {/* Price Breakdown */}
              <div className="pt-6 border-t border-white/5 space-y-3 text-sm">
                <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>Rs. {subTotal}</span></div>
                <div className="flex justify-between text-gray-400"><span>Delivery Charge</span><span>Rs. {shipping}</span></div>
                <div className="flex justify-between text-2xl font-black text-[#F59E0B] pt-4 border-t border-white/5">
                  <span>Total Payable</span>
                  <span>Rs. {total}</span>
                </div>
              </div>

              <button type="submit" className="w-full mt-8 bg-[#F59E0B] text-[#111827] font-black py-4 rounded-xl hover:bg-[#fbbf24] transition-all transform active:scale-95 shadow-lg shadow-amber-500/20">
                CONFIRM & PLACE ORDER
              </button>
            </section>
          </form>
        </div>
      </div>

      <style>{`
        .input { background: #111827; border: 1px solid rgba(255,255,255,0.1); padding: 14px; border-radius: 12px; outline: none; transition: 0.3s; width: 100%; font-size: 0.9rem; }
        .input:focus { border-color: #F59E0B; background: #0f172a; }
        .payment-btn { padding: 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); transition: 0.3s; font-weight: bold; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .payment-btn.active { background: #F59E0B; color: #111827; border-color: #F59E0B; box-shadow: 0 4px 15px rgba(245,158,11,0.2); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(245,158,11,0.2); border-radius: 10px; }
      `}</style>
    </>
  );
};

export default Checkout;