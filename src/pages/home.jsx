import { Link } from 'react-router-dom'
import Navbar from '../components/ui/navbar'
import Hero from '../components/ui/hero'
import HowItWorks from '../components/ui/howItWorks'
import '../styles/home.css'

function Home() {
  return (
    <div className="home-page">
      <Navbar />

      <main>
        <Hero />
        <HowItWorks />

        <section className="home-shell final-cta">
          <div>
            <p className="eyebrow">START YOUR JOURNEY</p>
            <h2>Ready to test your understanding?</h2>
            <p>Take the first step toward deeper learning with ConceptCoach.</p>
          </div>

          <Link className="button button--primary" to="/signup">
            Start learning
            <span aria-hidden="true">&#8594;</span>
          </Link>
        </section>
      </main>
    </div>
  )
}

export default Home
