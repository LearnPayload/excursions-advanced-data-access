'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Shield } from 'lucide-react'
import { processCheckoutAction } from './actions'
import { type CheckoutFormData } from './schema'
import { User } from '@/payload-types'

interface CheckoutFormProps {
  user: User
}

interface FormState {
  message?: string
  fieldErrors?: Record<string, string[]>
  success?: boolean
}

export function CheckoutForm({ user }: CheckoutFormProps) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<FormState>({})
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    const data: CheckoutFormData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      zipCode: formData.get('zipCode') as string,
      paymentMethod: formData.get('paymentMethod') as 'card' | 'paypal' | 'apple-pay',
      agreeToTerms: formData.get('agreeToTerms') === 'on',
    }

    startTransition(async () => {
      const result = await processCheckoutAction(data)

      if (result.success && result.orderId) {
        router.push(`/orders/${result.orderId}`)
      } else {
        setState({
          success: result.success,
          message: result.message,
          fieldErrors: result.fieldErrors,
        })
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Shipping Address */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              defaultValue={user.name?.split(' ')[0] || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {state.fieldErrors?.firstName && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.firstName[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              defaultValue={user.name?.split(' ').slice(1).join(' ') || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {state.fieldErrors?.lastName && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.lastName[0]}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            defaultValue={user.email}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {state.fieldErrors?.email && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.email[0]}</p>
          )}
        </div>

        <div className="mt-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            required
            placeholder="123 Main St"
            defaultValue={'123 Main St'}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {state.fieldErrors?.address && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.address[0]}</p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              required
              defaultValue={'Knoxville'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {state.fieldErrors?.city && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.city[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <input
              type="text"
              id="state"
              name="state"
              required
              placeholder="CA"
              defaultValue={'TN'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {state.fieldErrors?.state && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.state[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              required
              placeholder="12345"
              defaultValue={'12345'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {state.fieldErrors?.zipCode && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.zipCode[0]}</p>
            )}
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Payment Method
        </h2>

        <div className="space-y-3">
          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input type="radio" name="paymentMethod" value="card" defaultChecked className="mr-3" />
            <CreditCard className="h-5 w-5 mr-2" />
            <span>Credit/Debit Card</span>
            <span className="ml-auto text-sm text-gray-500">**** **** **** 1234</span>
          </label>

          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input type="radio" name="paymentMethod" value="paypal" className="mr-3" />
            <div className="w-5 h-5 mr-2 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
              P
            </div>
            <span>PayPal</span>
            <span className="ml-auto text-sm text-gray-500">user@example.com</span>
          </label>

          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input type="radio" name="paymentMethod" value="apple-pay" className="mr-3" />
            <div className="w-5 h-5 mr-2 bg-black rounded text-white text-xs flex items-center justify-center">
              🍎
            </div>
            <span>Apple Pay</span>
            <span className="ml-auto text-sm text-gray-500">Touch ID</span>
          </label>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-md flex items-center">
          <Shield className="h-4 w-4 text-green-600 mr-2" />
          <p className="text-sm text-gray-600">
            This is a demo. No real payment will be processed.
          </p>
        </div>
      </div>

      {/* Terms and Submit */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-start space-x-2 mb-4">
          <input type="checkbox" id="agreeToTerms" name="agreeToTerms" required className="mt-1" />
          <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
            I agree to the{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800 underline">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800 underline">
              Privacy Policy
            </a>
          </label>
        </div>
        {state.fieldErrors?.agreeToTerms && (
          <p className="mb-4 text-sm text-red-600">{state.fieldErrors.agreeToTerms[0]}</p>
        )}

        {state.message && !state.success && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {state.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {isPending ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </form>
  )
}
