import { useState } from "react";
import type { NavKey } from "../Admin/types";
import DashboardLayout from "../Admin/components/DashboardLayout";
import Overview from "./pages/Overview";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Payments from "./pages/Payments";
import Users from "./pages/Users";

const PAGES: Record<NavKey, React.ReactElement> = {
  overview: <Overview />,
  categories: <Categories />,
  products: <Products />,
  payments: <Payments />,
  users: <Users />,
};

const AdminDashboard: React.FC = () => {
  const [active, setActive] = useState<NavKey>("overview");

  return (
    <DashboardLayout active={active} onNavigate={setActive}>
      {PAGES[active]}
    </DashboardLayout>
  );
};

export default AdminDashboard;