import { useState } from "react";
import type { User } from "../types";
import { COLORS } from "../Theme";
import { Badge, Btn, ConfirmModal, statusBadge, Th } from "../components/UI";
import { seedUsers } from "../data/seeddata";

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>(seedUsers);
  const [confirm, setConfirm] = useState<{ id: number } | null>(null);

  const toggleBan = (id: number): void => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Banned" ? "Active" : "Banned" }
          : u
      )
    );
  };

  const confirmDelete = (): void => {
    if (!confirm) return;
    setUsers((prev) => prev.filter((u) => u.id !== confirm.id));
    setConfirm(null);
  };

  const getInitials = (name: string): string =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: COLORS.text, margin: 0 }}>
          Users
        </h2>
        <p style={{ color: COLORS.muted, fontSize: 14, marginTop: 4 }}>
          {users.length} registered users
        </p>
      </div>

      {/* Table */}
      <div
        style={{
          background: COLORS.surface,
          borderRadius: 16,
          border: `1px solid ${COLORS.border}`,
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              {["User", "Email", "Role", "Orders", "Joined", "Status", "Actions"].map((h) => (
                <Th key={h}>{h}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr
                key={u.id}
                style={{
                  borderBottom: i < users.length - 1 ? `1px solid ${COLORS.border}` : "none",
                }}
              >
                {/* Avatar + name */}
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: COLORS.amberDim,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: 13,
                        color: COLORS.amber,
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(u.name)}
                    </div>
                    <span style={{ fontWeight: 600, color: COLORS.text, fontSize: 14 }}>
                      {u.name}
                    </span>
                  </div>
                </td>

                <td style={{ padding: "14px 20px", color: COLORS.muted, fontSize: 13 }}>
                  {u.email}
                </td>

                {/* Role badge */}
                <td style={{ padding: "14px 20px" }}>
                  <Badge
                    label={u.role}
                    color={u.role === "Admin" ? COLORS.purple : COLORS.info}
                    bg={u.role === "Admin" ? COLORS.purpleDim : COLORS.infoDim}
                  />
                </td>

                <td style={{ padding: "14px 20px", color: COLORS.text, fontSize: 14 }}>
                  {u.orders}
                </td>

                <td style={{ padding: "14px 20px", color: COLORS.muted, fontSize: 13 }}>
                  {u.joined}
                </td>

                <td style={{ padding: "14px 20px" }}>{statusBadge(u.status)}</td>

                {/* Actions */}
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn
                      small
                      danger={u.status !== "Banned"}
                      variant={u.status === "Banned" ? "ghost" : undefined}
                      onClick={() => toggleBan(u.id)}
                    >
                      {u.status === "Banned" ? "✅ Unban" : "🚫 Ban"}
                    </Btn>
                    <Btn small danger onClick={() => setConfirm({ id: u.id })}>
                      🗑
                    </Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirm */}
      {confirm && (
        <ConfirmModal
          message="Are you sure you want to delete this user? All their data will be removed permanently."
          onConfirm={confirmDelete}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

export default Users;