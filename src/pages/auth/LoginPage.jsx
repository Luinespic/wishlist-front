import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
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
  const [searchParams] = useSearchParams()
  const googleError = searchParams.get('error')
  const location = searchParams.get('message')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Bienvenida</h1>
          <p className="text-text-secondary mt-2">Inicia sesion en tu cuenta</p>
        </div>

        <Card>
          {googleError === 'google' && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-danger text-sm">
              Error al iniciar sesion con Google. Intentalo de nuevo.
            </div>
          )}

          {location && (
            <div className="mb-4 p-3 rounded-lg bg-primary-light border border-border text-primary text-sm">
              {location}
            </div>
          )}

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
              label="Contrasena"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="..."
              required
            />
            <Button type="submit" disabled={loading} fullWidth>
              {loading ? 'Iniciando sesion...' : 'Iniciar sesion'}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs text-text-secondary bg-white px-2">
              o continua con
            </div>
          </div>

          <a
            href="http://localhost:3000/api/auth/google"
            className="flex items-center justify-center gap-3 w-full px-4 py-2 border border-border rounded-lg text-sm font-medium text-text-primary hover:bg-bg transition-colors duration-200"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Continuar con Google
          </a>
        </Card>

        <p className="text-center text-sm text-text-secondary mt-6">
          No tienes cuenta?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  )
}