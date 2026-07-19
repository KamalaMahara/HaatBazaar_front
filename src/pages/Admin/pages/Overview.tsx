import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchProducts } from "../../../store/adminProductSlice";
import { fetchUsers } from "../../../store/adminUserSlice";
import { fetchAdminOrders } from "../../../store/adminOrderSlice";
import { StatCard, StatusBadge, Badge } from "../components/UI";
import { Status } from "../../../globals/types/types";

const Overview: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, status: productStatus } = useAppSelector((store) => store.adminProducts);
  const { users, status: userStatus } = useAppSelector((store) => store.users);
  const { orders, status: orderStatus } = useAppSelector((store) => store.adminOrders);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchUsers());
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const isLoading =
    productStatus === Status.LOADING ||
    userStatus === Status.LOADING ||
    orderStatus === Status.LOADING;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
        <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mr-3" />
        Loading overview data...
      </div>
    );
  }

  // Calculate stats
  const totalRevenue = orders
    .filter((o) => o.Payment?.paymentstatus?.toLowerCase() === "paid" || o.orderStatus?.toLowerCase() === "delivered")
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const totalOrders = orders.length;
  const totalUsers = users.length;
  const totalProducts = products.length;

  const lowStock = products
    .filter((p) => Number(p.productTotalStock) <= 12)
    .map((p) => ({
      id: p.id,
      name: p.productName,
      category: p.category?.categoryName || "Unknown",
      stock: p.productTotalStock,
      image: p.productImageUrl,
    }));

  const recentPayments = orders
    .filter((o) => o.Payment !== undefined)
    .slice(0, 4)
    .map((o) => ({
      id: `ORD-${o.id.slice(-6).toUpperCase()}`,
      user: `${o.firstName} ${o.lastName}`,
      amount: o.totalAmount,
      status: o.Payment?.paymentstatus === "paid" ? "Completed" : "Pending",
    }));

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-gray-100 mb-1">Dashboard Overview</h2>
      <p className="text-gray-400 text-sm mb-7">Welcome back, Admin. Here's what's happening at HaatBazaar.</p>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard label="Total Revenue" value={`Rs. ${totalRevenue.toLocaleString()}`} icon="💰" iconClass="bg-amber-500/15 text-amber-500" />
        <StatCard label="Total Orders" value={totalOrders.toString()} icon="🛒" iconClass="bg-blue-500/15 text-blue-400" />
        <StatCard label="Total Users" value={totalUsers.toString()} icon="👥" iconClass="bg-violet-500/15 text-violet-400" />
        <StatCard label="Products" value={totalProducts.toString()} icon="📦" iconClass="bg-emerald-500/15 text-emerald-400" />
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent payments */}
        <div className="bg-gray-800 rounded-2xl border border-white/[0.07] p-5">
          <h3 className="text-base font-bold text-gray-100 mb-4">Recent Payments</h3>
          <div className="divide-y divide-white/[0.07]">
            {recentPayments.length === 0 ? (
              <p className="text-center text-gray-500 py-10 text-sm">No recent payments recorded.</p>
            ) : (
              recentPayments.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center py-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-100">{p.id}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{p.user}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-amber-500">Rs. {p.amount.toLocaleString()}</p>
                    <div className="mt-1"><StatusBadge status={p.status} /></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low stock */}
        <div className="bg-gray-800 rounded-2xl border border-white/[0.07] p-5">
          <h3 className="text-base font-bold text-gray-100 mb-4">Low Stock Alert</h3>
          <div className="divide-y divide-white/[0.07]">
            {lowStock.length === 0 ? (
              <p className="text-center text-gray-500 py-10 text-sm">All products are well stocked!</p>
            ) : (
              lowStock.map((p) => {
                const imgUrl = p.image ? (p.image.startsWith("http") ? p.image : `http://localhost:8000/${p.image}`) : null;
                return (
                  <div key={p.id} className="flex justify-between items-center py-3">
                    <div className="flex items-center gap-3">
                      {imgUrl ? (
                        <img src={imgUrl} alt={p.name} className="w-8 h-8 rounded object-cover" />
                      ) : (
                        <span className="text-2xl">📦</span>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-100">{p.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{p.category}</p>
                      </div>
                    </div>
                    <Badge label={`${p.stock} left`} variant={p.stock === 0 ? "danger" : "warning"} />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;