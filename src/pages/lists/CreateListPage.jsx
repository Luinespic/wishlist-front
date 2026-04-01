import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createList } from '../../api/lists'

export default function CreateListPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [visibility, setVisibility] = useState('public')
  const [surpriseMode, setSurpriseMode] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await createList({
        name,
        description,
        event_date: eventDate || null,
        visibility,
        surprise_mode: surpriseMode
      })
      navigate(`/listas/${res.data.list.id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la lista')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Crear nueva lista</h1>

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

        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear lista'}
        </button>
      </form>
    </div>
  )
}