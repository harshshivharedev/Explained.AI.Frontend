import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/ui/navbar'
import { createExplanation, startSession } from '../services/api'
import { inputFieldTall, primaryButtonDisabled, selectField } from '../styles/classNames'

function StartSession() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ topic: '', explanationText: '', maxRounds: '3' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!form.topic.trim() || !form.explanationText.trim()) {
      return setError('Topic and explanation are required.')
    }

    if (form.explanationText.trim().length < 20) {
      return setError('Write at least 20 characters so AI can understand your explanation.')
    }

    setLoading(true)

    try {
      const explanation = await createExplanation({
        topic: form.topic.trim(),
        explanationText: form.explanationText.trim(),
      })
      const session = await startSession({
        explanationId: explanation._id,
        maxRounds: Number(form.maxRounds),
      })
      navigate(`/session/${session.sessionId}`)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <p className="text-sm font-bold tracking-wide text-blue-700">NEW SESSION</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
            Explain a concept in your own words.
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Do not worry about being perfect. Your explanation helps the AI find the right questions
            to ask.
          </p>

          {error && <p className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <form onSubmit={handleSubmit} className="mt-8">
            <label className="block text-sm font-semibold text-slate-700">
              Topic
              <input
                value={form.topic}
                onChange={(event) => setForm({ ...form, topic: event.target.value })}
                placeholder="For example: Binary Search"
                className={inputFieldTall}
              />
            </label>

            <label className="mt-6 block text-sm font-semibold text-slate-700">
              Your initial explanation
              <textarea
                value={form.explanationText}
                onChange={(event) => setForm({ ...form, explanationText: event.target.value })}
                placeholder="Explain this concept as if you were teaching a beginner..."
                rows="8"
                className={`${inputFieldTall} resize-y`}
              />
            </label>

            <div className="mt-6 max-w-xs">
              <label className="block text-sm font-semibold text-slate-700">
                Maximum rounds
                <select
                  value={form.maxRounds}
                  onChange={(event) => setForm({ ...form, maxRounds: event.target.value })}
                  className={selectField}
                >
                  <option value="3">3 rounds</option>
                  <option value="4">4 rounds</option>
                  <option value="5">5 rounds</option>
                </select>
              </label>
            </div>

            <button
              disabled={loading}
              className={`mt-8 ${primaryButtonDisabled}`}
            >
              {loading ? 'Starting discussion...' : 'Start discussion'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default StartSession
