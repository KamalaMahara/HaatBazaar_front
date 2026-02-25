import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../globals/types/types";
import type { ICartInitialState, ICartItem, ICartUpdateItem } from "../pages/cart/types";
import type { AppDispatch } from "./store";
import { APIWITHTOKEN } from "../http";
import { setStatus } from "./authSlice";




const initialState: ICartInitialState = {
  items: [],
  status: Status.LOADING
}

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems(state: ICartInitialState, action: PayloadAction<ICartItem[]>) {
      state.items = action.payload
    },
    setCartStatus(state: ICartInitialState, action: PayloadAction<Status>) {
      state.status = action.payload
    },
    setUpdateCartItem(state: ICartInitialState, action: PayloadAction<ICartUpdateItem>) {
      const index = state.items.findIndex(item => item.product.id == action.payload.productId)
      if (index !== -1) {
        state.items[index].quantity = action.payload.quantity
      }
    },
    setDeleteCartItem(state: ICartInitialState, action: PayloadAction<string>) {
      const index = state.items.findIndex(item => item.product.id == action.payload)
      state.items.splice(index, 1)
    }
  }
})
export const { setCartItems, setCartStatus, setUpdateCartItem, setDeleteCartItem } = cartSlice.actions

export default cartSlice.reducer


export function addToCart(productId: string) {
  return async function addToCartThunk(dispatch: AppDispatch) {

    try {
      const response = await APIWITHTOKEN.post("/cart", {
        productId: productId,
        quantity: 1

      })

      if (response.status === 200) {
        dispatch(setCartStatus(Status.SUCCESS))
        dispatch(setCartItems(response.data.data))
      }
      else {
        dispatch(setCartStatus(Status.ERROR))
      }

    } catch (error) {
      console.log(error)
      dispatch(setCartStatus(Status.ERROR))
    }
  }
}

export function fetchCartItems() {
  return async function fetchCartItemsThunk(dispatch: AppDispatch) {
    try {
      const response = await APIWITHTOKEN.get("/cart")
      if (response.status === 200) {
        dispatch(setCartItems(response.data.data))
        dispatch(setCartStatus(Status.SUCCESS))
      }
      else {
        dispatch(setStatus(Status.ERROR))
      }
    }
    catch (error) {
      console.log(error)
      dispatch(setStatus(Status.ERROR))
    }


  }
}
export function handleCartItemUpdate(productId: string, quantity: number) {
  return async function hadleCartItemUpdateThunk(dispatch: AppDispatch) {
    try {
      const response = await APIWITHTOKEN.patch("/cart/" + productId, { quantity })
      if (response.status === 200) {
        dispatch(setUpdateCartItem({ productId, quantity }))
        dispatch(setCartStatus(Status.SUCCESS))
      }
      else {
        dispatch(setStatus(Status.ERROR))
      }
    }
    catch (error) {
      console.log(error)
      dispatch(setStatus(Status.ERROR))
    }
  }
}
export function handleCartItemDelete(productId: string) {
  return async function hadleCartItemDeleteThunk(dispatch: AppDispatch) {
    try {
      const response = await APIWITHTOKEN.delete("/cart/", { data: { productId } })
      if (response.status === 200) {
        dispatch(setDeleteCartItem(productId))
        dispatch(setCartStatus(Status.SUCCESS))
      }
      else {
        dispatch(setStatus(Status.ERROR))
      }
    }
    catch (error) {
      console.log(error)
      dispatch(setStatus(Status.ERROR))
    }
  }
}