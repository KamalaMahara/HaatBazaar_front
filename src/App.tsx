import { BrowserRouter, Routes, Route } from "react-router"
import Register from "./pages/user/Register"
import { Provider } from "react-redux"
import store from "./store/store"
import Login from "./pages/user/Login"
import Home from "./pages/Home/Home"
import ProductPage from "./pages/product/Product"
import SingleProduct from "./pages/single product/SingleProduct"






function App() {
  return (
    <Provider store={store}>
      < BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />

          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Home />} />

          <Route path="/products" element={<ProductPage />} />
          <Route path="/products/:id" element={<SingleProduct />} />

        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
