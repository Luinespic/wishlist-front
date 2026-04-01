export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  fullWidth = false
}) {
  const base = 'px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    secondary: 'bg-white text-text-primary border border-border hover:bg-bg',
    danger: 'bg-danger text-white hover:bg-danger-hover',
    ghost: 'text-primary hover:bg-primary-light'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {children}
    </button>
  )
}