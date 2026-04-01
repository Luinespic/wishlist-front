import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getMyLists, deleteList } from '../../api/lists'

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

  if (loading) return <div>Cargando...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1>Hola, {user.name} 👋</h1>
      <Link to="/listas/nueva">Crear nueva lista</Link>

      {lists.length === 0 ? (
        <p>No tienes ninguna lista todavía. ¡Crea una!</p>
      ) : (
        <ul>
          {lists.map(list => (
            <li key={list.id}>
              <Link to={`/listas/${list.id}`}>{list.name}</Link>
              <span>{list._count.products} productos</span>
              <span>{list.visibility === 'public' ? 'Pública' : 'Privada'}</span>
              {list.event_date && (
                <span>{new Date(list.event_date).toLocaleDateString('es-ES')}</span>
              )}
              <button onClick={() => handleDelete(list.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}