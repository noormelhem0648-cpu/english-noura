import { useNavigate, useParams } from 'react-router-dom'
import { getDay, COMPONENTS } from '../data/curriculum'

export default function DayPage({ dark, setDark, progress }) {
  const { levelId, dayId } = useParams()
  const navigate = useNavigate()
  const day = getDay(levelId, Number(dayId))

  if (!day) return <div className="page"><p style={{ padding: 32 }}>Day not found.</p></div>

  const dp = progress.dayProgress(levelId, Number(dayId))

  return (
    <div className="page day-page">
      <header className="top-bar">
        <button className="icon-btn" onClick={() => navigate(`/level/${levelId}`)}>←</button>
        <span className="top-bar-title">Day {day.id} — {levelId}</span>
        <button className="icon-btn" onClick={() => setDark(!dark)}>{dark ? '☀️' : '🌙'}</button>
      </header>

      <div className="day-hero">
        <div className="day-hero-num">Day {day.id} / 30</div>
        <h2 className="day-hero-title">{day.title}</h2>
        <p className="day-hero-ar">{day.titleAr}</p>
        <p className="day-hero-sub">{day.subtitle}</p>

        <div className="day-overall-prog">
          <div className="day-overall-bar">
            <div className="day-overall-fill" style={{ width: dp.pct + '%' }} />
          </div>
          <span>{dp.done} / {dp.total} مكونات مكتملة</span>
        </div>
      </div>

      <div className="components-list">
        {COMPONENTS.map(comp => {
          const done = progress.isDone(`${levelId}-${dayId}-${comp.id}`)
          return (
            <button
              key={comp.id}
              className={'comp-card' + (done ? ' comp-done' : '')}
              onClick={() => navigate(`/level/${levelId}/day/${dayId}/${comp.id}`)}
            >
              <div className="comp-icon">{comp.icon}</div>
              <div className="comp-info">
                <div className="comp-label">{comp.label}</div>
                <div className="comp-label-en">{comp.labelEn}</div>
              </div>
              <div className="comp-status">
                {done ? <span className="comp-check">✓</span> : <span className="comp-arrow">›</span>}
              </div>
            </button>
          )
        })}
      </div>

      <div className="day-nav-row">
        {Number(dayId) > 1 && (
          <button className="nav-btn" onClick={() => navigate(`/level/${levelId}/day/${Number(dayId) - 1}`)}>
            ← اليوم {Number(dayId) - 1}
          </button>
        )}
        {Number(dayId) < 30 && (
          <button className="nav-btn primary" onClick={() => navigate(`/level/${levelId}/day/${Number(dayId) + 1}`)}>
            اليوم {Number(dayId) + 1} →
          </button>
        )}
      </div>
    </div>
  )
}
