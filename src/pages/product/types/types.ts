import type { Status } from "../../../globals/types/types";


export interface ICategory {
  id: string,
  categoryName: string
}


export interface IProduct {
  status: string;
  id: string,
  productName: string,
  productDescription: string,
  productPrice: number | null,
  productTotalStock: number,
  productDiscount: number,
  productImageUrl: string | null,
  createdAt: string,
  updatedAt: string,
  categoryId: string,
  category: ICategory
}



export interface IProducts {
  products: IProduct[],
  status: Status,
  product: IProduct | null

}