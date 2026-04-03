import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
      <div className="text-6xl mb-6">🎁</div>
      <h1 className="text-3xl font-bold text-text-primary mb-3">
        ¡Ups! Esta página no existe
      </h1>
      <p className="text-text-secondary mb-8 max-w-md">
        Puede que el enlace esté roto o que la página haya sido eliminada. No te preocupes, puedes volver al inicio.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors duration-200"
      >
        Volver al inicio
      </Link>
    </div>
  )
}