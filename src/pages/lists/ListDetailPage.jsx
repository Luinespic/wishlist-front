import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getListById, deleteList } from '../../api/lists'
import { deleteProduct } from '../../api/products'
//import { useAuth } from '../../hooks/useAuth'

export default function ListDetailPage() {
  const { id } = useParams()
  //const { user } = useAuth()
  const navigate = useNavigate()

  const [list, setList] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

 useEffect(() => {
  const fetchList = async () => {
    try {
      const res = await getListById(id)
      setList(res.data.list)
    } catch {
      setError('Error al cargar la lista')
    } finally {
      setLoading(false)
    }
  }

  fetchList()
}, [id])

  const handleDeleteList = async () => {
    if (!window.confirm('¿Estás segura de que quieres eliminar esta lista?')) return

    try {
      await deleteList(id)
      navigate('/dashboard')
    } catch {
      setError('Error al eliminar la lista')
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Estás segura de que quieres eliminar este producto?')) return

    try {
      await deleteProduct(id, productId)
      setList({
        ...list,
        products: list.products.filter(p => p.id !== productId)
      })
    } catch {
      setError('Error al eliminar el producto')
    }
  }

  if (loading) return <div>Cargando...</div>
  if (error) return <div>{error}</div>
  if (!list) return <div>Lista no encontrada</div>

  return (
    <div>
      <Link to="/dashboard">← Volver al dashboard</Link>

      <h1>{list.name}</h1>
      {list.description && <p>{list.description}</p>}
      {list.event_date && (
        <p>Fecha: {new Date(list.event_date).toLocaleDateString('es-ES')}</p>
      )}
      <p>{list.visibility === 'public' ? 'Pública' : 'Privada'}</p>
      {list.surprise_mode && <p>Modo sorpresa activado</p>}

      <button onClick={handleDeleteList}>Eliminar lista</button>
      <Link to={`/listas/${id}/editar`}>Editar lista</Link>
      <Link to={`/listas/${id}/productos/nuevo`}>Añadir producto</Link>

      {list.products?.length === 0 ? (
        <p>No hay productos todavía. ¡Añade uno!</p>
      ) : (
        <ul>
          {list.products?.map(product => (
            <li key={product.id}>
              {product.image_url && (
                <img src={product.image_url} alt={product.name} width={80} />
              )}
              <h3>{product.name}</h3>
              {product.description && <p>{product.description}</p>}
              <p>{product.status === 'available' ? 'Disponible' : 'Reservado'}</p>
              <ul>
                {product.links?.map(link => (
                  <li key={link.id}>
                    <img src={link.favicon_url} alt={link.shop_name} width={16} />
                    <a href={link.url} target="_blank" rel="noreferrer">
                      {link.shop_name}
                    </a>
                    <span>{link.price}€</span>
                  </li>
                ))}
              </ul>
              <Link to={`/listas/${id}/productos/${product.id}/editar`}>Editar</Link>
              <button onClick={() => handleDeleteProduct(product.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}