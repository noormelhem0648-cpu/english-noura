import { useNavigate, useParams } from 'react-router-dom'
import { ALL_DAYS, LEVELS, COMPONENTS } from '../data/curriculum'

export default function DaysPage({ dark, setDark, progress }) {
  const { levelId } = useParams()
  const navigate = useNavigate()
  const level = LEVELS.find(l => l.id === levelId)
  const days = levelId === 'A1' ? ALL_DAYS : []

  if (!level) return <div className="page"><p style={{ padding: 32 }}>Level not found.</p></div>

  return (
    <div className="page days-page">
      <header className="top-bar">
        <button className="icon-btn" onClick={() => navigate('/')}>←</button>
        <span className="top-bar-title">{level.name}</span>
        <button className="icon-btn" onClick={() => setDark(!dark)}>{dark ? '☀️' : '🌙'}</button>
      </header>

      <div className="days-hero">
        <div className="days-hero-badge">{levelId}</div>
        <h2 className="days-hero-title">{level.description}</h2>
        <div className="days-legend">
          {COMPONENTS.map(c => (
            <span key={c.id} className="legend-pill">{c.icon} {c.labelEn}</span>
          ))}
        </div>
      </div>

      <div className="days-grid">
        {days.map(day => {
          const dp = progress.dayProgress(levelId, day.id)
          const allDone = dp.done === dp.total
          const started = dp.done > 0
          return (
            <button
              key={day.id}
              className={'day-card' + (allDone ? ' done' : started ? ' started' : '')}
              onClick={() => navigate(`/level/${levelId}/day/${day.id}`)}
            >
              <div className="day-num">Day {day.id}</div>
              <div className="day-title">{day.title}</div>
              <div className="day-title-ar">{day.titleAr}</div>
              <div className="day-prog-row">
                <div className="day-prog-bar">
                  <div className="day-prog-fill" style={{ width: dp.pct + '%' }} />
                </div>
                <span className="day-prog-txt">{dp.done}/{dp.total}</span>
              </div>
              {allDone && <div className="day-done-badge">✓</div>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
