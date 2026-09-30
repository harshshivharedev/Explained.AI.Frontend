import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { registerUser } from '../services/api'
import { authButton, inputField } from '../styles/classNames'

const fields = [
  { name: 'fullName', label: 'Full name', type: 'text', autoComplete: 'name' },
  { name: 'username', label: 'Username', type: 'text', autoComplete: 'username' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
]

function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (Object.values(form).some((value) => !value.trim())) {
      return setError('All fields are required.')
    }

    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.')
    }

    setLoading(true)

    try {
      await registerUser(form)
      navigate('/login', { state: { registered: true }, replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9"
      >
        <Link to="/" className="text-lg font-extrabold text-slate-900">
          Concept<span className="text-blue-600">Coach</span>
        </Link>

        <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-slate-900">
          Create your account
        </h1>
        <p className="mt-2 text-slate-600">Start building deeper understanding today.</p>

        {error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        {fields.map((field) => (
          <label key={field.name} className="mt-5 block text-sm font-semibold text-slate-700">
            {field.label}
            <input
              type={field.type}
              value={form[field.name]}
              onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
              className={inputField}
              autoComplete={field.autoComplete}
            />
          </label>
        ))}

        <button
          disabled={loading}
          className={authButton}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <p className="mt-5 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-700">
            Log in
          </Link>
        </p>
      </form>
    </main>
  )
}

export default Signup
