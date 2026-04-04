import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { createProduct } from '../../api/products'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Input from '../../components/Input'

export default function AddProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [links, setLinks] = useState([
    { url: '', shop_name: '', price: '' }
  ])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...links]
    newLinks[index][field] = value
    setLinks(newLinks)
  }

  const addLink = () => {
    if (links.length < 4) {
      setLinks([...links, { url: '', shop_name: '', price: '' }])
    }
  }

  const removeLink = (index) => {
    if (links.length > 1) {
      setLinks(links.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await createProduct(id, {
        name,
        description,
        image_url: imageUrl || null,
        links: links.map(link => ({
          ...link,
          price: parseFloat(link.price)
        }))
      })
      navigate(`/listas/${id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear el producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-8 py-12">
      <div className="mb-8">
        <Link to={`/listas/${id}`} className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">
          ← Volver a la lista
        </Link>
        <h1 className="text-3xl font-bold text-text-primary mt-4">Añadir producto</h1>
        <p className="text-text-secondary mt-1">Añade un producto con sus enlaces de compra en distintas tiendas.</p>
      </div>

      <Card>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-danger text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Nombre del producto"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Cascos Logitech G435"
            required
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-primary">Descripción (opcional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Añade una descripción del producto..."
              rows={2}
              className="px-3 py-2 rounded-lg border border-border bg-white text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          <Input
            label="URL de imagen (opcional)"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
          />

          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border border-border"
            />
          )}

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text-primary">
                Enlaces de compra <span className="text-text-secondary font-normal">(mínimo 1, máximo 4)</span>
              </label>
              {links.length < 4 && (
                <button
                  type="button"
                  onClick={addLink}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  + Añadir tienda
                </button>
              )}
            </div>

            {links.map((link, index) => (
              <div key={index} className="p-4 rounded-lg border border-border bg-bg flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-secondary">Tienda {index + 1}</span>
                  {links.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="text-sm text-danger hover:underline"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <Input
                    type="text"
                    placeholder="Nombre de la tienda (ej: Amazon)"
                    value={link.shop_name}
                    onChange={(e) => handleLinkChange(index, 'shop_name', e.target.value)}
                    required
                  />
                  <Input
                    type="url"
                    placeholder="URL del producto"
                    value={link.url}
                    onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                    required
                  />
                  <Input
                    type="number"
                    placeholder="Precio (ej: 59.99)"
                    value={link.price}
                    onChange={(e) => handleLinkChange(index, 'price', e.target.value)}
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} fullWidth>
              {loading ? 'Creando...' : 'Crear producto'}
            </Button>
            <Button variant="secondary" onClick={() => navigate(`/listas/${id}`)} fullWidth>
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}