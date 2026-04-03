import React from "react";

// ── Badge ──────────────────────────────────────────────────────────────────
type BadgeVariant = "success" | "danger" | "warning" | "info" | "purple" | "muted";

const BADGE_STYLES: Record<BadgeVariant, string> = {
  success: "bg-emerald-500/15 text-emerald-400",
  danger: "bg-red-500/15 text-red-400",
  warning: "bg-amber-500/15 text-amber-400",
  info: "bg-blue-500/15 text-blue-400",
  purple: "bg-violet-500/15 text-violet-400",
  muted: "bg-white/10 text-gray-400",
};

const STATUS_MAP: Record<string, BadgeVariant> = {
  Active: "success",
  Inactive: "muted",
  "Out of Stock": "danger",
  Banned: "danger",
  Completed: "success",
  Pending: "warning",
  Failed: "danger",
  Refunded: "info",
};

const METHOD_MAP: Record<string, BadgeVariant> = {
  Khalti: "purple",
  eSewa: "success",
  COD: "warning",
};

interface BadgeProps { label: string; variant: BadgeVariant; }

export const Badge: React.FC<BadgeProps> = ({ label, variant }) => (
  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${BADGE_STYLES[variant]}`}>
    {label}
  </span>
);

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <Badge label={status} variant={STATUS_MAP[status] ?? "muted"} />
);

export const MethodBadge: React.FC<{ method: string }> = ({ method }) => (
  <Badge label={method} variant={METHOD_MAP[method] ?? "muted"} />
);

// ── Button ─────────────────────────────────────────────────────────────────
type BtnVariant = "primary" | "ghost" | "danger";

const BTN_STYLES: Record<BtnVariant, string> = {
  primary: "bg-amber-500 text-gray-900 hover:bg-amber-400",
  ghost: "bg-white/5 text-gray-100 border border-white/10 hover:bg-white/10",
  danger: "bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25",
};

interface BtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: BtnVariant;
  small?: boolean;
  type?: "button" | "submit";
  className?: string;
}

export const Btn: React.FC<BtnProps> = ({
  children, onClick, variant = "primary", small = false, type = "button", className = "",
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-1.5 font-bold rounded-xl cursor-pointer transition-all duration-150 active:scale-95 whitespace-nowrap border-none
      ${small ? "text-xs px-3 py-1.5" : "text-sm px-5 py-2.5"}
      ${BTN_STYLES[variant]} ${className}`}
  >
    {children}
  </button>
);

// ── Input / Select ─────────────────────────────────────────────────────────
interface InputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: string;
  placeholder?: string;
  options?: string[];
}

export const Input: React.FC<InputProps> = ({ label, name, value, onChange, type = "text", placeholder, options }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">{label}</label>
    {options ? (
      <select
        name={name} value={value} onChange={onChange}
        className="bg-gray-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-gray-100 text-sm outline-none focus:border-amber-500 transition-colors"
      >
        {options.map(o => <option key={o} value={o} className="bg-gray-800">{o}</option>)}
      </select>
    ) : (
      <input
        type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        className="bg-gray-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-gray-100 text-sm outline-none focus:border-amber-500 transition-colors placeholder:text-gray-600"
      />
    )}
  </div>
);

// ── Modal ──────────────────────────────────────────────────────────────────
interface ModalProps { title: string; children: React.ReactNode; onClose: () => void; }

export const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className="bg-gray-800 border border-white/10 rounded-2xl p-6 w-full max-w-md animate-[popIn_0.28s_cubic-bezier(0.34,1.56,0.64,1)]"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-bold text-gray-100">{title}</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-colors text-sm cursor-pointer border-none"
        >✕</button>
      </div>
      {children}
    </div>
  </div>
);

// ── Confirm Modal ──────────────────────────────────────────────────────────
interface ConfirmProps { message: string; onConfirm: () => void; onClose: () => void; }

export const ConfirmModal: React.FC<ConfirmProps> = ({ message, onConfirm, onClose }) => (
  <Modal title="Confirm Delete" onClose={onClose}>
    <p className="text-gray-400 text-sm mb-6">{message}</p>
    <div className="flex gap-3 justify-end">
      <Btn onClick={onClose} variant="ghost">Cancel</Btn>
      <Btn onClick={onConfirm} variant="danger">Delete</Btn>
    </div>
  </Modal>
);

// ── Table wrapper ──────────────────────────────────────────────────────────
export const TableWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-gray-800 rounded-2xl border border-white/[0.07] overflow-hidden">
    <div className="overflow-x-auto">{children}</div>
  </div>
);

// ── Section header ─────────────────────────────────────────────────────────
interface SectionHeaderProps { title: string; subtitle: string; action?: React.ReactNode; }

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
    <div>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-100">{title}</h2>
      <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
    </div>
    {action && <div>{action}</div>}
  </div>
);

// ── Stat card ──────────────────────────────────────────────────────────────
interface StatCardProps { label: string; value: string | number; icon: string; iconClass: string; delta?: string; }

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, iconClass, delta }) => (
  <div className="bg-gray-800 rounded-2xl border border-white/[0.07] p-5 flex flex-col gap-3">
    <div className="flex justify-between items-start">
      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">{label}</span>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${iconClass}`}>{icon}</div>
    </div>
    <div className="text-3xl font-extrabold text-gray-100">{value}</div>
    {delta && <div className="text-xs text-emerald-400 font-medium">↑ {delta} from last month</div>}
  </div>
);