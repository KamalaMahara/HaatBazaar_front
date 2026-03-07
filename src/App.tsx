import { BrowserRouter, Routes, Route } from "react-router"
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






function App() {
  return (
    <Provider store={store}>
      < BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />

          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Home />} />

          <Route path="/products" element={<> < Navbar /><ProductPage /></>} />
          <Route path="/products/:id" element={<SingleProduct />} />
          <Route path="/my-cart" element={<MyCart />} />
          <Route path="/categories" element={<Categories />} />

          <Route path="/my-checkout" element={<Checkout />} />
          <Route path="/my-orders" element={<MyOrders />} />

        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
