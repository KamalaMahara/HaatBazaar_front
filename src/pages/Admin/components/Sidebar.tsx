import type { NavKey, NavItem } from "../types";
import { COLORS } from "../Theme";

const NAV: NavItem[] = [
  { key: "overview", label: "Overview", icon: "📊" },
  { key: "categories", label: "Categories", icon: "🏷️" },
  { key: "products", label: "Products", icon: "📦" },
  { key: "payments", label: "Payments", icon: "💳" },
  { key: "users", label: "Users", icon: "👥" },
];

interface SidebarProps {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ active, onNavigate }) => {
  return (
    <aside
      style={{
        width: 240,
        background: COLORS.surface,
        borderRight: `1px solid ${COLORS.border}`,
        display: "flex",
        flexDirection: "column",
        padding: "28px 16px",
        gap: 4,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ paddingLeft: 10, marginBottom: 32 }}>
        <div
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: COLORS.amber,
            letterSpacing: "-0.03em",
          }}
        >
          🛍️ HaatBazaar
        </div>
        <div
          style={{
            fontSize: 11,
            color: COLORS.muted,
            marginTop: 3,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Admin Panel
        </div>
      </div>

      {/* Nav items */}
      {NAV.map((n) => (
        <button
          key={n.key}
          onClick={() => onNavigate(n.key)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "11px 14px",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            background: active === n.key ? COLORS.amberDim : "transparent",
            color: active === n.key ? COLORS.amber : COLORS.muted,
            fontWeight: active === n.key ? 700 : 500,
            fontSize: 14,
            transition: "all 0.18s",
            textAlign: "left",
            borderLeft:
              active === n.key
                ? `3px solid ${COLORS.amber}`
                : "3px solid transparent",
          }}
        >
          <span style={{ fontSize: 18 }}>{n.icon}</span>
          {n.label}
        </button>
      ))}

      {/* Admin profile */}
      <div
        style={{
          marginTop: "auto",
          borderTop: `1px solid ${COLORS.border}`,
          paddingTop: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 10px",
          }}
        >
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
            }}
          >
            BP
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>
              Bikash Poudel
            </div>
            <div style={{ fontSize: 11, color: COLORS.muted }}>Administrator</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;