import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../api/axios'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorProfile, setErrorProfile] = useState(null)
  const [errorPassword, setErrorPassword] = useState(null)
  const [successProfile, setSuccessProfile] = useState(null)
  const [successPassword, setSuccessPassword] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setErrorProfile(null)
    setSuccessProfile(null)
    setLoadingProfile(true)

    try {
      await api.patch('/users/profile', { name })
      setSuccessProfile('Nombre actualizado correctamente')
    } catch (err) {
      setErrorProfile(err.response?.data?.error || 'Error al actualizar el perfil')
    } finally {
      setLoadingProfile(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setErrorPassword(null)
    setSuccessPassword(null)

    if (newPassword !== confirmPassword) {
      setErrorPassword('Las contraseñas no coinciden')
      return
    }

    setLoadingPassword(true)

    try {
      await api.patch('/users/password', { currentPassword, newPassword })
      setSuccessPassword('Contraseña cambiada correctamente')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setErrorPassword(err.response?.data?.error || 'Error al cambiar la contraseña')
    } finally {
      setLoadingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('¿Estás segura de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) return

    try {
      await api.delete('/users/profile')
      logout()
      navigate('/login')
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar la cuenta')
    }
  }

  return (
    <div>
      <h1>Mi perfil</h1>
      <p>Email: {user?.email}</p>
      <p>Rol: {user?.role}</p>

      <h2>Editar nombre</h2>
      {errorProfile && <p>{errorProfile}</p>}
      {successProfile && <p>{successProfile}</p>}
      <form onSubmit={handleUpdateProfile}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loadingProfile}>
          {loadingProfile ? 'Guardando...' : 'Guardar nombre'}
        </button>
      </form>

      <h2>Cambiar contraseña</h2>
      {errorPassword && <p>{errorPassword}</p>}
      {successPassword && <p>{successPassword}</p>}
      <form onSubmit={handleChangePassword}>
        <div>
          <label>Contraseña actual</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Nueva contraseña</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirmar nueva contraseña</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loadingPassword}>
          {loadingPassword ? 'Guardando...' : 'Cambiar contraseña'}
        </button>
      </form>

      <h2>Zona de peligro</h2>
      <button onClick={handleDeleteAccount}>
        Eliminar cuenta
      </button>
    </div>
  )
}