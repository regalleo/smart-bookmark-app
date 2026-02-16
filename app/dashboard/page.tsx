'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import BookmarksList from '@/components/BookmarksList'
import AddBookmarkForm from '@/components/AddBookmarkForm'
import LogoutButton from '@/components/LogoutButton'

type Bookmark = {
  id: string
  title: string
  url: string
  created_at: string
  user_id: string
}

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/')
        return
      }

      setUser(user)

      const { data } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })

      setBookmarks(data || [])
      setLoading(false)
    }

    loadData()
  }, [])

  const handleBookmarkAdded = (newBookmark: Bookmark) => {
    setBookmarks(prev => [newBookmark, ...prev])
  }

  const handleBookmarkDeleted = (deletedId: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== deletedId))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) return null

  const userInitial = user.email?.charAt(0).toUpperCase() || 'U'
  const userName = user.email?.split('@')[0] || 'User'

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <span className="font-semibold text-gray-800">
                Smart Bookmarks
              </span>
            </div>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {userInitial}
                </div>
              </button>

              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {userName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
                <LogoutButton />
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-5xl mx-auto px-4 py-6">

        {/* Add Bookmark */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-medium text-gray-800">
              Add new bookmark
            </h2>
          </div>
          <AddBookmarkForm onBookmarkAdded={handleBookmarkAdded} />
        </div>

        {/* Bookmark List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-medium text-gray-800">
              Your Bookmarks ({bookmarks.length})
            </h2>
          </div>
          <BookmarksList initialBookmarks={bookmarks} userId={user.id} onBookmarkDeleted={handleBookmarkDeleted} />
        </div>

      </main>

      <footer className="max-w-5xl mx-auto px-4 py-6 text-center">
        <p className="text-gray-400 text-sm">
          Made by Raj Shekhar Singh • 2026 • Powered by Supabase • Built with Next.js
        </p>
      </footer>

    </div>
  )
}