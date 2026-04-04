import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getListById, deleteList } from '../../api/lists'
import { deleteProduct } from '../../api/products'
import Card from '../../components/Card'
import Button from '../../components/Button'

export default function ListDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const formatPrice = (price) => {
  return Number(price).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

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
    if (!window.confirm('Estas segura de que quieres eliminar esta lista?')) return
    try {
      await deleteList(id)
      navigate('/dashboard')
    } catch {
      setError('Error al eliminar la lista')
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Estas segura de que quieres eliminar este producto?')) return
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

  const handleCopyLink = () => {
    const url = `${window.location.origin}/lista/${list.share_token}`
    navigator.clipboard.writeText(url)
    alert('Enlace copiado al portapapeles')
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

  if (!list) return null

  const formattedDate = list.event_date
    ? new Date(list.event_date).toLocaleDateString('es-ES')
    : null

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">

      <div className="mb-8">
        <Link to="/dashboard" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">
          Volver al dashboard
        </Link>
        <div className="flex items-start justify-between mt-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">{list.name}</h1>
            {list.description && (
              <p className="text-text-secondary mt-2">{list.description}</p>
            )}
            <div className="flex items-center gap-3 mt-3">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-bg text-text-secondary border border-border">
                {list.visibility === 'public' ? 'Publica' : 'Privada'}
              </span>
              {list.surprise_mode && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-bg text-text-secondary border border-border">
                  Modo sorpresa
                </span>
              )}
              {formattedDate && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-bg text-text-secondary border border-border">
                  {formattedDate}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary-light transition-colors duration-200"
            >
              Compartir lista
            </button>
            <Link
              to={`/listas/${id}/editar`}
              className="px-4 py-2 text-sm font-medium text-text-secondary border border-border rounded-lg hover:bg-bg transition-colors duration-200"
            >
              Editar
            </Link>
            <Button variant="danger" onClick={handleDeleteList}>
              Eliminar
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-text-primary">
          Productos {list.products?.length > 0 && `(${list.products.length})`}
        </h2>
        <Link
          to={`/listas/${id}/productos/nuevo`}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors duration-200"
        >
          + Añadir producto
        </Link>
      </div>

      {list.products?.length === 0 ? (
        <Card className="text-center py-16">
          <div className="text-4xl mb-4">🛍️</div>
          <h3 className="text-lg font-bold text-text-primary mb-2">No hay productos todavia</h3>
          <p className="text-text-secondary mb-6">Añade los productos que te gustaria recibir como regalo.</p>
          <Link
            to={`/listas/${id}/productos/nuevo`}
            className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors duration-200 inline-block"
          >
            Añadir primer producto
          </Link>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {list.products?.map(product => (
            <Card key={product.id}>
              <div className="flex gap-6">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg border border-border flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">{product.name}</h3>
                      {product.description && (
                        <p className="text-text-secondary text-sm mt-1">{product.description}</p>
                      )}
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${product.status === 'available' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>
                      {product.status === 'available' ? 'Disponible' : 'Reservado'}
                    </span>
                  </div>

                  {product.status === 'reserved' && !list.surprise_mode && (
                    <p className="text-sm text-text-secondary mt-2">
                      Reservado por: <span className="font-medium text-text-primary">{product.reservation?.user?.name}</span>
                    </p>
                  )}

                  {product.status === 'reserved' && list.surprise_mode && (
                    <p className="text-sm text-text-secondary mt-2">Reservado (modo sorpresa activo)</p>
                  )}

                  <div className="flex items-center gap-3 mt-3">
                    {product.links?.map(link => (
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

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                    <Link
                      to={`/listas/${id}/productos/${product.id}/editar`}
                      className="text-sm font-medium text-text-secondary hover:text-text-primary px-3 py-2 rounded-lg border border-border hover:bg-bg transition-colors duration-200"
                    >
                      Editar
                    </Link>
                    <Button variant="danger" onClick={() => handleDeleteProduct(product.id)}>
                      Eliminar
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