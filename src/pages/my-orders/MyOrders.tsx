import React, { useEffect, useState } from "react";
import { Search, ChevronDown, CreditCard } from "lucide-react";
import Navbar from "../../globals/types/components/Navbar/navbar";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchMyOrders } from "../../store/checkoutSlice";

/* ---------------- TYPES ---------------- */

type OrderStatus =
  | "Processing"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered";

type PaymentMethod = "Cash on Delivery" | "eSewa" | "Khalti" | "Card";
type PaymentStatus = "Paid" | "Pending" | "Failed";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type Order = {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
};

/* ---------------- SAMPLE DATA ---------------- */

const sampleOrders: Order[] = [
  {
    id: "ORD-1023",
    date: "2026-03-01",
    total: 6100,
    status: "Shipped",
    paymentMethod: "eSewa",
    paymentStatus: "Paid",
    items: [
      {
        id: "1",
        name: "Running Shoes",
        price: 2500,
        quantity: 1,
        image:
          "https://i.pinimg.com/736x/f1/99/17/f19917e9218c1aadbc0a404bbd300e6a.jpg",
      },
      {
        id: "2",
        name: "Sports Sneakers",
        price: 1800,
        quantity: 2,
        image:
          "https://i.pinimg.com/736x/d3/03/8a/d3038a1e3362cbab9b10ab96b98dda11.jpg",
      },
    ],
  },
  {
    id: "ORD-1022",
    date: "2026-02-26",
    total: 2500,
    status: "Delivered",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Paid",
    items: [
      {
        id: "3",
        name: "Casual Shoes",
        price: 2500,
        quantity: 1,
        image:
          "https://i.pinimg.com/736x/0a/ef/44/0aef446b0a2d1efb9b20a4e3d8c0bb5b.jpg",
      },
    ],
  },
];

/* ---------------- VERTICAL TRACKING ---------------- */

const statusSteps: OrderStatus[] = [
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const VerticalTracking: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const activeIndex = statusSteps.indexOf(status);

  return (
    <div className="flex flex-col gap-6">
      {statusSteps.map((step, index) => {
        const isActive = index <= activeIndex;

        return (
          <div key={step} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full border-2 transition
                ${isActive
                    ? "bg-[#F59E0B] border-[#F59E0B]"
                    : "border-white/20"
                  }`}
              />
              {index !== statusSteps.length - 1 && (
                <div
                  className={`w-[2px] h-10 transition
                  ${isActive ? "bg-[#F59E0B]" : "bg-white/10"}`}
                />
              )}
            </div>

            <div>
              <p
                className={`text-sm font-medium
                ${isActive ? "text-white" : "text-gray-400"}`}
              >
                {step}
              </p>
              <p className="text-xs text-gray-500">
                {isActive ? "Completed" : "Pending"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------------- MAIN COMPONENT ---------------- */

const MyOrders: React.FC = () => {
  const [openOrder, setOpenOrder] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const dispatch = useAppDispatch();
  const { items } = useAppSelector((store) => store.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const filteredOrders = sampleOrders.filter((order) => {
    const matchesSearch = order.id
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter = filter === "All" || order.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#111827] text-[#F9FAFB] py-10 px-4">
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight">
              My Orders
            </h1>
            <p className="text-gray-400 mt-2">
              Track and manage your purchases
            </p>
          </div>

          {/* SEARCH + FILTER */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-3.5 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by order ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#1F2937] border border-white/10 focus:border-[#F59E0B] outline-none"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 rounded-xl bg-[#1F2937] border border-white/10 focus:border-[#F59E0B] outline-none"
            >
              <option>All</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Out for Delivery</option>
              <option>Delivered</option>
            </select>
          </div>

          {/* ORDER LIST */}
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const isOpen = openOrder === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-[#1F2937]/80 backdrop-blur rounded-2xl border border-white/10 overflow-hidden"
                >
                  {/* ORDER HEADER */}
                  <button
                    onClick={() =>
                      setOpenOrder(isOpen ? null : order.id)
                    }
                    className="w-full p-6 flex items-center justify-between text-left"
                  >
                    <div>
                      <h2 className="font-semibold text-lg">
                        {order.id}
                      </h2>
                      <p className="text-sm text-gray-400">
                        {order.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right space-y-1">
                        <p className="font-semibold text-[#F59E0B]">
                          Rs. {order.total}
                        </p>

                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          <span className="text-xs px-3 py-1 rounded-full bg-[#F59E0B]/20 text-[#F59E0B]">
                            {order.status}
                          </span>

                          {/* <span
                            className={`text-xs px-3 py-1 rounded-full
                              ${order.paymentStatus === "Paid"
                                ? "bg-green-500/20 text-green-400"
                                : order.paymentStatus === "Pending"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                          >
                            {order.paymentStatus}
                          </span> */}
                        </div>
                      </div>

                      <ChevronDown
                        className={`transition ${isOpen ? "rotate-180" : ""
                          }`}
                      />
                    </div>
                  </button>

                  {/* EXPANDED CONTENT */}
                  {isOpen && (
                    <div className="p-6 pt-0">
                      <div className="flex gap-8">

                        {/* LEFT — TRACKING */}
                        <div className="min-w-[180px] border-r border-white/10 pr-6">
                          <VerticalTracking status={order.status} />
                        </div>

                        {/* RIGHT CONTENT */}
                        <div className="flex-1 space-y-6">

                          {/* PAYMENT INFO */}
                          <div className="p-4 rounded-xl bg-[#111827] border border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <CreditCard className="text-[#F59E0B]" size={20} />
                              <div>
                                <p className="text-sm text-gray-400">
                                  Payment Method
                                </p>
                                <p className="font-medium">
                                  {order.paymentMethod}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-sm text-gray-400">
                                Payment Status
                              </p>
                              <span
                                className={`text-xs px-3 py-1 rounded-full
                              ${order.paymentStatus === "Paid"
                                    ? "bg-green-500/20 text-green-400"
                                    : order.paymentStatus === "Pending"
                                      ? "bg-yellow-500/20 text-yellow-400"
                                      : "bg-red-500/20 text-red-400"
                                  }`}
                              >
                                {order.paymentStatus}
                              </span>
                            </div>
                          </div>

                          {/* ITEMS */}
                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-4 p-4 rounded-xl bg-[#111827] border border-white/10"
                              >
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />

                                <div className="flex-1">
                                  <h3 className="font-medium">
                                    {item.name}
                                  </h3>
                                  <p className="text-sm text-gray-400">
                                    Qty: {item.quantity}
                                  </p>
                                </div>

                                <div className="font-semibold text-[#F59E0B]">
                                  Rs. {item.price * item.quantity}
                                </div>

                                <button className="text-sm text-gray-300 hover:text-white underline">
                                  View Product
                                </button>
                              </div>
                            ))}
                          </div>

                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
};

export default MyOrders;