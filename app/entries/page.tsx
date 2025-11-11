"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import HourEntry from "../components/HourEntry"
import "./entries.css"

interface HourEntryData {
  id: string
  date: string
  hours: number
  type: "DBQ" | "Supervision" | "Direct" | "Consultation"
  clientInitials?: string
}

export default function AllEntries() {
  const [entries, setEntries] = useState<HourEntryData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetch("/api/hours")
      .then((res) => {
        if (res.status === 401) {
          router.push("/login")
          return null
        }
        if (!res.ok) throw new Error("Failed to fetch entries")
        return res.json()
      })
      .then((data) => {
        if (data) {
          setEntries(data.entries)
        }
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [router])

  const handleDeleteEntry = async (id: string) => {
    try {
      const res = await fetch(`/api/hours/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete entry")

      setEntries(entries.filter((entry) => entry.id !== id))
    } catch (err) {
      alert("Failed to delete entry")
    }
  }

  if (loading) {
    return (
      <div className="all-entries-container">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="all-entries-container">
        <div className="error-state">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="all-entries-container">
      <div className="all-entries-header">
        <Link href="/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>
        <h1>All Entries</h1>
        <p className="entry-count">{entries.length} total {entries.length === 1 ? 'entry' : 'entries'}</p>
      </div>

      {entries.length === 0 ? (
        <div className="no-entries">
          <p>No hour entries yet.</p>
          <Link href="/add-hours" className="auth-link">
            Add your first entry
          </Link>
        </div>
      ) : (
        <div className="all-entries-list">
          {entries.map((entry) => (
            <HourEntry
              key={entry.id}
              id={entry.id}
              date={entry.date}
              hours={entry.hours}
              type={entry.type}
              clientInitials={entry.clientInitials}
              onDelete={handleDeleteEntry}
            />
          ))}
        </div>
      )}
    </div>
  )
}
