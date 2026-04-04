import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-border px-8 py-5">
        <div className="flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          WishList 🎁
        </Link>

        {user ? (
          <div className="flex items-center gap-8">
            <Link
              to="/dashboard"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              Mis listas
            </Link>
            <Link
              to="/mis-reservas"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              Mis reservas
            </Link>
            {(user.role === 'admin' || user.role === 'superadmin') && (
              <Link
                to="/admin"
                className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200"
              > 
                Admin
            </Link>
            )}
            <Link
              to="/perfil"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              {user.name}
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm font-medium px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-danger hover:border-danger transition-colors duration-200"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors duration-200"
            >
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}