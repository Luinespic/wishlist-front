import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyReservations, cancelReservation } from '../../api/reservations'
import Card from '../../components/Card'
import Button from '../../components/Button'

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
    if (!window.confirm('Estas segura de que quieres cancelar esta reserva?')) return
    try {
      await cancelReservation(productId)
      setReservations(reservations.filter(r => r.product_id !== productId))
    } catch (err) {
      alert(err.response?.data?.error || 'Error al cancelar la reserva')
    }
  }

  const formatPrice = (price) => {
    return Number(price).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-text-primary">Mis reservas</h1>
        <p className="text-text-secondary mt-1">
          {reservations.length === 0
            ? 'No tienes ninguna reserva activa'
            : `Tienes ${reservations.length} ${reservations.length === 1 ? 'reserva activa' : 'reservas activas'}`
          }
        </p>
      </div>

      {reservations.length === 0 ? (
        <Card className="text-center py-16">
          <div className="text-4xl mb-4">🎁</div>
          <h2 className="text-xl font-bold text-text-primary mb-2">No tienes reservas todavia</h2>
          <p className="text-text-secondary mb-6">Visita la lista de alguien y reserva un regalo.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {reservations.map(reservation => (
            <Card key={reservation.id}>
              <div className="flex gap-6">
                {reservation.product.image_url && (
                  <img
                    src={reservation.product.image_url}
                    alt={reservation.product.name}
                    className="w-24 h-24 object-cover rounded-lg border border-border flex-shrink-0"
                    loading="lazy"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-text-primary">{reservation.product.name}</h3>

                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-sm text-text-secondary">
                      Lista de{' '}
                      <Link
                        to={`/lista/${reservation.product.list.share_token}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {reservation.product.list.user?.name}
                      </Link>
                      {': '}
                      <Link
                        to={`/lista/${reservation.product.list.share_token}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {reservation.product.list.name}
                      </Link>
                    </p>

                    {reservation.product.list.event_date && (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary text-white flex-shrink-0">
                        Fecha limite: {new Date(reservation.product.list.event_date).toLocaleDateString('es-ES')}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    {reservation.product.links.map(link => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary hover:text-primary text-sm text-text-secondary transition-colors duration-200"
                      >
                        <img src={link.favicon_url} alt={link.shop_name} className="w-4 h-4" />
                        {link.shop_name}
                        <span className="font-medium">{formatPrice(link.price)}€</span>
                      </a>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <Button variant="danger" onClick={() => handleCancel(reservation.product_id)}>
                      Cancelar reserva
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}