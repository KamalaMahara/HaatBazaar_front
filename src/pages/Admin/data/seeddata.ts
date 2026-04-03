export interface Category {
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

export const seedCategories: Category[] = [
  { id: 1, name: "Electronics", icon: "⚡", productCount: 24, status: "Active" },
  { id: 2, name: "Clothing", icon: "👗", productCount: 58, status: "Active" },
  { id: 3, name: "Food & Grocery", icon: "🥦", productCount: 132, status: "Active" },
  { id: 4, name: "Books", icon: "📚", productCount: 45, status: "Active" },
  { id: 5, name: "Home & Kitchen", icon: "🏠", productCount: 37, status: "Inactive" },
];

export const seedProducts: Product[] = [
  { id: 1, name: "Samsung Galaxy A54", category: "Electronics", price: 45000, stock: 12, status: "Active", image: "📱" },
  { id: 2, name: "Men's Kurta Set", category: "Clothing", price: 1200, stock: 80, status: "Active", image: "👔" },
  { id: 3, name: "Basmati Rice 5kg", category: "Food & Grocery", price: 650, stock: 200, status: "Active", image: "🍚" },
  { id: 4, name: "Clean Code Book", category: "Books", price: 1800, stock: 30, status: "Active", image: "📖" },
  { id: 5, name: "Wireless Earbuds", category: "Electronics", price: 3200, stock: 0, status: "Out of Stock", image: "🎧" },
  { id: 6, name: "Women's Saree", category: "Clothing", price: 2500, stock: 45, status: "Active", image: "👘" },
  { id: 7, name: "Pressure Cooker", category: "Home & Kitchen", price: 2200, stock: 18, status: "Active", image: "🍲" },
];

export const seedUsers: User[] = [
  { id: 1, name: "Aayush Sharma", email: "aayush@gmail.com", role: "Customer", orders: 8, joined: "Jan 2024", status: "Active" },
  { id: 2, name: "Priya Thapa", email: "priya@gmail.com", role: "Customer", orders: 3, joined: "Mar 2024", status: "Active" },
  { id: 3, name: "Rajan Karki", email: "rajan@gmail.com", role: "Customer", orders: 15, joined: "Nov 2023", status: "Active" },
  { id: 4, name: "Sunita Rai", email: "sunita@gmail.com", role: "Customer", orders: 1, joined: "May 2024", status: "Banned" },
  { id: 5, name: "Bikash Poudel", email: "bikash@gmail.com", role: "Admin", orders: 0, joined: "Oct 2023", status: "Active" },
];

export const seedPayments: Payment[] = [
  { id: "#ORD-2847", user: "Aayush Sharma", amount: 45650, method: "Khalti", date: "Apr 1, 2026", status: "Completed" },
  { id: "#ORD-2846", user: "Priya Thapa", amount: 1300, method: "COD", date: "Apr 1, 2026", status: "Pending" },
  { id: "#ORD-2845", user: "Rajan Karki", amount: 5400, method: "eSewa", date: "Mar 31, 2026", status: "Completed" },
  { id: "#ORD-2844", user: "Sunita Rai", amount: 650, method: "COD", date: "Mar 31, 2026", status: "Failed" },
  { id: "#ORD-2843", user: "Rajan Karki", amount: 2500, method: "Khalti", date: "Mar 30, 2026", status: "Completed" },
  { id: "#ORD-2842", user: "Priya Thapa", amount: 1800, method: "eSewa", date: "Mar 29, 2026", status: "Refunded" },
];