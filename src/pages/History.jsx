import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/ui/navbar'
import { getUserSessions } from '../services/api'
import { primaryButton, smallOutlineButton, smallPrimaryButton, spinnerClass } from '../styles/classNames'

const statusStyles = {
  active: 'bg-amber-50 text-amber-700',
  completed: 'bg-green-50 text-green-700',
  abandoned: 'bg-slate-100 text-slate-600',
}

function formatDate(value) {
  if (!value) return 'Unknown date'

  return new Date(value).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-3 py-1.5 text-sm font-semibold capitalize ${
        statusStyles[status] || statusStyles.abandoned
      }`}
    >
      {status}
    </span>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-extrabold ${color}`}>{value}</p>
    </div>
  )
}

function SessionCard({ session }) {
  const progress = Math.min((session.currentRound / (session.maxRounds || 1)) * 100, 100)
  const isActive = session.status === 'active'

  return (
    <article
      className={[
        'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm',
        'transition hover:border-blue-200 sm:p-7',
      ].join(' ')}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {session.explanation?.topic || 'Untitled concept'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {formatDate(session.createdAt)} &middot; {session.maxRounds} round discussion
          </p>
        </div>
        <StatusBadge status={session.status} />
      </div>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-blue-600" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-3 text-sm text-slate-500">
        Completed {session.currentRound} of {session.maxRounds} rounds
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {session.status === 'completed' ? (
          <>
            <Link
              to={`/session/${session._id}/report`}
              className={smallPrimaryButton}
            >
              View report
            </Link>
            <Link
              to={`/session/${session._id}`}
              className={smallOutlineButton}
            >
              View discussion
            </Link>
          </>
        ) : (
          <Link
            to={`/session/${session._id}`}
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              isActive
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {isActive ? 'Continue discussion' : 'View discussion'}
          </Link>
        )}
      </div>
    </article>
  )
}

function History() {
  const [sessions, setSessions] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserSessions()
      .then((data) => setSessions(Array.isArray(data) ? data : []))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="grid min-h-[calc(100vh-4rem)] place-items-center px-5 text-center">
          <div>
            <div className={spinnerClass} />
            <h1 className="mt-6 text-2xl font-bold text-slate-900">Loading your history...</h1>
            <p className="mt-3 text-slate-600">Fetching your past learning sessions.</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="grid min-h-[calc(100vh-4rem)] place-items-center px-5 text-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Unable to load your history</h1>
            <p className="mt-3 text-slate-600">{error}</p>
            <Link to="/start-session" className="mt-6 inline-block font-semibold text-blue-700">
              Start a new session
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const completedCount = sessions.filter((session) => session.status === 'completed').length
  const activeCount = sessions.filter((session) => session.status === 'active').length

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold tracking-wide text-blue-700">LEARNING HISTORY</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Your past sessions
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Review previous discussions, revisit your learning reports, and continue any discussion
              that is still active.
            </p>
          </div>
          <Link
            to="/start-session"
            className={`${primaryButton} text-center`}
          >
            Start new session
          </Link>
        </header>

        {sessions.length > 0 && (
          <div className="mt-8 grid grid-cols-3 gap-4">
            <StatCard label="Total" value={sessions.length} color="text-slate-900" />
            <StatCard label="Completed" value={completedCount} color="text-green-700" />
            <StatCard label="In progress" value={activeCount} color="text-amber-700" />
          </div>
        )}

        {sessions.length === 0 ? (
          <section
            className={[
              'mt-10 rounded-2xl border border-slate-200 bg-white p-8',
              'text-center shadow-sm sm:p-12',
            ].join(' ')}
          >
            <div
              className={[
                'mx-auto grid h-16 w-16 place-items-center rounded-full',
                'bg-blue-50 text-2xl font-bold text-blue-700',
              ].join(' ')}
            >
              0
            </div>
            <h2 className="mt-6 text-xl font-bold text-slate-900">No sessions yet</h2>
            <p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">
              Explain a concept in your own words and ConceptCoach will start your first guided
              discussion.
            </p>
            <Link
              to="/start-session"
              className={`mt-7 inline-block ${primaryButton}`}
            >
              Start your first session
            </Link>
          </section>
        ) : (
          <div className="mt-8 space-y-5">
            {sessions.map((session) => (
              <SessionCard key={session._id} session={session} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default History

