import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getListByToken } from '../../api/lists'
import { reserveProduct, cancelReservation } from '../../api/reservations'

export default function PublicListPage() {
  const { token } = useParams()
  const { user } = useAuth()

  const [list, setList] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await getListByToken(token)
        setList(res.data.list)
      } catch {
        setError('Lista no encontrada')
      } finally {
        setLoading(false)
      }
    }

    fetchList()
  }, [token])

  const handleReserve = async (productId) => {
    try {
      await reserveProduct(productId)
      const res = await getListByToken(token)
      setList(res.data.list)
    } catch (err) {
      alert(err.response?.data?.error || 'Error al reservar el producto')
    }
  }

  const handleCancelReservation = async (productId) => {
    if (!window.confirm('¿Estás segura de que quieres cancelar esta reserva?')) return

    try {
      await cancelReservation(productId)
      const res = await getListByToken(token)
      setList(res.data.list)
    } catch (err) {
      alert(err.response?.data?.error || 'Error al cancelar la reserva')
    }
  }

  const isOwner = user && list && user.id === list.user_id

  if (loading) return <div>Cargando...</div>
  if (error) return <div>{error}</div>
  if (!list) return <div>Lista no encontrada</div>

  return (
    <div>
      <h1>{list.name}</h1>
      {list.description && <p>{list.description}</p>}
      {list.event_date && (
        <p>Fecha: {new Date(list.event_date).toLocaleDateString('es-ES')}</p>
      )}

      {list.products.length === 0 ? (
        <p>Esta lista no tiene productos todavía.</p>
      ) : (
        <ul>
          {list.products.map(product => (
            <li key={product.id}>
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  width={80}
                  loading="lazy"
                />
              )}
              <h3>{product.name}</h3>
              {product.description && <p>{product.description}</p>}
              <p>{product.status === 'available' ? '✅ Disponible' : '🎁 Reservado'}</p>

              <ul>
                {product.links.map(link => (
                  <li key={link.id}>
                    <img src={link.favicon_url} alt={link.shop_name} width={16} />
                    <a href={link.url} target="_blank" rel="noreferrer">
                      {link.shop_name}
                    </a>
                    <span>{link.price}€</span>
                  </li>
                ))}
              </ul>

              {/* Botón de reservar: solo para usuarios logados que no son el dueño */}
              {user && !isOwner && product.status === 'available' && (
                <button onClick={() => handleReserve(product.id)}>
                  Reservar
                </button>
              )}

              {/* Botón de cancelar: solo para quien hizo la reserva */}
              {user && !isOwner && product.status === 'reserved' &&
                product.reservation?.user_id === user.id && (
                  <button onClick={() => handleCancelReservation(product.id)}>
                    Cancelar reserva
                  </button>
                )}

              {/* Indicador para el dueño */}
              {isOwner && product.status === 'reserved' && !list.surprise_mode && (
                <p>Reservado por: {product.reservation?.user_id}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}