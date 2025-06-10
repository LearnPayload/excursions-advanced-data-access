import { CartModel } from './cart-model'
import { CategoryModel } from './category-model'
import { OrderModel } from './order-model'
import { ProductModel } from './product-model'

export const local = {
  product: new ProductModel(),
  category: new CategoryModel(),
  cart: new CartModel(),
  order: new OrderModel(),
}
