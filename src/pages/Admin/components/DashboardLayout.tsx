import React, { useState } from "react";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  active: string;
  onNavigate: (key: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, active, onNavigate }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes popIn { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        select option { background: #1F2937; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(245,158,11,0.25); border-radius: 10px; }
      `}</style>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-60 shrink-0 sticky top-0 h-screen">
        <Sidebar active={active} onNavigate={onNavigate} />
      </div>

      {/* Mobile backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile slide-in drawer */}
      <div className={`fixed top-0 left-0 z-50 h-full w-64 transition-transform duration-300 lg:hidden ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar active={active} onNavigate={onNavigate} onClose={() => setDrawerOpen(false)} />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-gray-800 border-b border-white/[0.07] sticky top-0 z-30">
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-colors text-lg cursor-pointer border-none"
          >☰</button>
          <span className="text-base font-extrabold text-amber-500">
            <img
              src="src\assets\logo.png"
              alt="HaatBazaar Logo"
              className="h-8 w-8 object-fit inline-block mr-1 -mt-1"
            />
            HaatBazaar</span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-9 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;