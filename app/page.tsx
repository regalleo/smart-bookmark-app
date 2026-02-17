import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LoginButton from '@/components/LoginButton'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  let supabase;
  try {
    supabase = await createClient()
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-2">Configuration Error</h1>
          <p className="text-gray-600">Missing required environment variables. Please check your Supabase configuration.</p>
        </div>
      </div>
    )
  }
  
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="w-full max-w-md px-6">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-lg mb-4">
            <img src="/bookmark_icon.svg" alt="Smart Bookmarks" className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Smart Bookmarks
          </h1>
          <p className="text-gray-500 text-lg">
            Your personalized bookmark manager
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-medium text-gray-900 mb-6 text-center">
              Welcome back
            </h2>
            <LoginButton />
          </div>
          
          {/* Features */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-500">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span>Real-time</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span>Secure</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <span>Sync</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-8">
          Powered by Supabase • Built with Next.js
        </p>
        <p className="text-center text-gray-300 text-xs mt-2">
          Made by Raj Shekhar Singh • © 2026 Smart Bookmarks. All rights reserved.
        </p>
      </div>
    </div>
  )
}
