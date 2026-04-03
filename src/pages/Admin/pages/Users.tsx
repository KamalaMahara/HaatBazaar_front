import React, { useState } from "react";
import { seedUsers, } from "../data/seeddata";
import type { User } from "../types";
import { Badge, Btn, ConfirmModal, StatusBadge, SectionHeader, TableWrapper } from "../components/UI";

const initials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>(seedUsers);
  const [confirm, setConfirm] = useState<{ id: number } | null>(null);

  const toggleBan = (id: number) =>
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "Banned" ? "Active" : "Banned" } : u));

  return (
    <div>
      <SectionHeader title="Users" subtitle={`${users.length} registered users`} />

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 lg:hidden">
        {users.map(u => (
          <div key={u.id} className="bg-gray-800 rounded-2xl border border-white/[0.07] p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-500 font-extrabold text-sm shrink-0">
                {initials(u.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-100 truncate">{u.name}</p>
                <p className="text-xs text-gray-400 truncate">{u.email}</p>
              </div>
              <StatusBadge status={u.status} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs mb-3">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Role</p>
                <Badge label={u.role} variant={u.role === "Admin" ? "purple" : "info"} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Orders</p>
                <p className="font-semibold text-gray-100">{u.orders}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Joined</p>
                <p className="text-gray-400">{u.joined}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-3 border-t border-white/[0.07]">
              <Btn small variant={u.status === "Banned" ? "ghost" : "danger"} onClick={() => toggleBan(u.id)} className="flex-1">
                {u.status === "Banned" ? "✅ Unban" : "🚫 Ban"}
              </Btn>
              <Btn small variant="danger" onClick={() => setConfirm({ id: u.id })} className="flex-1">🗑 Delete</Btn>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block">
        <TableWrapper>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {["User", "Email", "Role", "Orders", "Joined", "Status", "Actions"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07]">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-500 font-extrabold text-sm shrink-0">
                        {initials(u.name)}
                      </div>
                      <span className="font-semibold text-gray-100 text-sm">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-sm">{u.email}</td>
                  <td className="px-5 py-4">
                    <Badge label={u.role} variant={u.role === "Admin" ? "purple" : "info"} />
                  </td>
                  <td className="px-5 py-4 text-gray-100 text-sm">{u.orders}</td>
                  <td className="px-5 py-4 text-gray-400 text-sm">{u.joined}</td>
                  <td className="px-5 py-4"><StatusBadge status={u.status} /></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Btn small variant={u.status === "Banned" ? "ghost" : "danger"} onClick={() => toggleBan(u.id)}>
                        {u.status === "Banned" ? "✅ Unban" : "🚫 Ban"}
                      </Btn>
                      <Btn small variant="danger" onClick={() => setConfirm({ id: u.id })}>🗑</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrapper>
      </div>

      {confirm && (
        <ConfirmModal
          message="Are you sure you want to delete this user? All their data will be permanently removed."
          onConfirm={() => { setUsers(p => p.filter(u => u.id !== confirm.id)); setConfirm(null); }}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

export default Users;