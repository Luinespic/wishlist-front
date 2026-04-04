import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getMyLists, deleteList } from '../../api/lists'
import Card from '../../components/Card'
import Button from '../../components/Button'

export default function DashboardPage() {
  const { user } = useAuth()
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await getMyLists()
        setLists(res.data.lists)
      } catch {
        setError('Error al cargar las listas')
      } finally {
        setLoading(false)
      }
    }

    fetchLists()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás segura de que quieres eliminar esta lista?')) return

    try {
      await deleteList(id)
      setLists(lists.filter(list => list.id !== id))
    } catch {
      setError('Error al eliminar la lista')
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-text-secondary">Cargando...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-danger">{error}</p>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
  <div>
    <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
      Hola, {user.name} 👋
    </h1>
    <p className="text-text-secondary mt-1">
      {lists.length === 0
        ? 'Todavia no tienes ninguna lista'
        : `Tienes ${lists.length} ${lists.length === 1 ? 'lista' : 'listas'}`
      }
    </p>
  </div>
  <Link
    to="/listas/nueva"
    className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors duration-200 whitespace-nowrap"
  >
    + Nueva lista
  </Link>
</div>

      {/* Lista vacía */}
      {lists.length === 0 ? (
        <Card className="text-center py-16">
          <div className="text-5xl mb-4">🎁</div>
          <h2 className="text-xl font-bold text-text-primary mb-2">
            Crea tu primera lista
          </h2>
          <p className="text-text-secondary mb-6">
            Añade productos, comparte el enlace y deja que tus seres queridos reserven sin duplicados.
          </p>
          <Link
            to="/listas/nueva"
            className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors duration-200 inline-block"
          >
            Crear lista
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lists.map(list => (
            <Card key={list.id} className="hover:border-primary transition-colors duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Link
                    to={`/listas/${list.id}`}
                    className="text-lg font-bold text-text-primary hover:text-primary transition-colors duration-200"
                  >
                    {list.name}
                  </Link>
                  {list.description && (
                    <p className="text-text-secondary text-sm mt-1 line-clamp-2">
                      {list.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4">
  <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary-light text-primary">
    {list._count.products} {list._count.products === 1 ? 'producto' : 'productos'}
  </span>
  {list.reservedCount > 0 && (
    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
      {list.reservedCount} reservado{list.reservedCount > 1 ? 's' : ''}
    </span>
  )}
  <span className="text-xs font-medium px-2 py-1 rounded-full bg-bg text-text-secondary border border-border">
    {list.visibility === 'public' ? 'Publica' : 'Privada'}
  </span>
  {list.surprise_mode && (
    <span className="text-xs font-medium px-2 py-1 rounded-full bg-bg text-text-secondary border border-border">
      Modo sorpresa
    </span>
  )}
</div>

              {list.event_date && (
                <p className="text-xs text-text-secondary mb-4">
                  📅 {new Date(list.event_date).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              )}

              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <Link
                  to={`/listas/${list.id}`}
                  className="flex-1 text-center text-sm font-medium text-primary hover:bg-primary-light px-3 py-2 rounded-lg transition-colors duration-200"
                >
                  Ver lista
                </Link>
                <Link
                  to={`/listas/${list.id}/editar`}
                  className="flex-1 text-center text-sm font-medium text-text-secondary hover:bg-bg px-3 py-2 rounded-lg border border-border transition-colors duration-200"
                >
                  Editar
                </Link>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(list.id)}
                >
                  Eliminar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}