const API_URL = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.message || 'Something went wrong. Please try again.')
  }

  return payload.data
}

// Auth
export const registerUser = (data) =>
  request('/users/register', { method: 'POST', body: JSON.stringify(data) })

export const loginUser = (data) =>
  request('/users/login', { method: 'POST', body: JSON.stringify(data) })

export const logoutUser = () => request('/users/logout', { method: 'POST' })

export const getCurrentUser = () => request('/users/current-user')

// Explanations
export const createExplanation = (data) =>
  request('/explanations', { method: 'POST', body: JSON.stringify(data) })

// Learning sessions
export const startSession = (data) =>
  request('/sessions', { method: 'POST', body: JSON.stringify(data) })

export const getUserSessions = () => request('/sessions')

export const getSession = (sessionId) => request(`/sessions/${sessionId}`)

export const getSessionMessages = (sessionId) => request(`/sessions/${sessionId}/messages`)

export const sendSessionMessage = (sessionId, content) =>
  request(`/sessions/${sessionId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })

// Reports
export const generateReport = (sessionId) =>
  request(`/sessions/${sessionId}/report`, { method: 'POST' })

export const getReport = (sessionId) => request(`/sessions/${sessionId}/report`)
