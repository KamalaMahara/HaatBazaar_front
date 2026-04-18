import { BrowserRouter, Routes, Route } from "react-router-dom"
import Register from "./pages/user/Register"
import { Provider } from "react-redux"
import store from "./store/store"
import Login from "./pages/user/Login"
import Home from "./pages/Home/Home"
import ProductPage from "./pages/product/Product"
import SingleProduct from "./pages/single product/SingleProduct"
import MyCart from "./pages/cart/my-cart"
import Checkout from "./pages/product/component/checkout/Checkout"
import Categories from "./globals/types/components/categories/categories"
import Navbar from "./globals/types/components/Navbar/navbar"
import MyOrders from "./pages/my-orders/MyOrders"
import ResetPassword from "./pages/user/ResetPassword"
import MyOrderDetail from "./pages/my-order-detail/MyOrderDetail"

import AdminDashboard from "./pages/Admin/AdminDashboard"
import Customer from "./pages/Admin/pages/Users"
import Products from "./pages/Admin/pages/Products"






function App() {
  return (
    <Provider store={store}>
      < BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />

          <Route path="/login" element={<Login />} />
          <Route path="/resetpassword" element={<ResetPassword />} />

          <Route path="/" element={<Home />} />

          <Route path="/products" element={<> < Navbar /><ProductPage /></>} />
          <Route path="/products/:id" element={<SingleProduct />} />
          <Route path="/my-cart" element={<MyCart />} />
          <Route path="/categories" element={<Categories />} />

          <Route path="/my-checkout" element={<Checkout />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/my-orders/:id" element={<MyOrderDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/admin/users" element={<Customer />} />
          <Route path="/admin/products" element={<Products />} />

        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
