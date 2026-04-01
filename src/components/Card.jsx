export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-border p-6 ${className}`}>
      {children}
    </div>
  )
}