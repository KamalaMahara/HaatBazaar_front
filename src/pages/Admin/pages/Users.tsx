// pages/Admin/Customer.tsx
import React, { useEffect } from "react";
import { Badge, SectionHeader, TableWrapper } from "../components/UI";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchUsers, } from "../../../store/adminUserSlice";
import { Status } from "../../../globals/types/types";

const Customer: React.FC = () => {
  const dispatch = useAppDispatch();

  const { users, status } = useAppSelector((store) => store.users);



  // fetch users from backend
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);



  return (
    <div>
      <SectionHeader
        title="Customers"
        subtitle={`${users.length} registered users`}
      />

      {/* Loading */}
      {status === Status.LOADING && <p className="text-gray-400">Loading...</p>}

      {/*  Error */}
      {status === Status.LOADING && <p className="text-red-500">Failed to load users</p>}

      {/* Mobile View */}
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


          </div>
        ))}
      </div>

      {/*  Desktop Table */}
      <div className="hidden lg:block">
        <TableWrapper>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {["User", "Email", "Role"].map((h) => (
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

                </tr>
              ))}
            </tbody>
          </table>
        </TableWrapper>
      </div>


    </div>
  );
};

export default Customer;