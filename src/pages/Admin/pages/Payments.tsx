import React, { useState } from "react";
import { seedPayments } from "../data/seeddata";
import type { Payment } from "../types";
import { StatusBadge, MethodBadge, SectionHeader, TableWrapper } from "../components/UI";

const STATUSES = ["All", "Completed", "Pending", "Failed", "Refunded"];

const Payments: React.FC = () => {
  const [payments] = useState<Payment[]>(seedPayments);
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? payments : payments.filter(p => p.status === filter);
  const total = payments.filter(p => p.status === "Completed").reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <SectionHeader
        title="Payments"
        subtitle={`Total collected: Rs. ${total.toLocaleString()}`}
      />

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 cursor-pointer
              ${filter === s
                ? "bg-amber-500/15 text-amber-500 border-amber-500/50"
                : "bg-transparent text-gray-400 border-white/[0.07] hover:bg-white/5 hover:text-gray-200"
              }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 lg:hidden">
        {filtered.map(p => (
          <div key={p.id} className="bg-gray-800 rounded-2xl border border-white/[0.07] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-amber-500 text-sm">{p.id}</span>
              <StatusBadge status={p.status} />
            </div>
            <p className="text-sm font-medium text-gray-100 mb-3">{p.user}</p>
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/[0.07] text-sm">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Amount</p>
                <p className="font-bold text-gray-100">Rs. {p.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Method</p>
                <MethodBadge method={p.method} />
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Date</p>
                <p className="text-gray-400 text-xs">{p.date}</p>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-gray-500 py-10">No payments found.</p>}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block">
        <TableWrapper>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {["Order ID", "Customer", "Amount", "Method", "Date", "Status"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07]">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4 font-bold text-amber-500 text-sm">{p.id}</td>
                  <td className="px-5 py-4 text-gray-100 text-sm">{p.user}</td>
                  <td className="px-5 py-4 font-bold text-gray-100 text-sm">Rs. {p.amount.toLocaleString()}</td>
                  <td className="px-5 py-4"><MethodBadge method={p.method} /></td>
                  <td className="px-5 py-4 text-gray-400 text-sm">{p.date}</td>
                  <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-500">No payments found.</td></tr>
              )}
            </tbody>
          </table>
        </TableWrapper>
      </div>
    </div>
  );
};

export default Payments;