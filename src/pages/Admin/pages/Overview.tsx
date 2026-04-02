
import { COLORS } from "../Theme";
import { Badge, statusBadge } from "../components/UI";
import { seedPayments, seedProducts } from "../data/seeddata";

// ── Stat Card 
interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  bg: string;
  delta?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color, bg, delta }) => (
  <div
    style={{
      background: COLORS.surface,
      borderRadius: 16,
      border: `1px solid ${COLORS.border}`,
      padding: "20px 22px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <span
        style={{
          fontSize: 12,
          color: COLORS.muted,
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <div
        style={{
          background: bg,
          color,
          width: 38,
          height: 38,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
        }}
      >
        {icon}
      </div>
    </div>
    <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.text }}>{value}</div>
    {delta && (
      <div style={{ fontSize: 12, color: COLORS.success }}>↑ {delta} from last month</div>
    )}
  </div>
);

// ── Overview Page ──────────────────────────────────────────────────────────
const Overview: React.FC = () => {
  const lowStock = seedProducts.filter((p) => p.stock <= 12);

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: COLORS.text, marginBottom: 6 }}>
        Dashboard Overview
      </h2>
      <p style={{ color: COLORS.muted, marginBottom: 28, fontSize: 14 }}>
        Welcome back, Admin. Here's what's happening at HaatBazaar.
      </p>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <StatCard label="Total Revenue" value="Rs. 3,24,500" icon="💰" color={COLORS.amber} bg={COLORS.amberDim} delta="12%" />
        <StatCard label="Total Orders" value="1,248" icon="🛒" color={COLORS.info} bg={COLORS.infoDim} delta="8%" />
        <StatCard label="Total Users" value="5" icon="👥" color={COLORS.purple} bg={COLORS.purpleDim} delta="3%" />
        <StatCard label="Products" value={seedProducts.length} icon="📦" color={COLORS.success} bg={COLORS.successDim} />
      </div>

      {/* Bottom panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Recent Payments */}
        <div
          style={{
            background: COLORS.surface,
            borderRadius: 16,
            border: `1px solid ${COLORS.border}`,
            padding: 22,
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>
            Recent Payments
          </h3>
          {seedPayments.slice(0, 4).map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: `1px solid ${COLORS.border}`,
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{p.id}</div>
                <div style={{ fontSize: 12, color: COLORS.muted }}>{p.user}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.amber }}>
                  Rs. {p.amount.toLocaleString()}
                </div>
                <div style={{ marginTop: 4 }}>{statusBadge(p.status)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Low Stock Alert */}
        <div
          style={{
            background: COLORS.surface,
            borderRadius: 16,
            border: `1px solid ${COLORS.border}`,
            padding: 22,
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>
            Low Stock Alert
          </h3>
          {lowStock.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: `1px solid ${COLORS.border}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>{p.image}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>{p.category}</div>
                </div>
              </div>
              <Badge
                label={`${p.stock} left`}
                color={p.stock === 0 ? COLORS.danger : COLORS.amber}
                bg={p.stock === 0 ? COLORS.dangerDim : COLORS.amberDim}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;