import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../globals/types/types";
import type { AppDispatch } from "./store";
import { APIWITHTOKEN } from "../http";
import type { IProduct } from "../pages/product/types/types";


interface IInitialState {
  products: IProduct[];
  status: Status;
}

const initialState: IInitialState = {
  products: [],
  status: Status.LOADING,
};

const productSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {
    setStatus(state, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    setProducts(state, action: PayloadAction<IProduct[]>) {
      state.products = action.payload;
    },
  },
});

export const { setProducts, setStatus } = productSlice.actions;
export default productSlice.reducer;



export function fetchProducts() {
  return async (dispatch: AppDispatch) => {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIWITHTOKEN.get("/product");
      console.log("Full response:", response);           // ← ADD
      console.log("Response status:", response.status); // ← ADD
      console.log("Response data:", response.data);     // ← ADD

      if (response.status === 200) {
        dispatch(setProducts(response.data.data));
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (err) {
      console.error("API Error:", err); // ← ADD
      dispatch(setStatus(Status.ERROR));
    }
  };
}


//  ADD
export function addProduct(data: any) {
  return async (dispatch: AppDispatch) => {
    try {
      await APIWITHTOKEN.post("/product", data);
      dispatch(fetchProducts()); // refresh
    } catch {
      dispatch(setStatus(Status.ERROR));
    }
  };
}


// ✅ UPDATE
export function updateProduct(id: string, data: any) {
  return async (dispatch: AppDispatch) => {
    try {
      await APIWITHTOKEN.patch(`/product/${id}`, data);
      dispatch(fetchProducts());
    } catch {
      dispatch(setStatus(Status.ERROR));
    }
  };
}


// ✅ DELETE
export function deleteProduct(id: string) {
  return async (dispatch: AppDispatch) => {
    try {
      await APIWITHTOKEN.delete(`/product/${id}`);
      dispatch(fetchProducts());
    } catch {
      dispatch(setStatus(Status.ERROR));
    }
  };
}