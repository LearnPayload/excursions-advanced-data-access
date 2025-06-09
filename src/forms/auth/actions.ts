'use server'
import { login } from '@payloadcms/next/auth'
import config from '@payload-config'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getPayloadClient } from '@/db/client'
import { loginSchema, registerSchema, type LoginFormData, type RegisterFormData } from './schema'

interface ActionResult {
  success: boolean
  message?: string
  fieldErrors?: Record<string, string[]>
}

export async function loginAction(data: LoginFormData): Promise<ActionResult> {
  try {
    console.log({ data })
    // Validate input
    const { email, password } = loginSchema.parse(data)

    // Attempt login
    const result = await login({
      collection: 'users',
      config,
      email,
      password,
    })

    console.log({ result })
    if (result.user) {
      return { success: true, message: 'Login successful' }
    } else {
      return { success: false, message: 'Invalid credentials' }
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        message: error.message,
      }
    }

    return {
      success: false,
      message: 'Login failed. Please try again.',
    }
  }
}

export async function registerAction(data: RegisterFormData): Promise<ActionResult> {
  try {
    // Validate input
    const { name, email, password } = registerSchema.parse(data)

    const payload = await getPayloadClient()

    // Create user
    const result = await payload.create({
      collection: 'users',
      data: {
        name,
        email,
        password,
      },
    })

    if (result.id) {
      // Auto-login after registration
      await login({
        collection: 'users',
        config,
        email,
        password,
      })

      return { success: true, message: 'Account created successfully' }
    } else {
      return { success: false, message: 'Failed to create account' }
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        message: error.message,
      }
    }

    // Handle duplicate email error
    return {
      success: false,
      message: 'There was an error creating your account. Please check your email and try again.',
    }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('payload-token')
  redirect('/')
}
