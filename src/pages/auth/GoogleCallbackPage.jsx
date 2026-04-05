import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../api/axios'

export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      navigate('/login?error=google')
      return
    }

    const fetchUser = async () => {
      try {
        localStorage.setItem('token', token)
        const res = await api.get('/users/profile')
        loginWithToken(res.data.user)
        navigate('/dashboard')
      } catch {
        localStorage.removeItem('token')
        navigate('/login?error=google')
      }
    }

    fetchUser()
  }, [searchParams, navigate, loginWithToken])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-text-secondary">Iniciando sesion con Google...</p>
    </div>
  )
}