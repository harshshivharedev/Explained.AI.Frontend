import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/ui/navbar'
import { getSession, getSessionMessages, sendSessionMessage } from '../services/api'
import {
  answerField,
  outlineButton,
  primaryButton,
  smallPrimaryButtonDisabled,
} from '../styles/classNames'

function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[70%] ${
          isUser
            ? 'rounded-br-sm bg-blue-600 text-white'
            : 'rounded-bl-sm border border-slate-200 bg-white text-slate-700'
        }`}
      >
        <p className={`mb-1 text-xs font-bold ${isUser ? 'text-blue-100' : 'text-blue-700'}`}>
          {isUser ? 'You' : 'ConceptCoach'}
        </p>
        {message.content}
      </div>
    </div>
  )
}

function ThinkingBubble() {
  return (
    <div className="flex justify-start">
      <div
        className={[
          'rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3',
          'text-sm text-slate-500',
        ].join(' ')}
      >
        ConceptCoach is thinking...
      </div>
    </div>
  )
}

function RoundBadge({ session, isActive }) {
  if (!isActive) {
    return (
      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">
        Completed discussion
      </span>
    )
  }

  const round = Math.min(session.currentRound + 1, session.maxRounds)

  return (
    <span className="rounded-full bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700">
      Round {round} of {session.maxRounds}
    </span>
  )
}

function CompletedActions({ sessionId, error }) {
  return (
    <div className="border-t border-slate-200 bg-white p-5 sm:p-6">
      {error && <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <p className="text-sm text-slate-600">
        This discussion is complete, so it is read only. Open the report to see your scores, gaps and
        next steps.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Link to={`/session/${sessionId}/report`} className={`text-center ${primaryButton}`}>
          View your report
        </Link>
        <Link to="/start-session" className={`text-center ${outlineButton}`}>
          Start a new session
        </Link>
      </div>
    </div>
  )
}

function ChatSession() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    Promise.all([getSession(sessionId), getSessionMessages(sessionId)])
      .then(([sessionData, messageData]) => {
        setSession(sessionData)
        setMessages(messageData)
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [sessionId])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!content.trim() || sending) return

    setSending(true)

    try {
      const result = await sendSessionMessage(sessionId, content)
      setMessages((currentMessages) => [
        ...currentMessages,
        result.userMessage,
        ...(result.nextMessage ? [result.nextMessage] : []),
      ])
      setSession((currentSession) => ({
        ...currentSession,
        status: result.status,
        currentRound: result.currentRound,
      }))
      setContent('')

      if (result.status === 'completed') {
        navigate(`/session/${sessionId}/complete`)
      }
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 text-slate-600">
        Loading discussion...
      </div>
    )
  }

  if (error && !session) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 px-5 text-center">
        <div>
          <p className="text-lg font-semibold text-slate-900">Unable to load this session</p>
          <p className="mt-2 text-slate-600">{error}</p>
          <Link to="/start-session" className="mt-5 inline-block font-semibold text-blue-700">
            Start a new session
          </Link>
        </div>
      </div>
    )
  }

  const isActive = session.status === 'active'
  const progressWidth = `${Math.min((session.currentRound / session.maxRounds) * 100, 100)}%`

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-200 px-5 py-5 sm:px-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold tracking-wide text-blue-700">
                  {isActive ? 'ACTIVE DISCUSSION' : 'PAST DISCUSSION'}
                </p>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
                  {session.explanation?.topic || 'Learning session'}
                </h1>
              </div>
              <RoundBadge session={session} isActive={isActive} />
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{ width: progressWidth }}
              />
            </div>
          </header>

          <div className="min-h-96 space-y-5 bg-slate-50 p-5 sm:p-7">
            {messages.map((message) => (
              <MessageBubble key={message._id} message={message} />
            ))}

            {sending && <ThinkingBubble />}
          </div>

          {isActive ? (
            <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-5 sm:p-6">
              {error && <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

              <label className="sr-only" htmlFor="answer">
                Your answer
              </label>
              <textarea
                id="answer"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Write your answer..."
                rows="4"
                disabled={sending}
                className={answerField}
              />

              <div className="mt-3 flex items-center justify-between gap-4">
                <p className="text-xs text-slate-500">Answer in your own words.</p>
                <button disabled={sending || !content.trim()} className={smallPrimaryButtonDisabled}>
                  {sending ? 'Sending...' : 'Send answer'}
                </button>
              </div>
            </form>
          ) : (
            <CompletedActions sessionId={sessionId} error={error} />
          )}
        </section>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <Link to="/history" className="text-sm font-semibold text-blue-700">
            Back to all sessions
          </Link>
          <Link
            to={`/session/${sessionId}/complete`}
            className="text-sm font-semibold text-slate-600"
          >
            Session summary
          </Link>
        </div>
      </main>
    </div>
  )
}

export default ChatSession

