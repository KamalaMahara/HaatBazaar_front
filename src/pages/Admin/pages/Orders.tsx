import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchAdminOrders, updateAdminOrderStatus, deleteAdminOrder } from "../../../store/adminOrderSlice";
import { Status } from "../../../globals/types/types";
import { SectionHeader, TableWrapper, StatusBadge, Btn, ConfirmModal } from "../components/UI";
import { Eye, Trash2, ArrowUpDown } from "lucide-react";

const STATUS_OPTIONS = ["Pending", "Preparation", "Ontheway", "Delivered", "Cancelled"];

const Orders: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, status } = useAppSelector((store) => store.adminOrders);

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId: string, nextStatus: string) => {
    dispatch(updateAdminOrderStatus(orderId, nextStatus));
  };

  const handleDelete = (orderId: string) => {
    dispatch(deleteAdminOrder(orderId));
    setConfirmDelete(null);
  };

  const filteredOrders = orders.filter((o) => {
    const term = search.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(term) ||
      `${o.firstName} ${o.lastName}`.toLowerCase().includes(term) ||
      o.email.toLowerCase().includes(term);

    const matchesStatus =
      selectedStatus === "All" ||
      o.orderStatus.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  if (status === Status.LOADING) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
        <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mr-3" />
        Loading orders...
      </div>
    );
  }

  if (status === Status.ERROR) {
    return (
      <div className="flex items-center justify-center py-20 text-red-400 text-sm">
        Failed to load orders. Please check your permissions or backend.
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Customer Orders"
        subtitle={`${orders.length} total orders placed`}
      />

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Order ID, Name, or Email..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-gray-800 border border-white/[0.1] text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        />
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-gray-800 border border-white/[0.1] text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        >
          <option value="All">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Order Table */}
      <div className="hidden lg:block">
        <TableWrapper>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {["Order ID", "Customer Details", "Total Amount", "Status", "Payment", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-500 text-sm">
                    No orders match your filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <React.Fragment key={o.id}>
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4 font-mono text-sm">
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
                          className="text-amber-500 hover:underline font-bold text-left border-none bg-transparent cursor-pointer"
                        >
                          #{o.id.slice(-6).toUpperCase()}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-100">
                          {o.firstName} {o.lastName}
                        </p>
                        <p className="text-xs text-gray-400">{o.email}</p>
                      </td>
                      <td className="px-5 py-4 font-bold text-gray-100 text-sm">
                        Rs. {o.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={o.orderStatus}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className="bg-gray-700 text-white rounded-lg text-xs px-2 py-1.5 border border-white/10 outline-none focus:border-amber-500"
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs text-gray-300 capitalize">{o.Payment?.paymentMethod || "COD"}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${o.Payment?.paymentstatus === "paid" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                          {o.Payment?.paymentstatus || "Unpaid"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <Btn small onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)} variant="ghost">
                            <Eye size={14} className="inline mr-1" /> View Details
                          </Btn>
                          <Btn small variant="danger" onClick={() => setConfirmDelete(o.id)}>
                            <Trash2 size={14} />
                          </Btn>
                        </div>
                      </td>
                    </tr>

                    {/* EXPANDED NESTED DETAILS */}
                    {expandedOrder === o.id && (
                      <tr>
                        <td colSpan={6} className="bg-gray-800/40 px-8 py-5 border-l-2 border-amber-500">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
                            <div>
                              <h4 className="font-bold text-white mb-2 text-xs uppercase tracking-wider">Shipping Details</h4>
                              <p><span className="text-gray-500">Phone:</span> {o.phoneNumber}</p>
                              <p><span className="text-gray-500">Address:</span> {o.addressline}, {o.city}, {o.state}</p>
                              <p><span className="text-gray-500">Zip:</span> {o.zipCode}</p>
                              <p><span className="text-gray-500">Order Placed:</span> {new Date(o.createdAt).toLocaleString()}</p>
                            </div>
                            <div>
                              <h4 className="font-bold text-white mb-2 text-xs uppercase tracking-wider">Items Ordered</h4>
                              <div className="space-y-3">
                                {o.OrderDetail?.map((detail) => (
                                  <div key={detail.id} className="flex justify-between items-center bg-gray-900/50 p-2.5 rounded-xl border border-white/5">
                                    <div>
                                      <p className="font-semibold text-white text-xs">{detail.Product?.productName || "Unknown Product"}</p>
                                      <p className="text-[10px] text-gray-400">Qty: {detail.quantity} × Rs. {detail.Product?.productPrice}</p>
                                    </div>
                                    <p className="text-amber-500 font-bold text-xs">
                                      Rs. {((detail.Product?.productPrice || 0) * detail.quantity).toLocaleString()}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </TableWrapper>
      </div>

      {/* Mobile view cards */}
      <div className="flex flex-col gap-3 lg:hidden">
        {filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No orders found.</p>
        ) : (
          filteredOrders.map((o) => (
            <div key={o.id} className="bg-gray-800 rounded-2xl border border-white/[0.07] p-4 text-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-amber-500">#{o.id.slice(-6).toUpperCase()}</span>
                <span className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="font-semibold text-gray-200">{o.firstName} {o.lastName}</p>
              <p className="text-xs text-gray-400">{o.email}</p>
              <div className="mt-3 flex justify-between items-center">
                <span className="font-bold text-white">Rs. {o.totalAmount.toLocaleString()}</span>
                <select
                  value={o.orderStatus}
                  onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  className="bg-gray-700 text-white rounded-lg text-xs px-2 py-1.5 border border-white/10 outline-none"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-3 pt-3 border-t border-white/[0.07] flex justify-between gap-2">
                <Btn small onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)} variant="ghost" className="flex-1">
                  View Details
                </Btn>
                <Btn small variant="danger" onClick={() => setConfirmDelete(o.id)}>
                  Delete
                </Btn>
              </div>

              {expandedOrder === o.id && (
                <div className="mt-4 p-3 bg-gray-900/50 rounded-xl space-y-3 text-xs text-gray-300">
                  <p><span className="text-gray-500 font-bold">Phone:</span> {o.phoneNumber}</p>
                  <p><span className="text-gray-500 font-bold">Address:</span> {o.addressline}, {o.city}, {o.state}</p>
                  <p><span className="text-gray-500 font-bold">Payment Method:</span> {o.Payment?.paymentMethod || "COD"} ({o.Payment?.paymentstatus || "Unpaid"})</p>
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    {o.OrderDetail?.map((detail) => (
                      <div key={detail.id} className="flex justify-between">
                        <span>{detail.Product?.productName} (x{detail.quantity})</span>
                        <span className="text-amber-500">Rs. {((detail.Product?.productPrice || 0) * detail.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <ConfirmModal
          message="Are you sure you want to delete this order? This will remove order details and payment records."
          onConfirm={() => handleDelete(confirmDelete)}
          onClose={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
};

export default Orders;
