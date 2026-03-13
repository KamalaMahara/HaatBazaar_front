import React, { useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react";
import Navbar from "../../../../globals/types/components/Navbar/navbar";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { PaymentMethod, type IData } from "./types";
import { orderItem } from "../../../../store/checkoutSlice";
import { Status } from "../../../../globals/types/types";

const Checkout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((store) => store.cart);
  const khaltiUrl = useAppSelector((store) => store.orders.khaltiUrl);



  // Use enum directly for paymentType
  const [paymentType, setPaymentType] = useState<PaymentMethod>(PaymentMethod.Cod);


  const subTotal = items.reduce(
    (total, item) => Number(item.product.productPrice) * item.quantity + total,
    0
  );
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
    state: "",
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
      productQty: item.quantity,
      orderStatus: Status.SUCCESS,
      totalAmount: Number(item.product.productPrice) * item.quantity
    }));

    if (productData.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const finalData: IData = {
      ...data,
      products: productData,
      totalAmount: total,
      paymentMethod: paymentType // already an enum
    };

    dispatch(orderItem(finalData));
  };

  // Helper to get button text and color based on selected payment method
  const getConfirmButtonProps = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.Khalti:
        return {
          text: "CONFIRM ORDER WITH KHALTI",
          color: "#ac70f0" // Khalti purple
        };
      case PaymentMethod.Esewa:
        return {
          text: "CONFIRM ORDER WITH ESEWA",
          color: "#3cc469" // Esewa green
        };
      case PaymentMethod.Cod:
      default:
        return {
          text: "CONFIRM ORDER WITH COD",
          color: "#F59E0B" // COD amber
        };
    }
  };

  const { text, color } = getConfirmButtonProps(paymentType);
  useEffect(() => {
    if (paymentType === PaymentMethod.Khalti && khaltiUrl) {
      window.location.href = khaltiUrl; // redirect to Khalti
    }
  }, [paymentType, khaltiUrl]);


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
                    <p className="text-xs text-gray-400">
                      Qty: {item.quantity} × Rs. {item.product.productPrice}
                    </p>
                  </div>
                  <p className="font-bold text-[#F59E0B]">
                    Rs. {Number(item.product.productPrice) * item.quantity}
                  </p>
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
                <input type="text" name="state" onChange={handleChange} placeholder="Province / State" className="input col-span-2" required />
              </div>
            </section>

            <section className="bg-[#1F2937] p-8 rounded-2xl border border-white/10">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="flex gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => setPaymentType(PaymentMethod.Cod)}
                  className={`payment-btn flex-1 ${paymentType === PaymentMethod.Cod ? "active" : ""}`}
                >
                  Cash on Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType(PaymentMethod.Khalti)}
                  className={`payment-btn flex-1 ${paymentType === PaymentMethod.Khalti ? "active" : ""}`}
                >
                  Khalti
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType(PaymentMethod.Esewa)}
                  className={`payment-btn flex-1 ${paymentType === PaymentMethod.Esewa ? "active" : ""}`}
                >
                  Esewa
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

              <button
                type="submit"
                style={{ backgroundColor: color }}
                className="w-full mt-8 text-[#111827] font-black py-4 rounded-xl hover:opacity-90 transition-all transform active:scale-95 shadow-lg"
              >
                {text}
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