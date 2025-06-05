import { CartModel } from './models/cart'
import { CategoryModel } from './models/category'
import { ProductModel } from './models/product'

// Model registry for Local API
export const local = {
  product: new ProductModel(),
  cart: new CartModel(),
  category: new CategoryModel(),
} as const
