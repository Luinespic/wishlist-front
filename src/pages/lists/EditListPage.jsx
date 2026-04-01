import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getListById, updateList } from '../../api/lists'

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

  if (loading) return <div>Cargando...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1>Editar lista</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre de la lista</label>
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
          <label>Fecha del evento (opcional)</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </div>

        <div>
          <label>Visibilidad</label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="public">Pública</option>
            <option value="private">Privada</option>
          </select>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={surpriseMode}
              onChange={(e) => setSurpriseMode(e.target.checked)}
            />
            Activar modo sorpresa
          </label>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}