import { useState } from "react";
import type { Payment } from "../types";
import { COLORS } from "../Theme";
import { statusBadge, methodBadge, Th } from "../components/UI";
import { seedPayments } from "../data/seeddata";

type FilterStatus = "All" | Payment["status"];

const STATUSES: FilterStatus[] = ["All", "Completed", "Pending", "Failed", "Refunded"];

const Payments: React.FC = () => {
  const [payments] = useState<Payment[]>(seedPayments);
  const [filter, setFilter] = useState<FilterStatus>("All");

  const filtered: Payment[] =
    filter === "All" ? payments : payments.filter((p) => p.status === filter);

  const totalCollected: number = payments
    .filter((p) => p.status === "Completed")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: COLORS.text, margin: 0 }}>
            Payments
          </h2>
          <p style={{ color: COLORS.muted, fontSize: 14, marginTop: 4 }}>
            Total collected:{" "}
            <span style={{ color: COLORS.amber, fontWeight: 700 }}>
              Rs. {totalCollected.toLocaleString()}
            </span>
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "8px 18px",
              borderRadius: 10,
              border: `1px solid ${filter === s ? COLORS.amber : COLORS.border}`,
              background: filter === s ? COLORS.amberDim : "transparent",
              color: filter === s ? COLORS.amber : COLORS.muted,
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.18s",
            }}
          >
            {s}
          </button>
        ))}
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
              {["Order ID", "Customer", "Amount", "Method", "Date", "Status"].map((h) => (
                <Th key={h}>{h}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr
                key={p.id}
                style={{
                  borderBottom: i < filtered.length - 1 ? `1px solid ${COLORS.border}` : "none",
                }}
              >
                <td style={{ padding: "14px 20px", fontWeight: 700, color: COLORS.amber, fontSize: 14 }}>
                  {p.id}
                </td>
                <td style={{ padding: "14px 20px", color: COLORS.text, fontSize: 14 }}>
                  {p.user}
                </td>
                <td style={{ padding: "14px 20px", fontWeight: 700, color: COLORS.text, fontSize: 14 }}>
                  Rs. {p.amount.toLocaleString()}
                </td>
                <td style={{ padding: "14px 20px" }}>{methodBadge(p.method)}</td>
                <td style={{ padding: "14px 20px", color: COLORS.muted, fontSize: 13 }}>
                  {p.date}
                </td>
                <td style={{ padding: "14px 20px" }}>{statusBadge(p.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: COLORS.muted }}>
            No payments found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;