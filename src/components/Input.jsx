export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`px-3 py-2 rounded-lg border ${error ? 'border-danger' : 'border-border'} bg-white text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200`}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  )
}