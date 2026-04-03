import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../api/axios'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Input from '../../components/Input'

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
    <div className="max-w-2xl mx-auto px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-text-primary">Mi perfil</h1>
        <p className="text-text-secondary mt-1">{user?.email}</p>
      </div>

      {/* Info básica */}
      <div className="flex items-center gap-4 mb-8 p-4 rounded-xl bg-primary-light border border-primary/20">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-text-primary">{user?.name}</p>
          <p className="text-sm text-text-secondary">{user?.email}</p>
        </div>
        <span className="ml-auto text-xs font-medium px-2 py-1 rounded-full bg-white border border-border text-text-secondary">
          {user?.role}
        </span>
      </div>

      {/* Editar nombre */}
      <Card className="mb-6">
        <h2 className="text-lg font-bold text-text-primary mb-4">Editar nombre</h2>

        {errorProfile && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-danger text-sm">
            {errorProfile}
          </div>
        )}
        {successProfile && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
            {successProfile}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
          <Input
            label="Nombre"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Button type="submit" disabled={loadingProfile}>
            {loadingProfile ? 'Guardando...' : 'Guardar nombre'}
          </Button>
        </form>
      </Card>

      {/* Cambiar contraseña */}
      <Card className="mb-6">
        <h2 className="text-lg font-bold text-text-primary mb-4">Cambiar contraseña</h2>

        {errorPassword && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-danger text-sm">
            {errorPassword}
          </div>
        )}
        {successPassword && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
            {successPassword}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          <Input
            label="Contraseña actual"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            label="Nueva contraseña"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            label="Confirmar nueva contraseña"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={loadingPassword}>
            {loadingPassword ? 'Guardando...' : 'Cambiar contraseña'}
          </Button>
        </form>
      </Card>

      {/* Zona de peligro */}
      <Card>
        <h2 className="text-lg font-bold text-danger mb-2">Zona de peligro</h2>
        <p className="text-sm text-text-secondary mb-4">
          Una vez que elimines tu cuenta no hay vuelta atrás. Se borrarán todas tus listas, productos y reservas.
        </p>
        <Button variant="danger" onClick={handleDeleteAccount}>
          Eliminar cuenta
        </Button>
      </Card>
    </div>
  )
}