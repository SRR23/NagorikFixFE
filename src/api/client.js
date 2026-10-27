const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

function authHeaders() {
  const token = localStorage.getItem('nf_access')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function parseError(response) {
  let detail = response.statusText
  try {
    const data = await response.json()
    detail = data.detail || data.error || data
  } catch {
    /* ignore */
  }
  const error = new Error(
    typeof detail === 'string' ? detail : JSON.stringify(detail),
  )
  error.status = response.status
  error.data = detail
  throw error
}

export async function api(path, options = {}) {
  const { json, formData, headers, method, ...rest } = options
  const finalHeaders = {
    ...authHeaders(),
    ...headers,
  }

  let body = rest.body
  if (json !== undefined) {
    finalHeaders['Content-Type'] = 'application/json'
    body = JSON.stringify(json)
  }
  if (formData) {
    body = formData
  }

  // fetch defaults to GET — a body is only valid on POST/PUT/PATCH/DELETE.
  const resolvedMethod =
    method || (body !== undefined ? 'POST' : 'GET')

  const response = await fetch(`${API_BASE}${path}`, {
    ...rest,
    method: resolvedMethod,
    headers: finalHeaders,
    body: resolvedMethod === 'GET' || resolvedMethod === 'HEAD' ? undefined : body,
  })

  if (response.status === 204) return null
  if (!response.ok) await parseError(response)

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }
  return response.text()
}

export function mediaUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_BASE}${path}`
}
