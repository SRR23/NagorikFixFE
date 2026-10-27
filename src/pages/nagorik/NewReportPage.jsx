import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import { formatError } from '../../lib/status'

const MAX_PHOTOS = 3

export default function NewReportPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    category_id: '',
    union: '',
    ward: '',
    description: '',
  })
  const [photos, setPhotos] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api('/api/categories/')
      .then((data) => setCategories(Array.isArray(data) ? data : data.results || []))
      .catch((err) => setError(formatError(err)))
  }, [])

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function onPhotosChange(event) {
    const files = Array.from(event.target.files || [])
    if (files.length > MAX_PHOTOS) {
      setError(`Maximum ${MAX_PHOTOS} photos allowed.`)
      setPhotos(files.slice(0, MAX_PHOTOS))
      return
    }
    setError('')
    setPhotos(files)
  }

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const body = new FormData()
    body.append('category_id', form.category_id)
    body.append('union', form.union)
    body.append('ward', form.ward)
    body.append('description', form.description)
    photos.forEach((file) => body.append('photos', file))

    try {
      const report = await api('/api/reports/', { method: 'POST', formData: body })
      navigate(`/app/reports/${report.id}`, { replace: true })
    } catch (err) {
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <Link to="/app" className="text-sm font-semibold text-ink/60 hover:text-ink">
          ← Back to my reports
        </Link>
        <h2 className="mt-2 font-display text-2xl font-bold">Report a problem</h2>
        <p className="text-sm text-ink/60">
          Tell us the union, ward, and what needs fixing. Add up to 3 photos.
        </p>
      </div>

      <form onSubmit={onSubmit} className="nf-panel space-y-4">
        <div>
          <label className="nf-label" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className="nf-input"
            value={form.category_id}
            onChange={(e) => update('category_id', e.target.value)}
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="nf-label" htmlFor="union">
              Union
            </label>
            <input
              id="union"
              className="nf-input"
              value={form.union}
              onChange={(e) => update('union', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="nf-label" htmlFor="ward">
              Ward
            </label>
            <input
              id="ward"
              className="nf-input"
              value={form.ward}
              onChange={(e) => update('ward', e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="nf-label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className="nf-input min-h-28"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            required
            minLength={10}
            placeholder="Describe the issue clearly…"
          />
        </div>

        <div>
          <label className="nf-label" htmlFor="photos">
            Photos (max {MAX_PHOTOS})
          </label>
          <input
            id="photos"
            type="file"
            accept="image/*"
            multiple
            className="nf-input file:mr-3 file:rounded-lg file:border-0 file:bg-mist file:px-3 file:py-1.5 file:text-sm file:font-semibold"
            onChange={onPhotosChange}
          />
          {photos.length > 0 ? (
            <p className="mt-1.5 text-xs text-ink/55">
              {photos.length} file(s) selected:{' '}
              {photos.map((f) => f.name).join(', ')}
            </p>
          ) : null}
        </div>

        {error ? (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-danger">{error}</p>
        ) : null}

        <button type="submit" className="nf-btn-primary w-full" disabled={loading}>
          {loading ? 'Submitting…' : 'Submit report'}
        </button>
      </form>
    </div>
  )
}
