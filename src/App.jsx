import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/lists/DashboardPage'
import ListDetailPage from './pages/lists/ListDetailPage'
import PublicListPage from './pages/lists/PublicListPage'
import ProfilePage from './pages/profile/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'
import CreateListPage from './pages/lists/CreateListPage'
import EditListPage from './pages/lists/EditListPage'
import AddProductPage from './pages/lists/AddProductPage'
import EditProductPage from './pages/lists/EditProductPage'
import MyReservationsPage from './pages/lists/MyReservationsPage'
import LandingPage from './pages/LandingPage'
import Navbar from './components/Navbar'
import AdminPage from './pages/admin/AdminPage'
import GoogleCallbackPage from './pages/auth/GoogleCallbackPage'


function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div>Cargando...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div>Cargando...</div>
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
          <Route path="/lista/:token" element={<PublicListPage />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/listas/:id" element={<PrivateRoute><ListDetailPage /></PrivateRoute>} />
          <Route path="/perfil" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/listas/nueva" element={<PrivateRoute><CreateListPage /></PrivateRoute>} />
          <Route path="/listas/:id/editar" element={<PrivateRoute><EditListPage /></PrivateRoute>} />
          <Route path="/listas/:id/productos/nuevo" element={<PrivateRoute><AddProductPage /></PrivateRoute>} />
          <Route path="/listas/:id/productos/:productId/editar" element={<PrivateRoute><EditProductPage /></PrivateRoute>} />
          <Route path="/mis-reservas" element={<PrivateRoute><MyReservationsPage /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
          <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}