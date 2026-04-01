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
import Navbar from './components/Navbar'



// Componente que protege rutas privadas
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <div>Cargando...</div>
  if (!user) return <Navigate to="/login" replace />

  return children
}

// Componente que redirige a dashboard si ya estás logado
function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <div>Cargando...</div>
  if (user) return <Navigate to="/dashboard" replace />

  return children
}

export default function App() {
  return (
    <div>
      <Navbar />
      <main>
    <Routes>
      {/* Rutas públicas - solo accesibles sin estar logado */}
      <Route path="/login" element={
        <PublicOnlyRoute>
          <LoginPage />
        </PublicOnlyRoute>
      } />
      <Route path="/register" element={
        <PublicOnlyRoute>
          <RegisterPage />
        </PublicOnlyRoute>
      } />

      {/* Ruta pública - accesible por cualquiera */}
      <Route path="/lista/:token" element={<PublicListPage />} />

      {/* Rutas privadas - solo accesibles estando logado */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
      } />
      <Route path="/listas/:id" element={
        <PrivateRoute>
          <ListDetailPage />
        </PrivateRoute>
      } />
      <Route path="/perfil" element={
        <PrivateRoute>
          <ProfilePage />
        </PrivateRoute>
      } />

      <Route path="/listas/nueva" element={
        <PrivateRoute>
          <CreateListPage />
        </PrivateRoute>
      } />
      <Route path="/listas/:id/editar" element={
        <PrivateRoute>
          <EditListPage />
        </PrivateRoute>
      } />
      <Route path="/listas/:id/productos/nuevo" element={
        <PrivateRoute>
          <AddProductPage />
        </PrivateRoute>
      } />
      <Route path="/listas/:id/productos/:productId/editar" element={
        <PrivateRoute>
          <EditProductPage />
        </PrivateRoute>
      } />

      <Route path="/mis-reservas" element={
        <PrivateRoute>
          <MyReservationsPage />
        </PrivateRoute>
      } />

      {/* Redireccion raíz */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
      </main>
    </div>
  )
}