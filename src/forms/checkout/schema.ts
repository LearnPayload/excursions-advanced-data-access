import { z } from 'zod'

export const checkoutSchema = z.object({
  // Shipping Address
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  address: z.string().min(1, 'Address is required').min(5, 'Please enter a complete address'),
  city: z.string().min(1, 'City is required').min(2, 'City must be at least 2 characters'),
  state: z.string().min(1, 'State is required').min(2, 'State must be at least 2 characters'),
  zipCode: z
    .string()
    .min(1, 'ZIP code is required')
    .regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),

  // Payment Method (placeholder)
  paymentMethod: z.enum(['card', 'paypal', 'apple-pay']).default('card'),

  // Terms
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, 'You must agree to the terms and conditions'),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
