'use client'

import { useState, useTransition } from 'react'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { addToCartAction } from './actions'
import { addToCartSchema, type AddToCartFormData } from './schema'
import { Product } from '@/payload-types'

interface AddToCartFormProps {
  productId: Product['id']
  maxQuantity: number
  isAuthenticated: boolean
}

interface FormState {
  message?: string
  fieldErrors?: Record<string, string[]>
  success?: boolean
}

export function AddToCartForm({ productId, maxQuantity, isAuthenticated }: AddToCartFormProps) {
  const [quantity, setQuantity] = useState(1)
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<FormState>({})

  const incrementQuantity = () => {
    if (quantity < maxQuantity && quantity < 99) {
      setQuantity((prev) => prev + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1
    const clampedValue = Math.max(1, Math.min(value, maxQuantity, 99))
    setQuantity(clampedValue)
  }

  async function handleSubmit(formData: FormData) {
    if (!isAuthenticated) {
      setState({
        success: false,
        message: 'Please sign in to add items to cart',
      })
      return
    }

    const data: AddToCartFormData = {
      productId,
      quantity,
    }

    startTransition(async () => {
      const result = await addToCartAction(data)

      setState({
        success: result.success,
        message: result.message,
        fieldErrors: result.fieldErrors,
      })

      // Clear success message after 3 seconds
      if (result.success) {
        setTimeout(() => {
          setState((prev) => ({ ...prev, message: undefined }))
        }, 3000)
      }
    })
  }

  if (maxQuantity === 0) {
    return (
      <div className="space-y-4">
        <p className="text-red-600 font-medium">Out of Stock</p>
        <button
          disabled
          className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg cursor-not-allowed"
        >
          Out of Stock
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Quantity:</label>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            type="button"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min={1}
            max={Math.min(maxQuantity, 99)}
            className="w-16 text-center border-0 focus:ring-0 focus:outline-none"
          />
          <button
            type="button"
            onClick={incrementQuantity}
            disabled={quantity >= maxQuantity || quantity >= 99}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <span className="text-sm text-gray-500">{maxQuantity} available</span>
      </div>

      {/* Add to Cart Button */}
      <form action={handleSubmit}>
        <button
          type="submit"
          disabled={isPending || !isAuthenticated}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="h-5 w-5" />
          <span>
            {isPending ? 'Adding...' : !isAuthenticated ? 'Sign in to Add to Cart' : 'Add to Cart'}
          </span>
        </button>
      </form>

      {/* Feedback Messages */}
      {state.message && (
        <div
          className={`p-3 text-sm rounded-md ${
            state.success
              ? 'text-green-600 bg-green-50 border border-green-200'
              : 'text-red-600 bg-red-50 border border-red-200'
          }`}
        >
          {state.message}
        </div>
      )}

      {state.fieldErrors?.quantity && (
        <p className="text-sm text-red-600">{state.fieldErrors.quantity[0]}</p>
      )}

      {!isAuthenticated && (
        <p className="text-sm text-gray-600 text-center">
          <a href="/auth" className="text-blue-600 hover:text-blue-800 underline">
            Sign in
          </a>{' '}
          to add items to your cart
        </p>
      )}
    </div>
  )
}
