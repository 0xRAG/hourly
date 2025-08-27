interface HourEntryProps {
  id: string
  date: string
  hours: number
  type: 'DBQ' | 'Supervision' | 'Direct' | 'Consultation'
  clientInitials?: string
  onDelete?: (id: string) => void
}

export default function HourEntry({ id, date, hours, type, clientInitials, onDelete }: HourEntryProps) {
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

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this entry?')) {
      onDelete(id)
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
      {onDelete && (
        <button 
          className="delete-btn" 
          onClick={handleDelete}
          title="Delete entry"
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            color: '#6b7280'
          }}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2m-6 5v6m4-6v6" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  )
}