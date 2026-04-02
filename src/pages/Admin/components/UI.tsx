import type { ChangeEvent, CSSProperties, ReactNode } from "react";
import { COLORS } from "../Theme";
import type { Payment, Product } from "../types";

// ── Badge ──────────────────────────────────────────────────────────────────
interface BadgeProps {
  label: string;
  color: string;
  bg: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, color, bg }) => (
  <span
    style={{
      background: bg,
      color,
      fontSize: 11,
      fontWeight: 700,
      padding: "3px 10px",
      borderRadius: 999,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
    }}
  >
    {label}
  </span>
);

// ── Status badge helper ────────────────────────────────────────────────────
type StatusKey =
  | "Active" | "Inactive" | "Out of Stock" | "Banned"
  | "Completed" | "Pending" | "Failed" | "Refunded";

export const statusBadge = (s: StatusKey): ReactNode => {
  const map: Record<StatusKey, [string, string]> = {
    Active: [COLORS.success, COLORS.successDim],
    Inactive: [COLORS.muted, "rgba(156,163,175,0.15)"],
    "Out of Stock": [COLORS.danger, COLORS.dangerDim],
    Banned: [COLORS.danger, COLORS.dangerDim],
    Completed: [COLORS.success, COLORS.successDim],
    Pending: [COLORS.amber, COLORS.amberDim],
    Failed: [COLORS.danger, COLORS.dangerDim],
    Refunded: [COLORS.info, COLORS.infoDim],
  };
  const [c, bg] = map[s] ?? [COLORS.muted, "rgba(156,163,175,0.15)"];
  return <Badge label={s} color={c} bg={bg} />;
};

// ── Payment method badge helper ────────────────────────────────────────────
export const methodBadge = (m: Payment["method"]): ReactNode => {
  const map: Record<Payment["method"], [string, string]> = {
    Khalti: [COLORS.purple, COLORS.purpleDim],
    eSewa: [COLORS.success, COLORS.successDim],
    COD: [COLORS.amber, COLORS.amberDim],
  };
  const [c, bg] = map[m] ?? [COLORS.muted, "rgba(156,163,175,0.15)"];
  return <Badge label={m} color={c} bg={bg} />;
};

// ── Button ─────────────────────────────────────────────────────────────────
interface BtnProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  small?: boolean;
  danger?: boolean;
  style?: CSSProperties;
}

export const Btn: React.FC<BtnProps> = ({
  children,
  onClick,
  variant = "primary",
  small = false,
  danger = false,
  style: extraStyle = {},
}) => {
  const base: CSSProperties = {
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    borderRadius: 10,
    transition: "all 0.18s",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: small ? "6px 14px" : "10px 20px",
    fontSize: small ? 12 : 14,
  };

  const variants: Record<string, CSSProperties> = {
    primary: { background: COLORS.amber, color: "#111827" },
    ghost: {
      background: "rgba(255,255,255,0.05)",
      color: COLORS.text,
      border: `1px solid ${COLORS.border}`,
    },
    danger: {
      background: COLORS.dangerDim,
      color: COLORS.danger,
      border: `1px solid rgba(239,68,68,0.25)`,
    },
  };

  return (
    <button
      onClick={onClick}
      style={{ ...base, ...(danger ? variants.danger : variants[variant]), ...extraStyle }}
    >
      {children}
    </button>
  );
};

// ── Input / Select ─────────────────────────────────────────────────────────
interface InputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: string;
  placeholder?: string;
  options?: string[];
}

export const Input: React.FC<InputProps> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  options,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label
      style={{
        fontSize: 12,
        color: COLORS.muted,
        fontWeight: 600,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </label>
    {options ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        style={{
          background: "#111827",
          border: `1px solid rgba(255,255,255,0.12)`,
          borderRadius: 10,
          padding: "11px 14px",
          color: COLORS.text,
          fontSize: 14,
          outline: "none",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange as (e: ChangeEvent<HTMLInputElement>) => void}
        placeholder={placeholder}
        style={{
          background: "#111827",
          border: `1px solid rgba(255,255,255,0.12)`,
          borderRadius: 10,
          padding: "11px 14px",
          color: COLORS.text,
          fontSize: 14,
          outline: "none",
        }}
      />
    )}
  </div>
);

// ── Modal ──────────────────────────────────────────────────────────────────
interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 100,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    }}
    onClick={onClose}
  >
    <div
      style={{
        background: COLORS.surface,
        borderRadius: 20,
        border: `1px solid ${COLORS.border}`,
        padding: 28,
        width: "100%",
        maxWidth: 480,
        animation: "popIn 0.28s cubic-bezier(0.34,1.56,0.64,1)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 22,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: COLORS.text }}>
          {title}
        </h3>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "none",
            color: COLORS.muted,
            width: 32,
            height: 32,
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          ✕
        </button>
      </div>
      {children}
    </div>
  </div>
);

// ── Confirm Modal ──────────────────────────────────────────────────────────
interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  message,
  onConfirm,
  onClose,
}) => (
  <Modal title="Confirm Delete" onClose={onClose}>
    <p style={{ color: COLORS.muted, marginBottom: 24 }}>{message}</p>
    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
      <Btn onClick={onClose} variant="ghost">
        Cancel
      </Btn>
      <Btn onClick={onConfirm} danger>
        Delete
      </Btn>
    </div>
  </Modal>
);

// ── Table header helper ────────────────────────────────────────────────────
export const Th: React.FC<{ children: ReactNode }> = ({ children }) => (
  <th
    style={{
      padding: "14px 20px",
      textAlign: "left",
      fontSize: 11,
      fontWeight: 700,
      color: COLORS.muted,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    }}
  >
    {children}
  </th>
);