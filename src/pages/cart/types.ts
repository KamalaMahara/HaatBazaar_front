import type { Status } from "../../globals/types/types"



export interface ICartProduct {
  id: string,
  productName: string,
  productImageUrl: string,
  productPrice: number | null
}

export interface ICartItem {
  id: string,
  quantity: number,
  productId: string,
  product: ICartProduct

}

export interface ICartInitialState {
  items: ICartItem[],
  status: Status
}

export interface ICartUpdateItem {
  productId: string,
  quantity: number
}