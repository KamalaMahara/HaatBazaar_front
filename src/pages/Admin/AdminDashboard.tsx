import React, { useState } from "react";
import DashboardLayout from "./components/DashboardLayout";
import Overview from "./pages/Overview";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Payments from "./pages/Payments";
import Users from "./pages/Users";

type PageKey = "overview" | "categories" | "products" | "payments" | "users";

const PAGES: Record<PageKey, React.ReactElement> = {
  overview: <Overview />,
  categories: <Categories />,
  products: <Products />,
  payments: <Payments />,
  users: <Users />,
};

const AdminDashboard: React.FC = () => {
  const [active, setActive] = useState<PageKey>("overview");

  return (
    <DashboardLayout active={active} onNavigate={key => setActive(key as PageKey)}>
      {PAGES[active]}
    </DashboardLayout>
  );
};

export default AdminDashboard;