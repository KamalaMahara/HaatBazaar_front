export interface Category {
  categoryName: any;
  id: number;
  name: string;
  icon: string;
  productCount: number;
  status: "Active" | "Inactive";
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "Active" | "Inactive" | "Out of Stock";
  image: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Customer";
  orders: number;
  joined: string;
  status: "Active" | "Banned";
}

export interface Payment {
  id: string;
  user: string;
  amount: number;
  method: "Khalti" | "eSewa" | "COD";
  date: string;
  status: "Completed" | "Pending" | "Failed" | "Refunded";
}

export type NavKey = "overview" | "categories" | "products" | "payments" | "users";

export interface NavItem {
  key: NavKey;
  label: string;
  icon: string;
}