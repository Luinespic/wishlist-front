import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getListByToken } from '../../api/lists'
import { reserveProduct, cancelReservation } from '../../api/reservations'
import Card from '../../components/Card'
import Button from '../../components/Button'

export default function PublicListPage() {
  const { token } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [list, setList] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorType, setErrorType] = useState(null)

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await getListByToken(token)
        setList(res.data.list)
      } catch (err) {
        if (err.response?.status === 403) {
          setErrorType('private')
        } else {
          setErrorType('notfound')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchList()
  }, [token])

  const handleReserve = async (productId) => {
    if (!user) {
      navigate('/login', { state: { message: 'Debes iniciar sesion para reservar productos.' } })
      return
    }
    try {
      await reserveProduct(productId)
      const res = await getListByToken(token)
      setList(res.data.list)
    } catch (err) {
      alert(err.response?.data?.error || 'Error al reservar el producto')
    }
  }

  const handleCancelReservation = async (productId) => {
    if (!window.confirm('Estas segura de que quieres cancelar esta reserva?')) return
    try {
      await cancelReservation(productId)
      const res = await getListByToken(token)
      setList(res.data.list)
    } catch (err) {
      alert(err.response?.data?.error || 'Error al cancelar la reserva')
    }
  }

  const handleSearchGoogle = (productName) => {
    const query = encodeURIComponent(productName)
    window.open(`https://www.google.com/search?q=${query}`, '_blank')
  }

  const formatPrice = (price) => {
    return Number(price).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const isOwner = user && list && user.id === list.user_id

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-text-secondary">Cargando...</p>
    </div>
  )

  if (errorType === 'private') return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="text-5xl">🔒</div>
      <h1 className="text-2xl font-bold text-text-primary">Lista privada</h1>
      <p className="text-text-secondary">El propietario de esta lista la ha configurado como privada.</p>
      <Link to="/" className="text-primary font-medium hover:underline">Volver al inicio</Link>
    </div>
  )

  if (errorType === 'notfound') return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="text-5xl">🎁</div>
      <h1 className="text-2xl font-bold text-text-primary">Lista no encontrada</h1>
      <p className="text-text-secondary">El enlace puede haber caducado o no ser valido.</p>
      <Link to="/" className="text-primary font-medium hover:underline">Volver al inicio</Link>
    </div>
  )

  if (!list) return null

  const formattedDate = list.event_date
    ? new Date(list.event_date).toLocaleDateString('es-ES')
    : null

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">

      <div className="mb-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-text-primary">{list.name}</h1>
            {list.description && (
              <p className="text-text-secondary mt-2">{list.description}</p>
            )}

            {formattedDate && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium">
                <span>Fecha limite:</span>
                <span>{formattedDate}</span>
              </div>
            )}
          </div>

          {!user && (
            <Link
              to="/register"
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors duration-200"
            >
              Crear mi lista gratis
            </Link>
          )}
        </div>

        {!user && (
          <div className="mt-6 p-4 rounded-lg bg-primary-light border border-border">
            <p className="text-sm text-primary font-medium">
              Quieres reservar un regalo?{' '}
              <Link to="/login" className="underline">Inicia sesion</Link>
              {' '}o{' '}
              <Link to="/register" className="underline">crea una cuenta gratis</Link>.
            </p>
          </div>
        )}
      </div>

      {list.products.length === 0 ? (
        <Card className="text-center py-16">
          <div className="text-4xl mb-4">🛍️</div>
          <p className="text-text-secondary">Esta lista no tiene productos todavia.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {list.products.map(product => (
            <Card key={product.id}>
              <div className="flex gap-6">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg border border-border flex-shrink-0"
                    loading="lazy"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold text-text-primary">{product.name}</h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ml-4 ${product.status === 'available' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>
                      {product.status === 'available' ? 'Disponible' : 'Reservado'}
                    </span>
                  </div>

                  {product.description && (
                    <p className="text-text-secondary text-sm mt-1">{product.description}</p>
                  )}

                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    {product.links.map(link => (
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
                    <button
                      onClick={() => handleSearchGoogle(product.name)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary hover:text-primary text-sm text-text-secondary transition-colors duration-200"
                    >
                      <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                      Mas tiendas
                    </button>
                  </div>

                  <div className="mt-4">
                    {product.status === 'available' && !isOwner && (
                      <Button onClick={() => handleReserve(product.id)}>
                        Reservar regalo
                      </Button>
                    )}

                    {user && !isOwner && product.status === 'reserved' &&
                      product.reservation?.user_id === user.id && (
                        <Button variant="secondary" onClick={() => handleCancelReservation(product.id)}>
                          Cancelar reserva
                        </Button>
                      )}

                    {isOwner && product.status === 'reserved' && !list.surprise_mode && (
                      <p className="text-sm text-text-secondary">
                        Reservado por: <span className="font-medium text-text-primary">{product.reservation?.user_id}</span>
                      </p>
                    )}

                    {isOwner && product.status === 'reserved' && list.surprise_mode && (
                      <p className="text-sm text-text-secondary">
                        Reservado por:{' '}
                        <span className="font-bold text-primary text-base">Sorpresa!</span>
                      </p>
                    )}
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