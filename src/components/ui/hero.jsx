import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="home-hero">
      <div className="home-shell home-hero__grid">
        <div className="home-hero__content">
          <p className="eyebrow">AI-POWERED LEARNING</p>
          <h1>
            Test your real <span>understanding.</span>
          </h1>
          <p className="hero-copy">
            Explain a concept in your own words. ConceptCoach asks deeper questions, finds gaps in
            your reasoning, and helps you build genuine understanding.
          </p>
          <div className="hero-actions">
            <Link className="button button--primary" to="/signup">
              Get Started <span aria-hidden="true">&#8594;</span>
            </Link>
            <p>
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>

        <div className="learning-preview" aria-label="Example ConceptCoach discussion">
          <div className="preview-glow" />

          <article className="message-card message-card--student">
            <span className="message-avatar">You</span>
            <p>I think a function takes an input and gives an output.</p>
            <i />
            <i className="short" />
          </article>

          <article className="message-card message-card--ai">
            <span className="message-avatar">AI</span>
            <div>
              <strong>ConceptCoach</strong>
              <p>Good start. Can one input have more than one output?</p>
            </div>
          </article>

          <article className="message-card message-card--reply">
            <p>No, each input can have only one output.</p>
          </article>

          <div className="progress-badge">
            <b>70%</b>
            <span>Getting stronger</span>
          </div>

          <div className="learning-steps">
            <span>Explain</span>
            <span>Discuss</span>
            <span>Improve</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
