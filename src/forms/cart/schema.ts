import { z } from 'zod'

export const addToCartSchema = z.object({
  productId: z.number().min(1, 'Product ID is required'),
  quantity: z
    .number()
    .min(1, 'Quantity must be at least 1')
    .max(99, 'Quantity cannot exceed 99')
    .int('Quantity must be a whole number'),
})

export type AddToCartFormData = z.infer<typeof addToCartSchema>
