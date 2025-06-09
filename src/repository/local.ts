import { CartModel } from './cart'
import { CategoryModel } from './category-model'
import { ProductModel } from './product-model'

export const local = {
  product: new ProductModel(),
  category: new CategoryModel(),
  cart: new CartModel(),
}
