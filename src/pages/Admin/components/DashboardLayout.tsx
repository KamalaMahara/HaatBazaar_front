import type { ReactNode } from "react";
import type { NavKey } from "../types";
import { COLORS } from "../Theme";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  active: NavKey;
  onNavigate: (key: NavKey) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  active,
  onNavigate,
}) => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: COLORS.bg,
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        color: COLORS.text,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: rgba(245,158,11,0.2); border-radius: 10px; }
        @keyframes popIn { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        input::placeholder { color: #6B7280; }
        select option { background: #1F2937; }
      `}</style>

      <Sidebar active={active} onNavigate={onNavigate} />

      <main
        style={{
          flex: 1,
          padding: "36px 40px",
          overflowY: "auto",
          maxHeight: "100vh",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;