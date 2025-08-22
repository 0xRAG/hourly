interface ProgressCircleProps {
  current: number
  target: number
  size?: number
}

export default function ProgressCircle({ current, target, size = 200 }: ProgressCircleProps) {
  const percentage = Math.min((current / target) * 100, 100)
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="progress-circle" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
          className="progress-stroke"
        />
      </svg>
      <div className="progress-text">
        <div className="progress-percentage">{Math.round(percentage)}%</div>
        <div className="progress-fraction">{current} / {target}</div>
      </div>
    </div>
  )
}