import type { Status } from "../../../../globals/types/types";



interface IProduct {
  productId: string,
  productQty: number,
  orderStatus: Status,
  totalAmount: number,
  Payment?: {
    paymentMethod: PaymentMethod,
    paymentStatus: string
  }

}
export interface IOrderItems extends IProduct {
  id: string,
  date: string,

}

export interface IOrder {
  status: Status,
  items: IOrderItems[],
  khaltiUrl: string | null

}

export enum PaymentMethod {
  Esewa = "esewa",
  Khalti = "khalti",
  Cod = "cod"
}
export interface IData {
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  city: string,
  zipCode: string,
  state: string,
  addressLine: string,
  totalAmount: number,
  paymentMethod: PaymentMethod,
  products: IProduct[]


}