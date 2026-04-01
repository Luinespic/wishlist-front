import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyReservations } from '../../api/reservations'
import { cancelReservation } from '../../api/reservations'

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await getMyReservations()
        setReservations(res.data.reservations)
      } catch {
        setError('Error al cargar las reservas')
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [])

  const handleCancel = async (productId) => {
    if (!window.confirm('¿Estás segura de que quieres cancelar esta reserva?')) return

    try {
      await cancelReservation(productId)
      setReservations(reservations.filter(r => r.product_id !== productId))
    } catch (err) {
      alert(err.response?.data?.error || 'Error al cancelar la reserva')
    }
  }

  if (loading) return <div>Cargando...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1>Mis reservas</h1>

      {reservations.length === 0 ? (
        <p>No tienes ninguna reserva todavía.</p>
      ) : (
        <ul>
          {reservations.map(reservation => (
            <li key={reservation.id}>
              {reservation.product.image_url && (
                <img
                  src={reservation.product.image_url}
                  alt={reservation.product.name}
                  width={80}
                  loading="lazy"
                />
              )}
              <h3>{reservation.product.name}</h3>
              <p>
                Lista: <Link to={`/lista/${reservation.product.list.share_token}`}>
                  {reservation.product.list.name}
                </Link>
              </p>
              <ul>
                {reservation.product.links.map(link => (
                  <li key={link.id}>
                    <img src={link.favicon_url} alt={link.shop_name} width={16} />
                    <a href={link.url} target="_blank" rel="noreferrer">
                      {link.shop_name}
                    </a>
                    <span>{link.price}€</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => handleCancel(reservation.product_id)}>
                Cancelar reserva
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}