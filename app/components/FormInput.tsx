interface FormInputProps {
  label: string
  type?: string
  name: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  placeholder?: string
}

export default function FormInput({
  label,
  type = 'text',
  name,
  value,
  onChange,
  required = false,
  placeholder
}: FormInputProps) {
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="form-input"
      />
    </div>
  )
}