import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/ui/navbar'
import { primaryButton } from '../styles/classNames'

function SessionComplete() {
  const { sessionId } = useParams()

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="grid min-h-[calc(100vh-4rem)] place-items-center px-5 py-12">
        <section
          className={[
            'w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8',
            'text-center shadow-sm sm:p-10',
          ].join(' ')}
        >
          <div
            className={[
              'mx-auto grid h-16 w-16 place-items-center rounded-full',
              'bg-green-100 text-3xl font-bold text-green-700',
            ].join(' ')}
          >
            &#10003;
          </div>

          <p className="mt-6 text-sm font-bold tracking-wide text-green-700">SESSION COMPLETE</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
            Discussion completed
          </h1>
          <p className="mt-4 leading-7 text-slate-600">
            Your answers are ready for an AI evaluation. See your strengths, gaps, and recommended
            next steps.
          </p>

          <div className="mt-8 space-y-3">
            <Link
              to={`/session/${sessionId}/report`}
              className={`block ${primaryButton}`}
            >
              View your report
            </Link>
            <Link to="/start-session" className="block text-sm font-semibold text-blue-700">
              Start another session
            </Link>
            <Link to={`/session/${sessionId}`} className="block text-sm font-semibold text-slate-600">
              View discussion
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export default SessionComplete
