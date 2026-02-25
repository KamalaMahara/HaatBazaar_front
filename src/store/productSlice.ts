import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IProduct, IProducts } from "../pages/product/types/types";
import { Status } from "../globals/types/types";
import type { AppDispatch } from "./store";

import { setStatus } from "./authSlice";
import type { RootState } from "./store";
import { API } from "../http";






const initialState: IProducts = {
  products: [],
  status: Status.LOADING,
  product: null
}




const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts(state: IProducts, action: PayloadAction<IProduct[]>) {
      state.products = action.payload;
    },
    setProductStatus(state: IProducts, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    setSingleProduct(state: IProducts, action: PayloadAction<IProduct>) {
      state.product = action.payload;
    }
  }
});


export const { setProductStatus, setProducts, setSingleProduct } = productSlice.actions
export default productSlice.reducer

export function fetchproducts() {
  return async function fetchProductThunk(dispatch: AppDispatch) {
    try {
      const response = await API.get("/product")
      if (response.status === 200) {
        dispatch(setProductStatus(Status.SUCCESS))
        dispatch(setProducts(response.data.data))
      }
      else {
        dispatch(setStatus(Status.ERROR))
      }
    } catch (error) {
      console.log(error)
      dispatch(setStatus(Status.ERROR))
    }
  }
}

export function fetchSingleProduct(id: string) {
  return async function fetchSingleProductThunk(dispatch: AppDispatch, getState: () => RootState) {
    const store = getState()
    const productExists = store.products.products.find((product: IProduct) => product.id === id)

    if (productExists) {
      dispatch(setSingleProduct(productExists))
      dispatch(setProductStatus(Status.SUCCESS))
    }
    else {
      try {
        const response = await API.get("/product/" + id);

        if (response.status === 200) {
          dispatch(setProductStatus(Status.SUCCESS));
          dispatch(setSingleProduct(response.data.data[0]));
          console.log("Fetched product:", response.data.data[0]);
        } else {
          dispatch(setStatus(Status.ERROR));
        }
      } catch (error) {
        console.log(error);
        dispatch(setStatus(Status.ERROR));
      }
    }

  };
}