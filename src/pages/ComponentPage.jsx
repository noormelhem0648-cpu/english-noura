import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { getDay, COMPONENTS } from '../data/curriculum'

export default function ComponentPage({ dark, setDark, progress }) {
  const { levelId, dayId, componentId } = useParams()
  const navigate = useNavigate()
  const day = getDay(levelId, Number(dayId))
  const compIndex = COMPONENTS.findIndex(c => c.id === componentId)
  const comp = COMPONENTS[compIndex]

  if (!day || !comp) return <div className="page"><p style={{ padding: 32 }}>Not found.</p></div>

  const progressKey = `${levelId}-${dayId}-${componentId}`
  const done = progress.isDone(progressKey)

  const handleDone = () => {
    progress.markDone(progressKey)
    const next = COMPONENTS[compIndex + 1]
    if (next) navigate(`/level/${levelId}/day/${dayId}/${next.id}`)
    else navigate(`/level/${levelId}/day/${dayId}`)
  }

  return (
    <div className="page comp-page">
      <header className="top-bar">
        <button className="icon-btn" onClick={() => navigate(`/level/${levelId}/day/${dayId}`)}>←</button>
        <span className="top-bar-title">{comp.icon} {comp.labelEn}</span>
        <button className="icon-btn" onClick={() => setDark(!dark)}>{dark ? '☀️' : '🌙'}</button>
      </header>

      <div className="comp-progress-strip">
        {COMPONENTS.map((c, i) => (
          <div
            key={c.id}
            className={'strip-dot' + (i === compIndex ? ' active' : progress.isDone(`${levelId}-${dayId}-${c.id}`) ? ' done' : '')}
            onClick={() => navigate(`/level/${levelId}/day/${dayId}/${c.id}`)}
            title={c.labelEn}
          />
        ))}
      </div>

      <div className="comp-body">
        {componentId === 'vocab'     && <VocabComp day={day} />}
        {componentId === 'grammar'   && <GrammarComp day={day} />}
        {componentId === 'reading'   && <ReadingComp day={day} />}
        {componentId === 'listening' && <ListeningComp day={day} />}
        {componentId === 'shadowing' && <ShadowingComp day={day} />}
        {componentId === 'writing'   && <WritingComp day={day} levelId={levelId} dayId={dayId} navigate={navigate} />}
      </div>

      <div className="comp-footer">
        {compIndex > 0 && (
          <button className="nav-btn" onClick={() => navigate(`/level/${levelId}/day/${dayId}/${COMPONENTS[compIndex - 1].id}`)}>
            ← السابق
          </button>
        )}
        <button className={'nav-btn primary' + (done ? ' already-done' : '')} onClick={handleDone}>
          {done ? '✓ مكتمل' : compIndex < COMPONENTS.length - 1 ? 'أكملت ← التالي' : 'أكملت اليوم ✓'}
        </button>
      </div>
    </div>
  )
}

/* ─── Component A: Vocabulary ─────────────────────────────── */
function VocabComp({ day }) {
  const [revealed, setRevealed] = useState({})
  const { vocabulary: v } = day

  return (
    <div className="section">
      <div className="section-intro">{v.intro}</div>

      <div className="vocab-table-wrap">
        <table className="vocab-table">
          <thead>
            <tr>
              <th>الكلمة</th>
              <th>IPA</th>
              <th>المعنى</th>
              <th>النطق بالعربي</th>
              <th>مثال</th>
              <th>الترجمة</th>
            </tr>
          </thead>
          <tbody>
            {v.words.map((w, i) => (
              <tr key={i}>
                <td><strong className="word-highlight">{w.word}</strong></td>
                <td><span className="ipa">{w.ipa}</span></td>
                <td>{w.arabic}</td>
                <td><span className="phonetic">{w.phonetic}</span></td>
                <td><em>{w.example}</em></td>
                <td className="text-muted">{w.exampleAr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="challenge-box">
        <div className="challenge-title">🎙️ تحدي المحاكاة الصوتية السريعة</div>
        <p className="challenge-desc">كرر هذه الكلمات بصوت عالٍ 3 مرات خلف المعلم:</p>
        <div className="mimic-words">
          {v.mimicChallenge.map((w, i) => (
            <span key={i} className="mimic-word">{w}</span>
          ))}
        </div>
        <div className="mimic-tip">💡 {v.mimicTip}</div>
      </div>
    </div>
  )
}

/* ─── Component B: Grammar ────────────────────────────────── */
function GrammarComp({ day }) {
  const [shown, setShown] = useState({})
  const { grammar: g } = day

  return (
    <div className="section">
      {g.patterns.map((p, pi) => (
        <div key={pi} className="grammar-block">
          <h3 className="grammar-name">{p.name}</h3>
          <div className="grammar-explain">{p.explanation}</div>

          <div className="formula-box">
            <span className="formula-label">الصيغة:</span>
            <code className="formula">{p.formula}</code>
          </div>

          <div className="examples-list">
            {p.examples.map((ex, i) => (
              <div key={i} className="example-item">✦ {ex}</div>
            ))}
          </div>

          <div className="exercises-title">📝 تمارين — صحّح بنفسك</div>
          {p.exercises.map((ex, i) => (
            <div key={i} className="exercise-card">
              <div className="exercise-q">❓ {ex.question}</div>
              <button
                className={'reveal-btn' + (shown[`${pi}-${i}`] ? ' revealed' : '')}
                onClick={() => setShown(s => ({ ...s, [`${pi}-${i}`]: !s[`${pi}-${i}`] }))}
              >
                {shown[`${pi}-${i}`] ? '🙈 إخفاء' : '👁️ الإجابة'}
              </button>
              {shown[`${pi}-${i}`] && (
                <div className="exercise-ans">✅ {ex.answer}</div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/* ─── Component C: Reading ────────────────────────────────── */
function ReadingComp({ day }) {
  const [activeIdx, setActiveIdx] = useState(null)
  const { reading: r } = day

  return (
    <div className="section">
      <div className="reading-passage">{r.passage}</div>

      <div className="breakdown-title">📖 تفكيك سطر بسطر</div>
      <div className="breakdown-list">
        {r.breakdown.map((b, i) => (
          <div key={i} className={'breakdown-item' + (activeIdx === i ? ' open' : '')}>
            <button className="breakdown-sentence" onClick={() => setActiveIdx(activeIdx === i ? null : i)}>
              <span>{b.sentence}</span>
              <span className="expand-icon">{activeIdx === i ? '▲' : '▼'}</span>
            </button>
            {activeIdx === i && (
              <div className="breakdown-detail">
                <div className="word-chips">
                  {b.words.map((w, wi) => (
                    <span key={wi} className="word-chip">
                      <span className="chip-en">{w.w}</span>
                      <span className="chip-ar">{w.ar}</span>
                    </span>
                  ))}
                </div>
                <div className="breakdown-meaning">💬 {b.meaning}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Component D: Listening ──────────────────────────────── */
function ListeningComp({ day }) {
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)
  const { listening: l } = day

  const parts = l.fillText.split('_____')

  const check = () => setChecked(true)
  const reset = () => { setAnswers({}); setChecked(false) }

  return (
    <div className="section">
      <div className="listening-context">🎬 السياق: {l.context}</div>

      <div className="full-text-box">
        <div className="full-text-label">النص الكامل:</div>
        <div className="full-text">{l.text}</div>
      </div>

      <div className="dictation-title">✏️ امْلأ الفراغات</div>
      <div className="fill-blanks">
        {parts.map((part, i) => (
          <span key={i}>
            <span>{part}</span>
            {i < l.blanks.length && (
              <span className="blank-wrap">
                <input
                  className={'blank-input' + (checked
                    ? answers[i]?.toLowerCase().trim() === l.blanks[i].blank.toLowerCase()
                      ? ' correct' : ' wrong'
                    : '')}
                  value={answers[i] || ''}
                  onChange={e => setAnswers(a => ({ ...a, [i]: e.target.value }))}
                  disabled={checked}
                  placeholder="___"
                />
                {checked && (
                  <span className="blank-correct">({l.blanks[i].blank})</span>
                )}
              </span>
            )}
          </span>
        ))}
      </div>

      <div className="dictation-btns">
        {!checked
          ? <button className="nav-btn primary" onClick={check}>تحقق من الإجابات</button>
          : <button className="nav-btn" onClick={reset}>حاول مرة ثانية</button>
        }
      </div>
    </div>
  )
}

/* ─── Component E: Shadowing ──────────────────────────────── */
function ShadowingComp({ day }) {
  const { shadowing: s } = day

  return (
    <div className="section">
      <div className="shadowing-chunk-box">
        <div className="chunk-label">القالب اللغوي اليوم</div>
        <div className="chunk-text">"{s.chunk}"</div>
        <div className="chunk-native">
          <span className="native-label">النطق الأصيل:</span>
          <span className="native-form">{s.nativeForm}</span>
        </div>
      </div>

      <div className="shadowing-explain">{s.explanation}</div>

      <div className="steps-title">🎯 روتين الشادونج — 3 خطوات</div>
      <div className="steps-list">
        {s.steps.map((step, i) => (
          <div key={i} className="step-item">
            <div className="step-num">{i + 1}</div>
            <div className="step-text">{step}</div>
          </div>
        ))}
      </div>

      <a
        href={s.youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="yt-btn"
      >
        ▶ افتح YouTube للتدريب
      </a>
    </div>
  )
}

/* ─── Component F: Writing & AI Chat ─────────────────────── */
function WritingComp({ day, levelId, dayId, navigate }) {
  const [responses, setResponses] = useState({})
  const [copied, setCopied] = useState(false)
  const { writing: w } = day

  const copyPrompt = () => {
    navigator.clipboard.writeText(w.companionPrompt).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="section">
      <div className="writing-title">✍️ تحديات الكتابة</div>
      {w.challenges.map((ch, i) => (
        <div key={i} className="writing-challenge">
          <div className="challenge-q">{i + 1}. {ch}</div>
          <textarea
            className="writing-area"
            placeholder="اكتب إجابتك هنا بالإنجليزية..."
            value={responses[i] || ''}
            onChange={e => setResponses(r => ({ ...r, [i]: e.target.value }))}
            rows={4}
          />
        </div>
      ))}

      <div className="companion-section">
        <div className="companion-title">🤖 رفيق المحادثة الحية</div>
        <p className="companion-desc">
          انسخ هذا البرومبت، افتح المحادثة مع Noura AI، والصقه لتبدأ محادثة حية مخصصة لدرس اليوم.
        </p>
        <div className="prompt-preview">
          <pre className="prompt-text">{w.companionPrompt}</pre>
        </div>
        <div className="companion-btns">
          <button className="nav-btn" onClick={copyPrompt}>
            {copied ? '✓ تم النسخ' : '📋 انسخ البرومبت'}
          </button>
          <button className="nav-btn primary" onClick={() => navigate(`/level/${levelId}/day/${dayId}/chat`)}>
            💬 افتح المحادثة الحية
          </button>
        </div>
      </div>
    </div>
  )
}
