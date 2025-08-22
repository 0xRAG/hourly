'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AppLayout from '@/app/components/AppLayout'
import FormInput from '@/app/components/FormInput'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const { user } = await response.json()
        router.push('/dashboard')
      } else {
        const { error } = await response.json()
        setError(error || 'Login failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppLayout title="Login">
      <div className="auth-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Sign in to track your hours</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <FormInput
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Enter your username"
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />

          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="auth-footer">
            <p>
              Don&apos;t have an account?{' '}
              <Link href="/register" className="auth-link">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}