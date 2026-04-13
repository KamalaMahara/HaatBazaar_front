// pages/Admin/Customer.tsx
import React, { useEffect, useState } from "react";
import { Badge, Btn, ConfirmModal, SectionHeader, TableWrapper } from "../components/UI";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchUsers, deleteUsers } from "../../../store/adminUserSlice";
import { Status } from "../../../globals/types/types";

const Customer: React.FC = () => {
  const dispatch = useAppDispatch();

  const { users, status } = useAppSelector((store) => store.users);

  const [confirm, setConfirm] = useState<{ id: string } | null>(null);

  // ✅ fetch users from backend
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // ✅ delete handler
  const handleDelete = (id: string) => {
    dispatch(deleteUsers(id));
    setConfirm(null);
  };

  return (
    <div>
      <SectionHeader
        title="Customers"
        subtitle={`${users.length} registered users`}
      />

      {/* 🔵 Loading */}
      {status === Status.LOADING && <p className="text-gray-400">Loading...</p>}

      {/* 🔴 Error */}
      {status === Status.LOADING && <p className="text-red-500">Failed to load users</p>}

      {/* ✅ Mobile View */}
      <div className="flex flex-col gap-3 lg:hidden">
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-gray-800 rounded-2xl border border-white/[0.07] p-4"
          >
            <p className="font-bold text-gray-100">{u.username}</p>
            <p className="text-xs text-gray-400">{u.email}</p>

            <div className="mt-3">
              <Badge
                label={u.role}
                variant={u.role === "Admin" ? "purple" : "info"}
              />
            </div>

            <div className="flex gap-2 mt-4">
              <Btn
                small
                variant="danger"
                onClick={() => setConfirm({ id: u.id })}
              >
                🗑 Delete
              </Btn>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Desktop Table */}
      <div className="hidden lg:block">
        <TableWrapper>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {["User", "Email", "Role", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs text-gray-400 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-5 py-4 text-gray-100">{u.username}</td>
                  <td className="px-5 py-4 text-gray-400">{u.email}</td>
                  <td className="px-5 py-4">
                    <Badge
                      label={u.role}
                      variant={u.role === "Admin" ? "purple" : "info"}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <Btn
                      small
                      variant="danger"
                      onClick={() => setConfirm({ id: u.id })}
                    >
                      🗑
                    </Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrapper>
      </div>

      {/* ✅ Confirm Modal */}
      {confirm && (
        <ConfirmModal
          message="Are you sure you want to delete this user?"
          onConfirm={() => handleDelete(confirm.id)}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

export default Customer;