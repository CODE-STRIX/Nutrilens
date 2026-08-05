import './App.css'

export default function App() {
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🔬</span>
            <div>
              <h1 className="logo-title">Nutri Lens</h1>
              <p className="logo-sub">Food Label &amp; Ingredient Intelligence Platform</p>
            </div>
          </div>
          <nav className="nav">
            <a href="#features" className="nav-link">Features</a>
            <a href="#about" className="nav-link">About</a>
            <a href="https://github.com/CODE-STRIX/Nutrilens" target="_blank" rel="noopener noreferrer" className="nav-btn">
              GitHub ↗
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">🏆 Smart India Hackathon 2024 Project</div>
        <h2 className="hero-title">
          Scan. Understand. <span className="hero-accent">Protect.</span>
        </h2>
        <p className="hero-desc">
          India's first AI-powered food label intelligence platform. Decode every ingredient,
          detect recall alerts, and get personalized health analysis — all from a barcode scan.
        </p>
        <div className="hero-actions">
          <a
            href="https://github.com/CODE-STRIX/Nutrilens"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            View on GitHub
          </a>
          <a href="#features" className="btn-secondary">Explore Features</a>
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-num">12</span>
            <span className="stat-label">Core Features</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">6</span>
            <span className="stat-label">User Personas</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">100%</span>
            <span className="stat-label">Open Source</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">FSSAI</span>
            <span className="stat-label">Compliant Data</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <div className="section-header">
          <h2 className="section-title">Platform Features</h2>
          <p className="section-sub">12 intelligent features across the full food intelligence stack</p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div key={f.id} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-badge">F{f.id}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="tech-section" id="about">
        <div className="section-header">
          <h2 className="section-title">Tech Stack</h2>
          <p className="section-sub">Built for scale, speed, and India's regional food market</p>
        </div>
        <div className="tech-grid">
          {TECH_STACK.map((t) => (
            <div key={t.name} className="tech-card">
              <span className="tech-icon">{t.icon}</span>
              <span className="tech-name">{t.name}</span>
              <span className="tech-role">{t.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 CODE-STRIX · Nutri Lens · Built for Smart India Hackathon</p>
        <a href="https://github.com/CODE-STRIX/Nutrilens" target="_blank" rel="noopener noreferrer">
          github.com/CODE-STRIX/Nutrilens ↗
        </a>
      </footer>
    </div>
  )
}

const FEATURES = [
  { id: 1, icon: '📷', title: 'Smart Food Scanner', desc: 'Barcode-first recognition with ML Kit OCR fallback for unlisted regional snacks.' },
  { id: 2, icon: '🧪', title: 'Interactive Ingredient Intel', desc: 'Tap any ingredient to answer 6 key questions: what it is, why added, body effect, alternatives.' },
  { id: 3, icon: '🕸️', title: 'Ingredient Interaction Map', desc: 'Visual graph of ingredient combinations and their synergistic health effects.' },
  { id: 4, icon: '🏭', title: 'Manufacturing Transparency', desc: 'Reveals why each ingredient was chosen — cost, shelf life, texture, or flavor.' },
  { id: 5, icon: '🛡️', title: 'Personalized Health Flags', desc: 'Condition-aware warnings for diabetes, hypertension, PCOS, and allergy profiles.' },
  { id: 6, icon: '📊', title: 'Progress Dashboard', desc: 'Track nutrition trends, healthy eating streaks, and weekly scan history.' },
  { id: 7, icon: '🧠', title: 'Food Pattern Intelligence', desc: 'AI-powered habit analysis detecting sodium traps and ultra-processed food cycles.' },
  { id: 8, icon: '🌿', title: 'Healthy Alternative Finder', desc: 'Context-aware swaps with nutritional comparison to help you choose better.' },
  { id: 9, icon: '🛒', title: 'Smart Shopping Assistant', desc: 'Side-by-side product comparison at the shelf with safety scores.' },
  { id: 10, icon: '🎓', title: 'Learning Mode', desc: 'Bite-sized food literacy lessons unlocked by each scan — built for India.' },
  { id: 11, icon: '⚠️', title: 'FSSAI Recall Alerts', desc: 'Retroactive safety warnings for previously scanned products under recall.' },
  { id: 12, icon: '🤝', title: 'Community Verification', desc: 'Crowdsourced regional snack database with peer verification and OCR submission.' },
]

const TECH_STACK = [
  { icon: '⚛️', name: 'React Native', role: 'Mobile App' },
  { icon: '🟦', name: 'TypeScript', role: 'Full Stack' },
  { icon: '🚀', name: 'Express.js', role: 'Backend API' },
  { icon: '📱', name: 'ML Kit', role: 'OCR / Barcode' },
  { icon: '🔗', name: 'Shared Types', role: 'Monorepo Layer' },
  { icon: '▲', name: 'Vercel', role: 'Web Hosting' },
]
