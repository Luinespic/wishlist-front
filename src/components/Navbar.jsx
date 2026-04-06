import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMenuOpen(false)
  }

  return (
    <nav className="bg-white border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary">
          WishList 🎁
        </Link>

        {/* Menu desktop */}
        {user ? (
          <div className="hidden md:flex items-center gap-8">
            <Link to="/dashboard" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200">
              Mis listas
            </Link>
            <Link to="/mis-reservas" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200">
              Mis reservas
            </Link>
            {(user.role === 'admin' || user.role === 'superadmin') && (
              <Link to="/admin" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200">
                Admin
              </Link>
            )}
            <Link to="/perfil" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200">
              {user.name}
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm font-medium px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-danger hover:border-danger transition-colors duration-200"
            >
              Cerrar sesion
            </button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200">
              Iniciar sesion
            </Link>
            <Link to="/register" className="text-sm font-medium px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors duration-200">
              Registrarse
            </Link>
          </div>
        )}

        {/* Boton hamburguesa mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1 p-2"
        >
          <span className={`block w-6 h-0.5 bg-text-primary transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`block w-6 h-0.5 bg-text-primary transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-text-primary transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-border flex flex-col gap-4">
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-text-secondary hover:text-text-primary">
                Mis listas
              </Link>
              <Link to="/mis-reservas" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-text-secondary hover:text-text-primary">
                Mis reservas
              </Link>
              {(user.role === 'admin' || user.role === 'superadmin') && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-text-secondary hover:text-text-primary">
                  Admin
                </Link>
              )}
              <Link to="/perfil" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-text-secondary hover:text-text-primary">
                {user.name}
              </Link>
              <button onClick={handleLogout} className="text-sm font-medium text-danger text-left">
                Cerrar sesion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-text-secondary hover:text-text-primary">
                Iniciar sesion
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-primary font-medium">
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}