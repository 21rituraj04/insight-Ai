import "./App.css";
import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

/* ── MODAL COMPONENT ───────────────────────────────────────────── */
function Modal({ id, onClose }) {
  useEffect(() => {
    const esc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const content = {
    about: {
      title: "About InsightAI",
      icon: "✦",
      body: (
        <div className="about-body">
          <div className="about-intro">
            <div className="about-avatar">PP</div>
            <div>
              <div className="about-name">👋 Hi, I'm Purab Pourel</div>
              <p>I'm a developer passionate about building intelligent systems that solve real-world problems using AI and modern web technologies.</p>
            </div>
          </div>

          <div className="about-section">
            <div className="about-section-title">🚀 About This Project</div>
            <p>InsightAI is designed to transform unstructured YouTube comments into meaningful business insights. Instead of manually reading hundreds of comments, this system uses AI to automatically detect sentiment, emotions, and key discussion topics.</p>
          </div>

          <div className="about-section">
            <div className="about-section-title">💡 Problem Solved</div>
            <p>Businesses and creators often struggle to understand audience feedback at scale. This platform helps by:</p>
            <div className="about-checklist">
              <div className="about-check">✔ Identifying positive and negative reactions</div>
              <div className="about-check">✔ Detecting common issues (delivery, quality, etc.)</div>
              <div className="about-check">✔ Generating actionable insights instantly</div>
            </div>
          </div>

          <div className="about-section">
            <div className="about-section-title">🧠 What Makes It Interesting</div>
            <div className="about-tags">
              <span className="about-tag">🤖 AI (NLP &amp; Transformers)</span>
              <span className="about-tag">⚡ Real-time Processing</span>
              <span className="about-tag">📊 Interactive Dashboard</span>
            </div>
            <p>It's not just a tool — it's an intelligent feedback analysis system.</p>
          </div>

          <div className="about-contact">
            <span>📫</span>
            <a href="mailto:purabpourel01@gmail.com">purabpourel01@gmail.com</a>
          </div>
        </div>
      ),
    },
    docs: {
      title: "Documentation",
      icon: "📖",
      body: (
        <div className="docs-body">
          <div className="docs-section">
            <div className="docs-section-title">1. Overview</div>
            <p>InsightAI analyzes YouTube comments using AI, converting raw audience feedback into structured business insights.</p>
          </div>

          <div className="docs-section">
            <div className="docs-section-title">2. Features ✨</div>
            <div className="docs-features">
              <span className="docs-feature">😊 Sentiment Analysis</span>
              <span className="docs-feature">😤 Emotion Detection</span>
              <span className="docs-feature">🏷️ Topic Detection</span>
              <span className="docs-feature">💡 Insights Generation</span>
              <span className="docs-feature">📊 Interactive Dashboard</span>
            </div>
          </div>

          <div className="docs-section">
            <div className="docs-section-title">3. How It Works 🔄</div>
            <div className="docs-flow">
              <div className="docs-step"><span className="step-num">1</span> Paste a YouTube link</div>
              <div className="docs-arrow">↓</div>
              <div className="docs-step"><span className="step-num">2</span> System extracts comments</div>
              <div className="docs-arrow">↓</div>
              <div className="docs-step"><span className="step-num">3</span> Cleans &amp; filters data</div>
              <div className="docs-arrow">↓</div>
              <div className="docs-step"><span className="step-num">4</span> AI models analyze sentiment + emotion</div>
              <div className="docs-arrow">↓</div>
              <div className="docs-step"><span className="step-num">5</span> Results shown in dashboard</div>
            </div>
          </div>

          <div className="docs-section">
            <div className="docs-section-title">4. Tech Stack 🛠️</div>
            <div className="docs-stack">
              <div className="docs-stack-item"><span>⚛️</span> React</div>
              <div className="docs-stack-item"><span>⚡</span> FastAPI</div>
              <div className="docs-stack-item"><span>🤖</span> Transformers (BERT)</div>
              <div className="docs-stack-item"><span>▶️</span> YouTube Data API</div>
            </div>
          </div>

          <div className="docs-section">
            <div className="docs-section-title">5. Use Cases 🎯</div>
            <div className="about-checklist">
              <div className="about-check">✔ Business feedback analysis</div>
              <div className="about-check">✔ Product review insights</div>
              <div className="about-check">✔ Market research</div>
              <div className="about-check">✔ Social media monitoring</div>
            </div>
          </div>

          <div className="docs-section">
            <div className="docs-section-title">6. Limitations ⚠️</div>
            <div className="about-checklist">
              <div className="about-check muted">• Works best with English comments</div>
              <div className="about-check muted">• Depends on available YouTube comments</div>
              <div className="about-check muted">• AI predictions may not be 100% perfect</div>
            </div>
          </div>

          <div className="docs-section">
            <div className="docs-section-title">7. Future Improvements 🔮</div>
            <div className="docs-features">
              <span className="docs-feature">🌍 Multi-language support</span>
              <span className="docs-feature">📱 Instagram &amp; Facebook</span>
              <span className="docs-feature">⚡ Real-time analytics</span>
              <span className="docs-feature">📄 Export reports (PDF)</span>
            </div>
          </div>
        </div>
      ),
    },
    privacy: {
      title: "Privacy Policy",
      icon: "🔒",
      body: (
        <div className="privacy-body">
          <div className="privacy-item">
            <span className="privacy-icon">🧠</span>
            <div>
              <strong>In-Memory Processing</strong>
              <p>All comment data is processed entirely in-memory and never written to disk or any database.</p>
            </div>
          </div>
          <div className="privacy-item">
            <span className="privacy-icon">🚫</span>
            <div>
              <strong>No Data Storage</strong>
              <p>We do not store, log, or retain any comment text, video IDs, or personal identifiers on our servers.</p>
            </div>
          </div>
          <div className="privacy-item">
            <span className="privacy-icon">🔐</span>
            <div>
              <strong>API Key Security</strong>
              <p>Your YouTube API key is stored locally in your <code>.env</code> file and is never transmitted to third parties.</p>
            </div>
          </div>
          <div className="privacy-item">
            <span className="privacy-icon">📡</span>
            <div>
              <strong>Network Requests</strong>
              <p>Requests are made only to YouTube's official API and our local FastAPI backend. No external analytics or tracking.</p>
            </div>
          </div>
          <div className="privacy-badge">
            <span className="status-dot"></span> Zero data retained after session ends
          </div>
        </div>
      ),
    },
  };

  const c = content[id] || content.about;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          {c.icon && <span className="modal-icon">{c.icon}</span>}
          <h3>{c.title}</h3>
          <button className="modal-x" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-content">{c.body}</div>
      </div>
    </div>
  );
}

/* ── MAIN APP ─────────────────────────────────────────────────── */
export default function App() {
  const [url, setUrl]         = useState("");
  const [results, setResults] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter]   = useState("Positive");
  const [theme, setTheme]     = useState("light");
  const [modal, setModal]     = useState(null);
  const [videoId, setVideoId] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const extractId = (raw) => {
    try {
      const u = new URL(raw);
      return u.searchParams.get("v") || u.pathname.slice(1) || null;
    } catch { return null; }
  };

  const handleAnalyze = async () => {
    const id = extractId(url);
    if (!id) { alert("Please enter a valid YouTube URL"); return; }
    setVideoId(id);
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video_id: id }),
      });
      const data = await res.json();
      setResults(data.results || []);
      setInsights(data.insights || []);
      setFilter("Positive");
    } catch (err) {
      alert("Backend connection failed.");
    }
    setLoading(false);
  };

  const pos = results.filter((r) => r.sentiment === "Positive").length;
  const neg = results.filter((r) => r.sentiment === "Negative").length;
  const neu = results.filter((r) => r.sentiment === "Neutral").length;
  const total = results.length;

  const filtered = filter === "All" ? results : results.filter((r) => r.sentiment === filter);

  return (
    <div className="app-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="brand-dot">✦</div>
          <span className="brand-name">Insight<em>AI</em></span>
        </div>
        <div className="navbar-links">
          <button className="nav-pill active">Dashboard</button>
          <button className="nav-pill" onClick={() => setModal("docs")}>Docs</button>
          <button className="nav-pill" onClick={() => setModal("about")}>About</button>
          <button className="nav-pill" onClick={() => setModal("privacy")}>Privacy</button>
        </div>
        <div className="navbar-right">
          <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
        </div>
      </nav>

      {/* HERO / SEARCH */}
      <header className="hero">
        <h1>Analyze sentiment <em>instantly</em></h1>
        <p className="hero-sub">Enter a YouTube URL to extract deep emotional insights.</p>
        <div className="search-bar">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          />
          <button className="search-btn" onClick={handleAnalyze} disabled={loading}>
            {loading ? "Processing..." : "Analyze"}
          </button>
        </div>
      </header>

      {/* RESULTS SECTION */}
      {total > 0 && (
        <main className="results">
          <div className="video-strip">
            <div className="yt-icon">▶</div>
            <div className="video-info">
              <span className="video-label">Active Analysis</span>
              <span className="video-id">{videoId}</span>
            </div>
            <div className="video-total">
              <div className="total-num">{total}</div>
              <div className="total-label">Total Comments</div>
            </div>
          </div>

          <div className="kpi-row">
            <div className={`kpi ${filter === 'Positive' ? 'active' : ''}`} onClick={() => setFilter("Positive")}>
              <div className="kpi-label">Positive</div>
              <div className="kpi-val pos">{pos}</div>
            </div>
            <div className={`kpi ${filter === 'Negative' ? 'active' : ''}`} onClick={() => setFilter("Negative")}>
              <div className="kpi-label">Negative</div>
              <div className="kpi-val neg">{neg}</div>
            </div>
            <div className={`kpi ${filter === 'Neutral' ? 'active' : ''}`} onClick={() => setFilter("Neutral")}>
              <div className="kpi-label">Neutral</div>
              <div className="kpi-val neu">{neu}</div>
            </div>
          </div>

          <div className="comments-grid">
            {filtered.map((r, i) => (
              <div key={i} className={`comment-card ${r.sentiment}`}>
                <p>{r.comment}</p>
                <div className="c-footer">
                  <span className="c-tag">{r.topic}</span>
                  <span className="c-conf">{Math.round(r.confidence * 100)}% Match</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="brand-name">Insight<em>AI</em></span>
            <p>Better insights for better content.</p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <a href="#">Features</a>
            <a href="#">API</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <button onClick={() => setModal("about")}>About</button>
            <button onClick={() => setModal("privacy")}>Privacy</button>
          </div>
          <div className="footer-col">
            <h4>Status</h4>
            <div className="status-indicator">
              <span className="status-dot"></span> Systems Online
            </div>
          </div>
        </div>
      </footer>

      {modal && <Modal id={modal} onClose={() => setModal(null)} />}
    </div>
  );
}