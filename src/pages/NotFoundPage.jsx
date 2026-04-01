import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div>
      <h1>¡Ups! Esta página no existe</h1>
      <p>Puede que el enlace esté roto o que la página haya sido eliminada.</p>
      <Link to="/dashboard">Volver al inicio</Link>
    </div>
  )
}