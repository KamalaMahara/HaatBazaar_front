import React, { useEffect, useRef, useState, type ChangeEvent, type SyntheticEvent } from "react";
import Navbar from "../../../../globals/types/components/Navbar/navbar";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { PaymentMethod, type IData } from "./types";
import { orderItem } from "../../../../store/checkoutSlice";
import { Status } from "../../../../globals/types/types";

const EMPTY_FORM: IData = {
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
};

const Checkout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((store) => store.cart);
  const khaltiUrl = useAppSelector((store) => store.orders.khaltiUrl);
  const formRef = useRef<HTMLFormElement>(null);

  const [paymentType, setPaymentType] = useState<PaymentMethod>(PaymentMethod.Cod);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId] = useState(() => `ORD-${Math.floor(1000 + Math.random() * 9000)}`);
  const [data, setData] = useState<IData>(EMPTY_FORM);

  const subTotal = items.reduce(
    (total, item) => Number(item.product.productPrice) * item.quantity + total,
    0
  );
  const shipping = 100;
  const total = subTotal + shipping;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Resets form state + native input values
  const resetForm = () => {
    setData(EMPTY_FORM);
    setPaymentType(PaymentMethod.Cod);
    formRef.current?.reset();
  };

  const handleDone = () => {
    setShowSuccess(false);
    resetForm();
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
      paymentMethod: paymentType
    };

    dispatch(orderItem(finalData));

    if (paymentType !== PaymentMethod.Khalti) {
      setShowSuccess(true);
    }
  };

  const getConfirmButtonProps = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.Khalti:
        return { text: "CONFIRM ORDER WITH KHALTI", color: "#ac70f0" };
      case PaymentMethod.Esewa:
        return { text: "CONFIRM ORDER WITH ESEWA", color: "#3cc469" };
      case PaymentMethod.Cod:
      default:
        return { text: "CONFIRM ORDER WITH COD", color: "#F59E0B" };
    }
  };

  const { text, color } = getConfirmButtonProps(paymentType);

  useEffect(() => {
    if (paymentType === PaymentMethod.Khalti && khaltiUrl) {
      window.location.href = khaltiUrl;
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
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <section className="bg-[#1F2937] p-8 rounded-2xl border border-white/10">
              <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="firstName" value={data.firstName} onChange={handleChange} placeholder="First Name" className="input" required />
                <input type="text" name="lastName" value={data.lastName} onChange={handleChange} placeholder="Last Name" className="input" required />
                <input type="email" name="email" value={data.email} onChange={handleChange} placeholder="Email Address" className="input col-span-2" required />
                <input type="tel" name="phoneNumber" value={data.phoneNumber} onChange={handleChange} placeholder="Phone Number" className="input col-span-2" required />
                <input type="text" name="addressLine" value={data.addressLine} onChange={handleChange} placeholder="Street Address / Area" className="input col-span-2" required />
                <input type="text" name="city" value={data.city} onChange={handleChange} placeholder="City" className="input" required />
                <input type="text" name="zipCode" value={data.zipCode} onChange={handleChange} placeholder="Zip Code" className="input" required />
                <input type="text" name="state" value={data.state} onChange={handleChange} placeholder="Province / State" className="input col-span-2" required />
              </div>
            </section>

            <section className="bg-[#1F2937] p-8 rounded-2xl border border-white/10">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="flex gap-4 mb-8">
                <button type="button" onClick={() => setPaymentType(PaymentMethod.Cod)}
                  className={`payment-btn flex-1 ${paymentType === PaymentMethod.Cod ? "active" : ""}`}>
                  Cash on Delivery
                </button>
                <button type="button" onClick={() => setPaymentType(PaymentMethod.Khalti)}
                  className={`payment-btn flex-1 ${paymentType === PaymentMethod.Khalti ? "active" : ""}`}>
                  Khalti
                </button>
                <button type="button" onClick={() => setPaymentType(PaymentMethod.Esewa)}
                  className={`payment-btn flex-1 ${paymentType === PaymentMethod.Esewa ? "active" : ""}`}>
                  Esewa
                </button>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-3 text-sm">
                <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>Rs. {subTotal}</span></div>
                <div className="flex justify-between text-gray-400"><span>Delivery Charge</span><span>Rs. {shipping}</span></div>
                <div className="flex justify-between text-2xl font-black text-[#F59E0B] pt-4 border-t border-white/5">
                  <span>Total Payable</span>
                  <span>Rs. {total}</span>
                </div>
              </div>

              <button type="submit" style={{ backgroundColor: color }}
                className="w-full mt-8 text-[#111827] font-black py-4 rounded-xl hover:opacity-90 transition-all transform active:scale-95 shadow-lg">
                {text}
              </button>
            </section>
          </form>
        </div>
      </div>

      {/* ✅ SUCCESS OVERLAY */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div
            className="bg-[#1F2937] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
            style={{ animation: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            {/* Check circle */}
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 28 28">
                <polyline points="5,14 11,21 23,8" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-white mb-1">Order Placed Successfully!</h3>
            <p className="text-gray-400 text-sm mb-6">
              Thank you, {data.firstName || "there"}! Your order is confirmed.
            </p>

            <div className="space-y-2 text-sm text-left border-t border-white/10 pt-4 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Order ID</span>
                <span className="font-bold text-[#F59E0B]">#{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payment</span>
                <span className="font-semibold">
                  {paymentType === PaymentMethod.Cod ? "Cash on Delivery" : paymentType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total</span>
                <span className="font-semibold">Rs. {total}</span>
              </div>
            </div>

            <span className="inline-block bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full mb-6">
              Estimated delivery: 2–3 days
            </span>

            {/* ✅ Done button */}
            <button
              onClick={handleDone}
              className="w-full py-3 rounded-xl font-black text-[#111827] bg-[#F59E0B] hover:opacity-90 active:scale-95 transition-all"
            >
              DONE
            </button>
          </div>
        </div>
      )}

      <style>{`
        .input { background: #111827; border: 1px solid rgba(255,255,255,0.1); padding: 14px; border-radius: 12px; outline: none; transition: 0.3s; width: 100%; font-size: 0.9rem; color: #F9FAFB; }
        .input:focus { border-color: #F59E0B; background: #0f172a; }
        .payment-btn { padding: 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); transition: 0.3s; font-weight: bold; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: #F9FAFB; background: transparent; }
        .payment-btn.active { background: #F59E0B; color: #111827; border-color: #F59E0B; box-shadow: 0 4px 15px rgba(245,158,11,0.2); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(245,158,11,0.2); border-radius: 10px; }
        @keyframes popIn { from { transform: scale(0.82); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </>
  );
};

export default Checkout;