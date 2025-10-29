import { useEffect, useState } from 'react'

export default function App() {
  const [msg, setMsg] = useState('Loading...')

  useEffect(() => {
    fetch('/api/hello')
      .then(r => r.json())
      .then(d => setMsg(d.message))
      .catch(() => setMsg('API error'))
  }, [])

  return (
    <main style={{padding: 24}}>
      <h1>Flask + Vite + React</h1>
      <p>{msg}</p>
    </main>
  )
}
