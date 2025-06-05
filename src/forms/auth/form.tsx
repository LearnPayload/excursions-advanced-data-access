'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction, registerAction } from './actions'
import { type LoginFormData, type RegisterFormData } from './schema'

interface FormState {
  message?: string
  fieldErrors?: Record<string, string[]>
}

export function LoginForm() {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<FormState>({})
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    const data: LoginFormData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    console.log('startTransition', data)
    startTransition(async () => {
      const result = await loginAction(data)

      if (result.success) {
        router.push('/')
        router.refresh()
      } else {
        setState({
          message: result.message,
          fieldErrors: result.fieldErrors,
        })
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your email"
        />
        {state.fieldErrors?.email && (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your password"
        />
        {state.fieldErrors?.password && (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      {state.message && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}

export function RegisterForm() {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<FormState>({})
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    const data: RegisterFormData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    }

    startTransition(async () => {
      const result = await registerAction(data)

      if (result.success) {
        router.push('/')
        router.refresh()
      } else {
        setState({
          message: result.message,
          fieldErrors: result.fieldErrors,
        })
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your full name"
        />
        {state.fieldErrors?.name && (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="register-email"
          name="email"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your email"
        />
        {state.fieldErrors?.email && (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          id="register-password"
          name="password"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Create a password"
        />
        {state.fieldErrors?.password && (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Confirm your password"
        />
        {state.fieldErrors?.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.confirmPassword[0]}</p>
        )}
      </div>

      {state.message && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  )
}
