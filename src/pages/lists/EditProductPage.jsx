import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getListById } from '../../api/lists'
import { updateProduct } from '../../api/products'

export default function EditProductPage() {
  const { id, productId } = useParams()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [links, setLinks] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getListById(id)
        const product = res.data.list.products.find(p => p.id === productId)
        if (!product) {
          setError('Producto no encontrado')
          return
        }
        setName(product.name)
        setDescription(product.description || '')
        setImageUrl(product.image_url || '')
        setLinks(product.links.map(link => ({
          url: link.url,
          shop_name: link.shop_name,
          price: link.price
        })))
      } catch {
        setError('Error al cargar el producto')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, productId])

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
    if (links.length > 2) {
      setLinks(links.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      await updateProduct(id, productId, {
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
      setError(err.response?.data?.error || 'Error al actualizar el producto')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Cargando...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1>Editar producto</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre del producto</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Descripción (opcional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label>URL de imagen (opcional)</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <div>
          <h3>Enlaces de compra (mínimo 2, máximo 4)</h3>
          {links.map((link, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Nombre de la tienda"
                value={link.shop_name}
                onChange={(e) => handleLinkChange(index, 'shop_name', e.target.value)}
                required
              />
              <input
                type="url"
                placeholder="URL del producto"
                value={link.url}
                onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Precio"
                value={link.price}
                onChange={(e) => handleLinkChange(index, 'price', e.target.value)}
                step="0.01"
                min="0"
                required
              />
              {links.length > 2 && (
                <button type="button" onClick={() => removeLink(index)}>
                  Eliminar enlace
                </button>
              )}
            </div>
          ))}
          {links.length < 4 && (
            <button type="button" onClick={addLink}>
              Añadir otro enlace
            </button>
          )}
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}