import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Truck, Edit3 } from "lucide-react";
import Navbar from "../../globals/types/components/Navbar/navbar";
import { useAppSelector } from "../../store/hooks";

const MyOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items } = useAppSelector((store) => store.orders);
  const [orderDetail, setOrderDetail] = useState<any>(null);

  useEffect(() => {
    // Find specific product detail from the store
    const found = items
      .flatMap((order: any) =>
        (Array.isArray(order.OrderDetail) ? order.OrderDetail : [order.OrderDetail])
          .map((detail: any) => ({ ...detail, parentOrder: order }))
      )
      .find((item: any) => item.id === id);

    setOrderDetail(found);
  }, [id, items]);

  if (!orderDetail) {
    return <div className="min-h-screen bg-[#111827] flex items-center justify-center text-white">Loading...</div>;
  }

  const { Product, parentOrder } = orderDetail;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#111827] text-[#F9FAFB]">
        <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">

          {/* HEADER SECTION */}
          <div className="flex justify-start item-start space-y-2 flex-col">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-[#F59E0B] transition-colors mb-4 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Orders
            </button>
            <h1 className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9">
              Order #{parentOrder?.id.slice(-6).toUpperCase()}
            </h1>
            <p className="text-base font-medium leading-6 text-gray-400">
              {new Date(parentOrder?.createdAt).toLocaleString()}
            </p>
          </div>

          {/* MAIN CONTENT GRID */}
          <div className="mt-10 flex flex-col xl:flex-row justify-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">

            {/* LEFT COLUMN: PRODUCT & SUMMARY */}
            <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">

              {/* CART ITEMS */}
              <div className="flex flex-col justify-start items-start bg-[#1F2937] border border-white/5 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full rounded-2xl">
                <p className="text-lg md:text-xl font-semibold leading-6 text-white">Ordered Item</p>

                <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
                  <div className="pb-4 md:pb-8 w-full md:w-40">
                    <img
                      className="w-full rounded-lg object-cover h-40 md:h-32"
                      src={Product?.productImageUrl}
                      alt={Product?.productName}
                    />
                  </div>
                  <div className="border-b border-white/10 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                    <div className="w-full flex flex-col justify-start items-start space-y-2">
                      <h3 className="text-xl xl:text-2xl font-semibold leading-6 text-white">{Product?.productName}</h3>
                      <p className="text-sm leading-none text-gray-400">
                        Status: <span className="text-[#F59E0B]">{parentOrder?.orderStatus}</span>
                      </p>

                    </div>
                    <div className="flex justify-between space-x-8 items-start w-full">
                      <p className="text-base xl:text-lg leading-6 text-white">Rs. {Product?.productPrice}</p>
                      <p className="text-base xl:text-lg leading-6 text-white">Qty: {orderDetail.quantity}</p>
                      <p className="text-base xl:text-lg font-semibold leading-6 text-[#F59E0B]">
                        Rs. {Product?.productPrice * orderDetail.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SUMMARY & SHIPPING OPTIONS */}
              <div className="flex justify-center flex-col md:flex-row items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">

                {/* CALCULATION SUMMARY */}
                <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-[#1F2937] border border-white/5 space-y-6 rounded-2xl">
                  <h3 className="text-xl font-semibold leading-5 text-white">Summary</h3>
                  <div className="flex justify-center items-center w-full space-y-4 flex-col border-white/10 border-b pb-4">
                    <div className="flex justify-between w-full">
                      <p className="text-base text-gray-400">Subtotal</p>
                      <p className="text-base text-gray-200 font-medium">Rs. {parentOrder?.totalAmount}</p>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <p className="text-base text-gray-400">Shipping</p>
                      <p className="text-base text-gray-200 font-medium">Rs. 0.00</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-base font-semibold text-white">Total</p>
                    <p className="text-base font-semibold text-[#F59E0B]">Rs. {parentOrder?.totalAmount}</p>
                  </div>
                </div>

                {/* SHIPPING METHOD */}
                <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-[#1F2937] border border-white/5 space-y-6 rounded-2xl">
                  <h3 className="text-xl font-semibold leading-5 text-white font-bold">Shipping</h3>
                  <div className="flex justify-between items-start w-full">
                    <div className="flex justify-center items-center space-x-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-[#111827] rounded-lg">
                        <Truck className="text-[#F59E0B]" size={24} />
                      </div>
                      <div className="flex flex-col justify-start">
                        <p className="text-lg leading-6 font-semibold text-white">Standard Delivery</p>
                        <p className="text-sm font-normal text-gray-400">Delivery within 3-5 Business Days</p>
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-[#111827] hover:bg-black text-[#F59E0B] border border-[#F59E0B]/30 font-medium py-4 rounded-xl transition-all">
                    View Tracking Details
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: CUSTOMER INFO */}
            <div className="bg-[#1F2937] border border-white/5 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col rounded-2xl">
              <h3 className="text-xl font-semibold leading-5 text-white">Customer Details</h3>
              <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">

                <div className="flex flex-col justify-start items-start flex-shrink-0">
                  <div className="flex justify-center w-full md:justify-start items-center space-x-4 py-8 border-b border-white/10">
                    <div className="h-12 w-12 rounded-full bg-[#F59E0B] flex items-center justify-center text-black font-bold text-xl">
                      {parentOrder?.Payment?.paymentMethod?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex justify-start items-start flex-col space-y-2">
                      <p className="text-base font-semibold leading-4 text-white">Order Contact</p>
                      <p className="text-sm leading-5 text-gray-400">Payment: {parentOrder?.Payment?.paymentMethod}</p>
                    </div>
                  </div>

                  <div className="flex justify-center text-gray-400 md:justify-start items-center space-x-4 py-4 border-b border-white/10 w-full">
                    <Mail size={18} />
                    <p className="text-sm leading-5">customer@example.com</p>
                  </div>
                </div>

                <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
                  <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
                    <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                      <p className="text-base font-semibold leading-4 text-white">Shipping Address</p>
                      <p className="w-48 lg:w-full text-center md:text-left text-sm leading-5 text-gray-400">
                        Kathmandu, Nepal<br />Bagmati 44600
                      </p>
                    </div>
                  </div>
                  <button className="mt-10 flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium py-4 rounded-xl transition-all">
                    <Edit3 size={16} />
                    Edit Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyOrderDetail;