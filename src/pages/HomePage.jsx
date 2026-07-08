import { useNavigate } from 'react-router-dom'
import { LEVELS } from '../data/curriculum'

export default function HomePage({ dark, setDark, progress }) {
  const navigate = useNavigate()

  return (
    <div className="page home-page">
      <header className="top-bar">
        <div className="top-bar-brand">
          <span className="brand-dot" />
          <span className="brand-name">English with Noura</span>
        </div>
        <button className="icon-btn" onClick={() => setDark(!dark)} title="Toggle theme">
          {dark ? '☀️' : '🌙'}
        </button>
      </header>

      <main className="home-main">
        <div className="hero-block">
          <div className="hero-badge">🎓 مجاناً تماماً</div>
          <h1 className="hero-title">
            تعلّم الإنجليزية<br />
            <span className="hero-accent">خطوة بخطوة</span>
          </h1>
          <p className="hero-sub">
            من الصفر المطلق إلى الطلاقة — 6 مستويات × 30 يوماً × 6 مهارات يومياً
          </p>
        </div>

        <div className="levels-grid">
          {LEVELS.map(lvl => {
            const lp = progress.levelProgress(lvl.id, lvl.totalDays)
            return (
              <button
                key={lvl.id}
                className={'level-card' + (lvl.available ? '' : ' locked')}
                onClick={() => lvl.available && navigate(`/level/${lvl.id}`)}
                disabled={!lvl.available}
              >
                <div className="level-badge">{lvl.id}</div>
                <div className="level-info">
                  <div className="level-name">{lvl.name}</div>
                  <div className="level-name-ar">{lvl.nameAr}</div>
                  <div className="level-desc">{lvl.description}</div>
                </div>
                {lvl.available ? (
                  <div className="level-progress-wrap">
                    <div className="level-prog-bar">
                      <div className="level-prog-fill" style={{ width: lp.pct + '%' }} />
                    </div>
                    <span className="level-prog-pct">{lp.pct}%</span>
                  </div>
                ) : (
                  <div className="level-lock">🔒 قريباً</div>
                )}
              </button>
            )
          })}
        </div>

        <div className="how-it-works">
          <h2 className="section-title">كيف يعمل النظام؟</h2>
          <div className="how-grid">
            {[
              { icon: '🔤', title: 'مفردات + نطق', desc: 'كل يوم 6 كلمات مع IPA ودليل النطق العربي' },
              { icon: '📐', title: 'قواعد تفاعلية', desc: 'شرح بالعربية + تمارين تصحّح فيها بنفسك' },
              { icon: '📖', title: 'قراءة مفككة', desc: 'نص قصير مع تحليل كلمة بكلمة وترجمة' },
              { icon: '🎧', title: 'استماع وإملاء', desc: 'حوارات واقعية مع تمارين فراغات تفاعلية' },
              { icon: '🎙️', title: 'شادونج YouTube', desc: 'تقنية الشادونج مع فيديو حقيقي للتدريب' },
              { icon: '✍️', title: 'كتابة + AI رفيق', desc: 'تحديات كتابة + محادثة حية مع AI مخصص' },
            ].map(h => (
              <div key={h.icon} className="how-card">
                <div className="how-icon">{h.icon}</div>
                <div className="how-title">{h.title}</div>
                <div className="how-desc">{h.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
