'use client'

import { useState } from 'react'
import { LoginForm, RegisterForm } from '@/forms/auth/form'

type TabType = 'login' | 'register'

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<TabType>('login')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Welcome
          </h1>

          {/* Tab Navigation */}
          <div className="flex mb-6 border-b">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 px-4 text-center font-medium transition-colors ${
                activeTab === 'login'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 px-4 text-center font-medium transition-colors ${
                activeTab === 'register'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'login' ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">Sign in to your account</h2>
                <LoginForm />
                <p className="mt-4 text-sm text-gray-600 text-center">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Create one here
                  </button>
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">Create your account</h2>
                <RegisterForm />
                <p className="mt-4 text-sm text-gray-600 text-center">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Demo credentials for testing:</p>
          <p className="font-mono">admin@example.com / password123</p>
        </div>
      </div>
    </div>
  )
}