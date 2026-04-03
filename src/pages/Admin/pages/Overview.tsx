import React from "react";
import { seedPayments, seedProducts } from "../data/seeddata";
import { StatCard, StatusBadge, Badge } from "../components/UI";

const Overview: React.FC = () => {
  const lowStock = seedProducts.filter(p => p.stock <= 12);

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-gray-100 mb-1">Dashboard Overview</h2>
      <p className="text-gray-400 text-sm mb-7">Welcome back, Admin. Here's what's happening at HaatBazaar.</p>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard label="Total Revenue" value="Rs. 3,24,500" icon="💰" iconClass="bg-amber-500/15 text-amber-500" delta="12%" />
        <StatCard label="Total Orders" value="1,248" icon="🛒" iconClass="bg-blue-500/15 text-blue-400" delta="8%" />
        <StatCard label="Total Users" value="5" icon="👥" iconClass="bg-violet-500/15 text-violet-400" delta="3%" />
        <StatCard label="Products" value={seedProducts.length} icon="📦" iconClass="bg-emerald-500/15 text-emerald-400" />
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent payments */}
        <div className="bg-gray-800 rounded-2xl border border-white/[0.07] p-5">
          <h3 className="text-base font-bold text-gray-100 mb-4">Recent Payments</h3>
          <div className="divide-y divide-white/[0.07]">
            {seedPayments.slice(0, 4).map(p => (
              <div key={p.id} className="flex justify-between items-center py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-100">{p.id}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.user}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-amber-500">Rs. {p.amount.toLocaleString()}</p>
                  <div className="mt-1"><StatusBadge status={p.status} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock */}
        <div className="bg-gray-800 rounded-2xl border border-white/[0.07] p-5">
          <h3 className="text-base font-bold text-gray-100 mb-4">Low Stock Alert</h3>
          <div className="divide-y divide-white/[0.07]">
            {lowStock.map(p => (
              <div key={p.id} className="flex justify-between items-center py-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.image}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-100">{p.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{p.category}</p>
                  </div>
                </div>
                <Badge label={`${p.stock} left`} variant={p.stock === 0 ? "danger" : "warning"} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;