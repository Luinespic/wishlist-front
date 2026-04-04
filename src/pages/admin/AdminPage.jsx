import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { getAdminUsers, updateAdminUser, deleteAdminUser, getAdminLists, deleteAdminList, getAdminStats } from '../../api/admin'
import Card from '../../components/Card'
import Button from '../../components/Button'

export default function AdminPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('stats')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [lists, setLists] = useState([])
  const [usersPage, setUsersPage] = useState(1)
  const [listsPage, setListsPage] = useState(1)
  const [usersTotalPages, setUsersTotalPages] = useState(1)
  const [listsTotalPages, setListsTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'superadmin') {
      navigate('/dashboard')
    }
  }, [user, navigate])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminStats()
        setStats(res.data)
      } catch {
        setError('Error al cargar estadisticas')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  useEffect(() => {
    if (tab !== 'users') return
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const res = await getAdminUsers(usersPage)
        setUsers(res.data.users)
        setUsersTotalPages(res.data.pages)
      } catch {
        setError('Error al cargar usuarios')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [tab, usersPage])

  useEffect(() => {
    if (tab !== 'lists') return
    const fetchLists = async () => {
      setLoading(true)
      try {
        const res = await getAdminLists(listsPage)
        setLists(res.data.lists)
        setListsTotalPages(res.data.pages)
      } catch {
        setError('Error al cargar listas')
      } finally {
        setLoading(false)
      }
    }
    fetchLists()
  }, [tab, listsPage])

  const handleBanUser = async (userId, isBanned) => {
    try {
      await updateAdminUser(userId, { is_banned: !isBanned })
      setUsers(users.map(u => u.id === userId ? { ...u, is_banned: !isBanned } : u))
    } catch (err) {
      alert(err.response?.data?.error || 'Error al actualizar usuario')
    }
  }

  const handleChangeRole = async (userId, newRole) => {
    try {
      await updateAdminUser(userId, { role: newRole })
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
    } catch (err) {
      alert(err.response?.data?.error || 'Error al cambiar rol')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Estas seguro de que quieres eliminar este usuario?')) return
    try {
      await deleteAdminUser(userId)
      setUsers(users.filter(u => u.id !== userId))
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar usuario')
    }
  }

  const handleDeleteList = async (listId) => {
    if (!window.confirm('Estas seguro de que quieres eliminar esta lista?')) return
    try {
      await deleteAdminList(listId)
      setLists(lists.filter(l => l.id !== listId))
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar lista')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-text-primary">Panel de administracion</h1>
        <p className="text-text-secondary mt-1">Gestion de usuarios y listas de la plataforma.</p>
      </div>

      <div className="flex gap-2 mb-8 border-b border-border">
        {['stats', 'users', 'lists'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2 -mb-px ${tab === t ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
          >
            {t === 'stats' ? 'Estadisticas' : t === 'users' ? 'Usuarios' : 'Listas'}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-danger text-sm">
          {error}
        </div>
      )}

      {tab === 'stats' && stats && (
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <p className="text-text-secondary text-sm mb-1">Usuarios totales</p>
            <p className="text-4xl font-bold text-text-primary">{stats.totalUsers}</p>
          </Card>
          <Card>
            <p className="text-text-secondary text-sm mb-1">Listas creadas</p>
            <p className="text-4xl font-bold text-text-primary">{stats.totalLists}</p>
          </Card>
          <Card>
            <p className="text-text-secondary text-sm mb-1">Productos añadidos</p>
            <p className="text-4xl font-bold text-text-primary">{stats.totalProducts}</p>
          </Card>
          <Card>
            <p className="text-text-secondary text-sm mb-1">Reservas activas</p>
            <p className="text-4xl font-bold text-text-primary">{stats.totalReservations}</p>
          </Card>
        </div>
      )}

      {tab === 'users' && (
        <div className="flex flex-col gap-4">
          {loading ? (
            <p className="text-text-secondary">Cargando...</p>
          ) : (
            <>
              {users.map(u => (
                <Card key={u.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-text-primary">{u.name}</p>
                      <p className="text-sm text-text-secondary">{u.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-bg border border-border text-text-secondary">
                          {u.role}
                        </span>
                        {u.is_banned && (
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-50 border border-red-200 text-danger">
                            Baneado
                          </span>
                        )}
                        <span className="text-xs text-text-secondary">
                          {u._count.lists} listas · {u._count.reservations} reservas
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {user?.role === 'superadmin' && (
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u.id, e.target.value)}
                          className="text-sm px-2 py-1 rounded-lg border border-border bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                          <option value="superadmin">superadmin</option>
                        </select>
                      )}
                      <Button
                        variant={u.is_banned ? 'secondary' : 'ghost'}
                        onClick={() => handleBanUser(u.id, u.is_banned)}
                      >
                        {u.is_banned ? 'Desbanear' : 'Banear'}
                      </Button>
                      <Button variant="danger" onClick={() => handleDeleteUser(u.id)}>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="secondary"
                  disabled={usersPage === 1}
                  onClick={() => setUsersPage(p => p - 1)}
                >
                  Anterior
                </Button>
                <span className="text-sm text-text-secondary">
                  Pagina {usersPage} de {usersTotalPages}
                </span>
                <Button
                  variant="secondary"
                  disabled={usersPage === usersTotalPages}
                  onClick={() => setUsersPage(p => p + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'lists' && (
        <div className="flex flex-col gap-4">
          {loading ? (
            <p className="text-text-secondary">Cargando...</p>
          ) : (
            <>
              {lists.map(l => (
                <Card key={l.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-text-primary">{l.name}</p>
                      <p className="text-sm text-text-secondary">
                        {l.user.name} · {l.user.email}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-bg border border-border text-text-secondary">
                          {l.visibility}
                        </span>
                        <span className="text-xs text-text-secondary">
                          {l._count.products} productos
                        </span>
                        {l.event_date && (
                          <span className="text-xs text-text-secondary">
                            {new Date(l.event_date).toLocaleDateString('es-ES')}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="danger" onClick={() => handleDeleteList(l.id)}>
                      Eliminar
                    </Button>
                  </div>
                </Card>
              ))}

              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="secondary"
                  disabled={listsPage === 1}
                  onClick={() => setListsPage(p => p - 1)}
                >
                  Anterior
                </Button>
                <span className="text-sm text-text-secondary">
                  Pagina {listsPage} de {listsTotalPages}
                </span>
                <Button
                  variant="secondary"
                  disabled={listsPage === listsTotalPages}
                  onClick={() => setListsPage(p => p + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}