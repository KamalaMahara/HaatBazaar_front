import type { Status } from "../../../../globals/types/types";



export interface IProduct {
  productId: string,
  productQty: number,
  orderStatus?: string,
  totalAmount?: number,
  Payment?: {
    paymentMethod: PaymentMethod,
    paymentStatus: string
  }

}
export interface IOrderItems extends IProduct {
  id: string,
  date: string,
  orderId: string,

}


export interface IEsewaFormData {
  amount: number;
  tax_amount: number;
  total_amount: number;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: number;
  product_delivery_charge: number;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
}

export interface IOrder {
  status: Status,
  items: IOrderItems[],
  khaltiUrl: string | null,
  esewaFormData: IEsewaFormData | null

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