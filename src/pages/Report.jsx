import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/ui/navbar'
import { generateReport, getSession } from '../services/api'
import { outlineButton, primaryButton, spinnerClass } from '../styles/classNames'

const scoreItems = [
  ['Clarity', 'clarityScore'],
  ['Correctness', 'correctnessScore'],
  ['Reasoning', 'reasoningScore'],
  ['Communication', 'communicationScore'],
]

function formatDate(value) {
  if (!value) return 'Unknown date'

  return new Date(value).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function ReportList({ title, items, color }) {
  if (!items?.length) return null

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className={`text-lg font-bold ${color}`}>{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex gap-3 text-sm leading-6 text-slate-700">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

function StatusScreen({ title, description, linkTo, linkLabel, showSpinner = false }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="grid min-h-[calc(100vh-4rem)] place-items-center px-5 text-center">
        <div>
          {showSpinner && <div className={spinnerClass} />}

          <h1 className={`${showSpinner ? 'mt-6 ' : ''}text-2xl font-bold text-slate-900`}>
            {title}
          </h1>
          <p className="mt-3 text-slate-600">{description}</p>

          {linkTo && (
            <Link to={linkTo} className="mt-6 inline-block font-semibold text-blue-700">
              {linkLabel}
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}

function Report() {
  const { sessionId } = useParams()
  const [report, setReport] = useState(null)
  const [session, setSession] = useState(null)
  const [topic, setTopic] = useState('Your concept')
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([generateReport(sessionId), getSession(sessionId)])
      .then(([reportData, sessionData]) => {
        setReport(reportData)
        setSession(sessionData)
        setTopic(sessionData.explanation?.topic || 'Your concept')
      })
      .catch((requestError) => setError(requestError.message))
  }, [sessionId])

  if (error) {
    return (
      <StatusScreen
        title="Unable to load your report"
        description={error}
        linkTo={`/session/${sessionId}/complete`}
        linkLabel="Back to session complete"
      />
    )
  }

  if (!report) {
    return (
      <StatusScreen
        title="Generating your learning report..."
        description="Reviewing your discussion and reasoning."
        showSpinner
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <header className="text-center">
          <p className="text-sm font-bold tracking-wide text-blue-700">LEARNING REPORT</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Your understanding of {topic}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            A review of your explanation, discussion, and next learning steps.
          </p>
          {session && (
            <p className="mt-4 text-sm font-semibold text-slate-500">
              {session.maxRounds} round discussion &middot; Generated {formatDate(report.createdAt)}
            </p>
          )}
        </header>

        <section className="mt-10 rounded-2xl bg-slate-900 p-7 text-white shadow-lg sm:p-10">
          <div className="grid gap-8 md:grid-cols-[.8fr_1.2fr] md:items-center">
            <div className="text-center md:border-r md:border-slate-700 md:pr-8">
              <p className="text-sm font-semibold text-blue-200">OVERALL UNDERSTANDING</p>
              <p className="mt-3 text-6xl font-extrabold">
                {report.overallScore}
                <span className="text-2xl text-slate-400">/10</span>
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Your final understanding after the guided discussion.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {scoreItems.map(([label, key]) => (
                <div key={key} className="rounded-xl bg-white/10 p-4">
                  <p className="text-sm text-slate-300">{label}</p>
                  <p className="mt-2 text-2xl font-bold">
                    {report[key]}
                    <span className="text-sm text-slate-400">/10</span>
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-700">
                    <div
                      className="h-full rounded-full bg-blue-400"
                      style={{ width: `${report[key] * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-7 grid gap-6 lg:grid-cols-2">
          <ReportList title="What you did well" items={report.goodPoints} color="text-green-700" />
          <ReportList
            title="Reasoning gaps found"
            items={report.reasoningGaps}
            color="text-amber-700"
          />
          <ReportList title="Gaps you resolved" items={report.resolvedGaps} color="text-blue-700" />
          <ReportList
            title="What to work on next"
            items={report.remainingGaps}
            color="text-red-700"
          />
        </div>

        <section className="mt-7 rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
          <p className="text-sm font-bold tracking-wide text-blue-700">IDEAL EXPLANATION</p>
          <p className="mt-4 leading-8 text-slate-700">{report.idealExplanation}</p>
        </section>

        <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-900">Recommended next steps</h2>
          <ol className="mt-5 space-y-4">
            {report.nextSteps?.map((step, index) => (
              <li key={index} className="flex gap-4 text-slate-700">
                <span
                  className={[
                    'grid h-7 w-7 shrink-0 place-items-center rounded-full',
                    'bg-blue-100 text-sm font-bold text-blue-700',
                  ].join(' ')}
                >
                  {index + 1}
                </span>
                <span className="pt-0.5 leading-6">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/start-session"
            className={`${primaryButton} text-center`}
          >
            Start another session
          </Link>
          <Link
            to={`/session/${sessionId}`}
            className={`${outlineButton} text-center`}
          >
            View discussion
          </Link>
          <Link
            to="/history"
            className={`${outlineButton} text-center`}
          >
            View all sessions
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Report

