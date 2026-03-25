import React, { useEffect, useState } from "react";
import { Search, ChevronDown, Copy } from "lucide-react";
import Navbar from "../../globals/types/components/Navbar/navbar";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchMyOrders } from "../../store/checkoutSlice";
import { PaymentMethod } from "../product/component/checkout/types";
import { Link } from "react-router";

/* ---------------- TYPES ---------------- */

type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

type Payment = {
  paymentMethod: string;
  paymentStatus: string;
};

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
  totalAmount: number;
  orderStatus: OrderStatus;
  Payment?: Payment;
  items: OrderItem[];
};

/* ---------------- PAYMENT LOGOS ---------------- */

const paymentLogos: Record<PaymentMethod, string> = {
  [PaymentMethod.Esewa]:
    "https://cdn.esewa.com.np/ui/images/logos/esewa-icon-large.png",
  [PaymentMethod.Khalti]:
    "https://avatars.githubusercontent.com/u/31564639?s=280&v=4",
  [PaymentMethod.Cod]:
    "https://cdn-icons-png.flaticon.com/512/2489/2489756.png",
};

const paymentMethodMap: Record<string, PaymentMethod> = {
  cod: PaymentMethod.Cod,
  esewa: PaymentMethod.Esewa,
  khalti: PaymentMethod.Khalti,
};

/* ---------------- HELPERS ---------------- */

const getShortOrderId = (id: string) => "ORD-" + id.slice(-6).toUpperCase();

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

/* ---------------- COMPONENT ---------------- */

const MyOrders: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((store) => store.orders);

  const [orders, setOrders] = useState<Order[]>([]);
  const [openOrder, setOpenOrder] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  /* ------------ FETCH ORDERS ------------ */
  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  /* ------------ MAP & GROUP BACKEND DATA ------------ */
  useEffect(() => {
    if (!items) return;

    const orderMap: Record<string, Order> = {};

    items.forEach((order: any) => {
      const orderId = order.id;

      const rawDetails: any[] = Array.isArray(order.OrderDetail)
        ? order.OrderDetail
        : order.OrderDetail
          ? [order.OrderDetail]
          : [];

      const orderItems: OrderItem[] = rawDetails.map((detail: any) => ({
        id: detail.id,
        name: detail.Product?.productName || "Unknown Product",
        price: detail.Product?.productPrice || 0,
        quantity: detail.quantity || 1,
        image:
          detail.Product?.productImageUrl || "https://via.placeholder.com/80",
      }));

      if (!orderMap[orderId]) {
        orderMap[orderId] = {
          id: order.id,
          date: order.createdAt || new Date().toISOString(),
          totalAmount: order.totalAmount,
          orderStatus: order.orderStatus,
          Payment: order.Payment
            ? {
              paymentMethod: order.Payment.paymentMethod,
              paymentStatus: order.Payment.paymentstatus || "Pending",
            }
            : undefined,
          items: orderItems,
        };
      } else {
        orderMap[orderId].items.push(...orderItems);
      }
    });

    setOrders(Object.values(orderMap));
  }, [items]);

  /* ------------ COPY ORDER ID ------------ */
  const copyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  /* ------------ FILTER & SEARCH ------------ */
  const filteredOrders = orders
    .filter((order) => {
      // Case-insensitive status filter
      if (
        statusFilter !== "All" &&
        order.orderStatus.toLowerCase() !== statusFilter.toLowerCase()
      )
        return false;

      const value = search.toLowerCase();
      const shortId = getShortOrderId(order.id).toLowerCase();
      const paymentMethod = order.Payment?.paymentMethod?.toLowerCase() || "";
      const orderStatus = order.orderStatus.toLowerCase();
      const totalAmount = order.totalAmount.toString();
      const productNames = order.items
        .map((item) => item.name.toLowerCase())
        .join(" ");

      return (
        order.id.toLowerCase().includes(value) ||
        shortId.includes(value) ||
        orderStatus.includes(value) ||
        paymentMethod.includes(value) ||
        totalAmount.includes(value) ||
        productNames.includes(value)
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#111827] text-[#F9FAFB] py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* HEADER */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-gray-400 mt-2">Track and manage your purchases</p>
          </div>

          {/* SEARCH & FILTER */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by order ID, status, payment method, product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#1F2937] border border-white/10 focus:border-[#F59E0B] outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#1F2937] border border-white/10 text-white py-3 px-4 rounded-xl"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* ORDER LIST */}
          <div className="space-y-6">
            {filteredOrders.length === 0 && (
              <div className="text-center text-gray-400 py-10">No orders found</div>
            )}

            {filteredOrders.map((order) => {
              const isOpen = openOrder === order.id;
              const paymentKey = order.Payment?.paymentMethod?.toLowerCase();
              const method = paymentMethodMap[paymentKey || ""];

              return (
                <div
                  key={order.id}
                  className="bg-[#1F2937]/80 backdrop-blur rounded-2xl border border-white/10 overflow-hidden"
                >
                  {/* ORDER HEADER */}
                  <button
                    onClick={() => setOpenOrder(isOpen ? null : order.id)}
                    className="w-full p-6 flex items-center justify-between text-left"
                  >
                    <div>
                      <div className="flex items-center gap-2 relative">
                        <h2 className="font-semibold text-lg">
                          {getShortOrderId(order.id)}
                        </h2>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyOrderId(order.id);
                          }}
                          className="text-gray-400 hover:text-white"
                        >
                          <Copy size={16} />
                        </button>

                        {copiedId === order.id && (
                          <span className="absolute -top-6 left-0 text-xs bg-[#F59E0B] text-black px-2 py-1 rounded-md">
                            Order ID Copied!
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-400">{formatDate(order.date)}</p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-semibold text-[#F59E0B]">
                          Rs. {order.totalAmount}
                        </p>
                        <span className="text-xs px-3 py-1 rounded-full bg-[#F59E0B]/20 text-[#F59E0B]">
                          {order.orderStatus}
                        </span>
                      </div>
                      <ChevronDown className={`transition ${isOpen ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  {/* ORDER DETAILS */}
                  {isOpen && (
                    <div className="p-6 pt-0 space-y-6">
                      {/* PAYMENT */}
                      <div className="p-4 rounded-xl bg-[#111827] border border-white/10 flex justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Payment Method</p>
                          <div className="flex items-center gap-2 font-medium">
                            {method || "Unknown"}
                            {method && (
                              <img
                                src={paymentLogos[method]}
                                alt={method}
                                className="h-7 w-7 object-fit"
                              />
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Payment Status</p>
                          <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400">
                            {order.Payment?.paymentStatus || "Pending"}
                          </span>
                        </div>
                      </div>

                      {/* PRODUCTS */}
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
                            <div className="flex-1 ">
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-gray-400">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-semibold text-[#F59E0B]">
                                Rs. {item.price * item.quantity}
                              </span>
                              <Link to={`/my-orders/${item.id}`}>
                                <button className="mt-1 text-sm text-white underline">
                                  View Product
                                </button>
                              </Link>
                            </div>
                          </div>
                        ))}
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