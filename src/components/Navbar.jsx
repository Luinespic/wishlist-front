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
    <nav>
      <Link to="/dashboard">WishList App 🎁</Link>

      {user ? (
        <div>
          <Link to="/dashboard">Mis listas</Link>
          <Link to="/mis-reservas">Mis reservas</Link>
          <Link to="/perfil">{user.name}</Link>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      ) : (
        <div>
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/register">Registrarse</Link>
        </div>
      )}
    </nav>
  )
}