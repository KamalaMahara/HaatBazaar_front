import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, PhoneCall, Truck, MapPin, User, CreditCard } from "lucide-react";
import Navbar from "../../globals/types/components/Navbar/navbar";
import { useAppSelector } from "../../store/hooks";

const MyOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items } = useAppSelector((store) => store.orders);
  const [orderDetail, setOrderDetail] = useState<any>(null);

  useEffect(() => {
    const found = items
      .flatMap((order: any) =>
        (Array.isArray(order.OrderDetail) ? order.OrderDetail : [order.OrderDetail])
          .map((detail: any) => ({ ...detail, parentOrder: order }))
      )
      .find((item: any) => item.id === id);

    setOrderDetail(found);
  }, [id, items]);

  if (!orderDetail) {
    return (
      <div className="min-h-screen bg-[#111827] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const { Product, parentOrder } = orderDetail;

  const statusColors: Record<string, string> = {
    pending: "text-yellow-400 bg-yellow-400/10",
    delivered: "text-green-400 bg-green-400/10",
    cancelled: "text-red-400 bg-red-400/10",
    ontheway: "text-blue-400 bg-blue-400/10",
    preparation: "text-purple-400 bg-purple-400/10",
  };

  const statusStyle =
    statusColors[parentOrder?.orderStatus?.toLowerCase()] ??
    "text-gray-400 bg-gray-400/10";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#111827] text-[#F9FAFB]">
        <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">

          {/* HEADER */}
          <div className="flex justify-start items-start flex-col space-y-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-[#F59E0B] transition-colors mb-4 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Orders
            </button>
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9">
                Order #{parentOrder?.id?.slice(-6).toUpperCase()}
              </h1>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusStyle}`}>
                {parentOrder?.orderStatus}
              </span>
            </div>
            <p className="text-base font-medium leading-6 text-gray-400">
              {new Date(parentOrder?.createdAt).toLocaleString()}
            </p>
          </div>

          {/* MAIN GRID */}
          <div className="mt-10 flex flex-col xl:flex-row justify-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">

            {/* LEFT COLUMN */}
            <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">

              {/* ORDERED ITEM */}
              <div className="flex flex-col justify-start items-start bg-[#1F2937] border border-white/5 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full rounded-2xl">
                <p className="text-lg md:text-xl font-semibold leading-6 text-white">Ordered Item</p>
                <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
                  <div className="pb-4 md:pb-8 w-full md:w-40">
                    {Product?.productImageUrl ? (
                      <img
                        className="w-full rounded-lg object-cover h-40 md:h-32"
                        src={Product.productImageUrl}
                        alt={Product.productName}
                      />
                    ) : (
                      <div className="w-full rounded-lg h-40 md:h-32 bg-[#111827] flex items-center justify-center text-gray-500 text-sm">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="border-b border-white/10 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                    <div className="w-full flex flex-col justify-start items-start space-y-2">
                      <h3 className="text-xl xl:text-2xl font-semibold leading-6 text-white">
                        {Product?.productName}
                      </h3>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusStyle}`}>
                        {parentOrder?.orderStatus}
                      </span>
                    </div>
                    <div className="flex justify-between space-x-8 items-start w-full">
                      <p className="text-base xl:text-lg leading-6 text-white">
                        Rs. {Product?.productPrice?.toLocaleString()}
                      </p>
                      <p className="text-base xl:text-lg leading-6 text-white">
                        Qty: {orderDetail.quantity}
                      </p>
                      <p className="text-base xl:text-lg font-semibold leading-6 text-[#F59E0B]">
                        Rs. {(Product?.productPrice * orderDetail.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SUMMARY & SHIPPING */}
              <div className="flex justify-center flex-col md:flex-row items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">

                {/* SUMMARY */}
                <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-[#1F2937] border border-white/5 space-y-6 rounded-2xl">
                  <h3 className="text-xl font-semibold leading-5 text-white">Summary</h3>
                  <div className="flex justify-center items-center w-full space-y-4 flex-col border-white/10 border-b pb-4">
                    <div className="flex justify-between w-full">
                      <p className="text-base text-gray-400">Subtotal</p>
                      <p className="text-base text-gray-200 font-medium">
                        Rs. {(parentOrder?.totalAmount - 100)?.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <p className="text-base text-gray-400">Shipping</p>
                      <p className="text-base text-gray-200 font-medium">Rs. 100</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-base font-semibold text-white">Total</p>
                    <p className="text-base font-semibold text-[#F59E0B]">
                      Rs. {parentOrder?.totalAmount?.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* SHIPPING METHOD */}
                <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-[#1F2937] border border-white/5 space-y-6 rounded-2xl">
                  <h3 className="text-xl font-semibold leading-5 text-white">Shipping</h3>
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
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: CUSTOMER INFO */}
            <div className="bg-[#1F2937] border border-white/5 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col rounded-2xl">
              <h3 className="text-xl font-semibold leading-5 text-white mb-2">Customer Details</h3>

              <div className="flex flex-col w-full h-full space-y-0">

                {/* NAME */}
                <div className="flex items-center space-x-4 py-5 border-b border-white/10 w-full">
                  <div className="w-9 h-9 flex items-center justify-center bg-[#111827] rounded-lg shrink-0">
                    <User size={16} className="text-[#F59E0B]" />
                  </div>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Full Name</p>
                    <p className="text-sm font-semibold text-white">
                      {parentOrder?.firstName && parentOrder?.lastName
                        ? `${parentOrder.firstName} ${parentOrder.lastName}`
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* PAYMENT */}
                <div className="flex items-center space-x-4 py-5 border-b border-white/10 w-full">
                  <div className="w-9 h-9 flex items-center justify-center bg-[#111827] rounded-lg shrink-0">
                    <CreditCard size={16} className="text-[#F59E0B]" />
                  </div>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Payment</p>
                    <p className="text-sm font-semibold text-white capitalize">
                      {parentOrder?.Payment?.paymentMethod ?? "N/A"}
                    </p>
                    <p className={`text-xs capitalize font-medium ${parentOrder?.Payment?.paymentstatus === "paid"
                        ? "text-green-400"
                        : "text-yellow-400"
                      }`}>
                      {parentOrder?.Payment?.paymentstatus ?? "N/A"}
                    </p>
                  </div>
                </div>

                {/* EMAIL */}
                <div className="flex items-center space-x-4 py-5 border-b border-white/10 w-full">
                  <div className="w-9 h-9 flex items-center justify-center bg-[#111827] rounded-lg shrink-0">
                    <Mail size={16} className="text-[#F59E0B]" />
                  </div>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                    <p className="text-sm font-medium text-gray-200 break-all">
                      {parentOrder?.email ?? "N/A"}
                    </p>
                  </div>
                </div>

                {/* PHONE */}
                <div className="flex items-center space-x-4 py-5 border-b border-white/10 w-full">
                  <div className="w-9 h-9 flex items-center justify-center bg-[#111827] rounded-lg shrink-0">
                    <PhoneCall size={16} className="text-[#F59E0B]" />
                  </div>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Phone</p>
                    <p className="text-sm font-medium text-gray-200">
                      {parentOrder?.phoneNumber ?? "N/A"}
                    </p>
                  </div>
                </div>

                {/* ADDRESS */}
                <div className="flex items-start space-x-4 py-5 w-full">
                  <div className="w-9 h-9 flex items-center justify-center bg-[#111827] rounded-lg shrink-0 mt-0.5">
                    <MapPin size={16} className="text-[#F59E0B]" />
                  </div>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Shipping Address</p>
                    <p className="text-sm font-medium text-gray-200 leading-6">
                      {parentOrder?.addressline ?? "N/A"}<br />
                      {parentOrder?.city && parentOrder?.state
                        ? `${parentOrder.city}, ${parentOrder.state}`
                        : ""}<br />
                      {parentOrder?.zipCode ?? ""}
                    </p>
                  </div>
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