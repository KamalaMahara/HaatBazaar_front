import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import productSlice from "./productSlice";
import cartSlice from "./cartSlice";
import ordersReducer from "./checkoutSlice";
import { userSlice } from "./adminUserSlice";
import adminProductReducer from "./adminProductSlice"; // ← ADD THIS IMPORT



const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productSlice,
    cart: cartSlice,
    orders: ordersReducer,
    users: userSlice.reducer,
    adminProducts: adminProductReducer, // ← CHANGE THIS
  }
})

export default store
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>