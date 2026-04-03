import React from "react";

const NAV = [
  { key: "overview", label: "Overview", icon: "📊" },
  { key: "categories", label: "Categories", icon: "🏷️" },
  { key: "products", label: "Products", icon: "📦" },
  { key: "payments", label: "Payments", icon: "💳" },
  { key: "users", label: "Users", icon: "👥" },
];

interface SidebarProps {
  active: string;
  onNavigate: (key: string) => void;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ active, onNavigate, onClose }) => {
  const handleNav = (key: string) => { onNavigate(key); onClose?.(); };

  return (
    <aside className="flex flex-col h-full w-full bg-gray-800 border-r border-white/[0.07] px-3 py-7">

      {/* Logo */}
      <div className="px-3 mb-8">
        {/* Flex container to align logo and text */}
        <div className="flex items-center gap-2">
          <img
            src="src\assets\logo.png"
            alt="HaatBazaar Logo"
            className="h-8 w-8 object-contain"
          />
          <p className="text-xl font-extrabold text-amber-500 tracking-tight">
            HaatBazaar
          </p>
        </div>
        <p className="text-[10px] text-white mt-1 uppercase tracking-widest py-4 px-5">
          Admin Panel
        </p>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(n => (
          <button
            key={n.key}
            onClick={() => handleNav(n.key)}
            className={`flex items-center gap-3 px-6 py-6 rounded-xl text-sm font-medium transition-all duration-150 text-left w-full border-none cursor-pointer
              border-l-[3px]
              ${active === n.key
                ? "bg-amber-500/15 text-amber-500 border-amber-500 font-bold"
                : "text-white border-transparent hover:text-gray-200"
              }`}
          >
            <span className="text-lg leading-none">{n.icon}</span>
            <span>{n.label}</span>
          </button>
        ))}
      </nav>

      {/* Admin profile */}
      <div className="border-t border-white/[0.07] pt-5 mt-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-500 font-extrabold text-sm shrink-0">
            BP
          </div>
          <div>
            <p className="text-sm font-bold text-gray-100">Bikash Poudel</p>
            <p className="text-[11px] text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;