import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logout()
    } finally {
      navigate('/login')
    }
  }

  return (
    <header className="site-nav">
      <nav className="site-nav__inner" aria-label="Main navigation">
        <Link to="/" className="brand">
          Concept<span>Coach</span>
        </Link>

        {isAuthenticated ? (
          <div className="site-nav__actions">
            <Link className="nav-link" to="/start-session">
              Start session
            </Link>
            <Link className="nav-link" to="/history">
              History
            </Link>
            <button className="nav-link nav-link--button" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="site-nav__actions">
            <Link className="nav-link" to="/login">
              Login
            </Link>
            <Link className="nav-cta" to="/signup">
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar
