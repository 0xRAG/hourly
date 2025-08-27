interface HourEntryProps {
  date: string
  hours: number
  type: 'DBQ' | 'Supervision' | 'Direct' | 'Consultation'
  clientInitials?: string
}

export default function HourEntry({ date, hours, type, clientInitials }: HourEntryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'DBQ':
        return '#ef4444' // red
      case 'Supervision':
        return '#f59e0b' // amber
      case 'Direct':
        return '#10b981' // green
      case 'Consultation':
        return '#8b5cf6' // purple
      default:
        return '#6b7280' // gray
    }
  }

  return (
    <div className="hour-entry">
      <div className="entry-date">{formatDate(date)}</div>
      <div className="entry-details">
        <span className="entry-hours">{hours} {hours === 1 ? 'hour' : 'hours'}</span>
        <span 
          className="entry-type" 
          style={{ color: getTypeColor(type) }}
        >
          {type}
        </span>
        {clientInitials && (
          <span className="entry-client">Client: {clientInitials}</span>
        )}
      </div>
    </div>
  )
}