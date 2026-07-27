import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../globals/types/types";
import type { AppDispatch } from "./store";
import { APIWITHTOKEN } from "../http";

export interface IOrder {
  id: string;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  addressline: string;
  zipCode: string;
  Payment?: {
    paymentMethod: string;
    paymentstatus: string;
  };
  OrderDetail?: {
    id: string;
    quantity: number;
    Product?: {
      productName: string;
      productPrice: number;
      productImageUrl: string;
    };
  }[];
  User?: {
    id: string;
    username: string;
    email: string;
  };
}

interface IInitialState {
  orders: IOrder[];
  status: Status;
}

const initialState: IInitialState = {
  orders: [],
  status: Status.LOADING,
};

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {
    setStatus(state, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    setOrders(state, action: PayloadAction<IOrder[]>) {
      state.orders = action.payload;
    },
    updateOrderStatusLocal(state, action: PayloadAction<{ orderId: string; status: string }>) {
      const order = state.orders.find((o) => o.id === action.payload.orderId);
      if (order) {
        order.orderStatus = action.payload.status;
      }
    },
    deleteOrderLocal(state, action: PayloadAction<string>) {
      state.orders = state.orders.filter((o) => o.id !== action.payload);
    },
  },
});

export const { setOrders, setStatus, updateOrderStatusLocal, deleteOrderLocal } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;

export function fetchAdminOrders() {

  return async (dispatch: AppDispatch) => {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIWITHTOKEN.get("/order/admin");
      if (response.status === 200) {
        dispatch(setOrders(response.data.data));
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (err) {
      console.error(err);
      dispatch(setStatus(Status.ERROR));
    }
  };
}

export function updateAdminOrderStatus(orderId: string, orderStatus: string) {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await APIWITHTOKEN.post(`/order/admin/change-order-status/${orderId}`, { orderStatus });
      if (response.status === 200) {
        dispatch(updateOrderStatusLocal({ orderId, status: orderStatus }));
      }
    } catch (err) {
      console.error(err);
    }
  };
}

export function deleteAdminOrder(orderId: string) {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await APIWITHTOKEN.post(`/order/admin/delete-order/${orderId}`);
      if (response.status === 200) {
        dispatch(deleteOrderLocal(orderId));
      }
    } catch (err) {
      console.error(err);
    }
  };
}
