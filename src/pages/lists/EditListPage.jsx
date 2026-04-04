import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getListById, updateList } from '../../api/lists'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Input from '../../components/Input'

export default function EditListPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [visibility, setVisibility] = useState('public')
  const [surpriseMode, setSurpriseMode] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await getListById(id)
        const list = res.data.list
        setName(list.name)
        setDescription(list.description || '')
        setEventDate(list.event_date ? list.event_date.split('T')[0] : '')
        setVisibility(list.visibility)
        setSurpriseMode(list.surprise_mode)
      } catch {
        setError('Error al cargar la lista')
      } finally {
        setLoading(false)
      }
    }

    fetchList()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      await updateList(id, {
        name,
        description,
        event_date: eventDate || null,
        visibility,
        surprise_mode: surpriseMode
      })
      navigate(`/listas/${id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar la lista')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-text-secondary">Cargando...</p>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-8 py-12">
      <div className="mb-8">
        <Link to={`/listas/${id}`} className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">
          ← Volver a la lista
        </Link>
        <h1 className="text-3xl font-bold text-text-primary mt-4">Editar lista</h1>
        <p className="text-text-secondary mt-1">Modifica los detalles de tu lista.</p>
      </div>

      <Card>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-danger text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Nombre de la lista"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-primary">Descripción (opcional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="px-3 py-2 rounded-lg border border-border bg-white text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          <Input
            label="Fecha del evento (opcional)"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-primary">Visibilidad</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            >
              <option value="public">🌍 Pública — cualquiera con el enlace puede verla</option>
              <option value="private">🔒 Privada — solo tú puedes verla</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-bg">
            <div>
              <p className="text-sm font-medium text-text-primary">🎭 Modo sorpresa</p>
              <p className="text-xs text-text-secondary mt-0.5">Sabrás que un producto está reservado pero no quién lo va a comprar</p>
            </div>
            <button
              type="button"
              onClick={() => setSurpriseMode(!surpriseMode)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${surpriseMode ? 'bg-primary' : 'bg-border'}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${surpriseMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving} fullWidth>
              {saving ? 'Guardando...' : 'Guardar cambios'}
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