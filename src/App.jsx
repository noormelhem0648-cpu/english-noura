import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { useProgress } from './hooks/useProgress'
import HomePage from './pages/HomePage'
import DaysPage from './pages/DaysPage'
import DayPage from './pages/DayPage'
import ComponentPage from './pages/ComponentPage'
import ChatPage from './pages/ChatPage'

export default function App() {
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const progress = useProgress()

  return (
    <div className={dark ? 'app dark' : 'app'}>
      <Routes>
        <Route path="/" element={<HomePage dark={dark} setDark={setDark} progress={progress} />} />
        <Route path="/level/:levelId" element={<DaysPage dark={dark} setDark={setDark} progress={progress} />} />
        <Route path="/level/:levelId/day/:dayId" element={<DayPage dark={dark} setDark={setDark} progress={progress} />} />
        <Route path="/level/:levelId/day/:dayId/:componentId" element={<ComponentPage dark={dark} setDark={setDark} progress={progress} />} />
        <Route path="/level/:levelId/day/:dayId/chat" element={<ChatPage dark={dark} setDark={setDark} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
