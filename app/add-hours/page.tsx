'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/app/components/AppLayout'
import FormInput from '@/app/components/FormInput'
import FormSelect from '@/app/components/FormSelect'

const hourTypeOptions = [
  { value: 'DBQ', label: 'DBQ' },
  { value: 'Supervision', label: 'Supervision' },
  { value: 'Direct', label: 'Direct' }
]

export default function AddHoursPage() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Today's date
    hours: '',
    type: '',
    clientInitials: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validate hours
    const hoursNum = parseFloat(formData.hours)
    if (isNaN(hoursNum) || hoursNum <= 0) {
      setError('Hours must be a positive number')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/hours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: formData.date,
          hours: hoursNum,
          type: formData.type,
          clientInitials: formData.clientInitials || null
        }),
      })

      if (response.status === 401) {
        router.push('/login')
        return
      }

      if (response.ok) {
        // Success! Redirect to dashboard
        router.push('/dashboard')
      } else {
        const { error } = await response.json()
        setError(error || 'Failed to add hours')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppLayout title="Add Hours" showLogout={true}>
      <div className="form-container">
        <form onSubmit={handleSubmit} className="hour-form">
          <div className="form-header">
            <h2>Log Your Hours</h2>
            <p>Add a new hour entry to track your progress</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <FormInput
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />

          <FormInput
            label="Hours"
            name="hours"
            type="number"
            value={formData.hours}
            onChange={handleInputChange}
            required
            placeholder="e.g., 2.5"
          />

          <FormSelect
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleSelectChange}
            required
            options={hourTypeOptions}
          />

          <FormInput
            label="Client Initials"
            name="clientInitials"
            value={formData.clientInitials}
            onChange={handleInputChange}
            placeholder="e.g., J.D. (optional)"
          />

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Hours'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}