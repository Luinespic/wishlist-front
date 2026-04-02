import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Input from '../../components/Input'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Bienvenida 🎁</h1>
          <p className="text-text-secondary mt-2">Inicia sesión en tu cuenta</p>
        </div>

        <Card>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-danger text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <Button type="submit" disabled={loading} fullWidth>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-text-secondary mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}