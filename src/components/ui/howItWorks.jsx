const steps = [
  ['01', 'Explain', 'Share what you understand in your own words.'],
  ['02', 'Discuss', 'Answer questions that challenge your reasoning.'],
  ['03', 'Improve', 'Identify gaps and strengthen your understanding.'],
]

function HowItWorks() {
  return (
    <section className="process-section">
      <div className="home-shell">
        <div className="section-heading">
          <p className="eyebrow">HOW IT WORKS</p>
          <h2>
            Learn by explaining, <span>not memorizing.</span>
          </h2>
          <p>A focused learning loop designed to reveal and improve your understanding.</p>
        </div>

        <div className="process-grid">
          {steps.map(([number, title, description]) => (
            <article className="process-card" key={number}>
              <span className="step-number">{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
