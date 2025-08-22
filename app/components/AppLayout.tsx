'use client'

import { useRouter } from 'next/navigation'

interface AppLayoutProps {
  children: React.ReactNode
  title?: string
  showLogout?: boolean
}

export default function AppLayout({ children, title, showLogout = false }: AppLayoutProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Hourly</h1>
          {showLogout && (
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          )}
        </div>
        {title && <h2 className="page-title">{title}</h2>}
      </header>
      <main className="app-main">
        {children}
      </main>
    </div>
  )
}