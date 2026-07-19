import React, { useState, useEffect } from "react";
import { useAppSelector } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Overview from "./pages/Overview";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";
import Users from "./pages/Users";

type PageKey = "overview" | "categories" | "products" | "orders" | "payments" | "users";

const PAGES: Record<PageKey, React.ReactElement> = {
  overview: <Overview />,
  categories: <Categories />,
  products: <Products />,
  orders: <Orders />,
  payments: <Payments />,
  users: <Users />,
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [active, setActive] = useState<PageKey>("overview");

  useEffect(() => {
    // Check if token exists and role is admin
    const token = localStorage.getItem("tokenHoYo");
    const role = localStorage.getItem("roleHoYo");
    
    if (!token || role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  const role = localStorage.getItem("roleHoYo");
  if (!role || role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white font-sans">
        <h1 className="text-3xl font-black text-red-500 mb-2">Access Denied</h1>
        <p className="text-gray-400">You must be logged in as an administrator to view this page.</p>
        <button onClick={() => navigate("/login")} className="mt-5 px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all border-none cursor-pointer">
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <DashboardLayout active={active} onNavigate={key => setActive(key as PageKey)}>
      {PAGES[active]}
    </DashboardLayout>
  );
};

export default AdminDashboard;