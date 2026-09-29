import { useEffect, useState } from 'react'

function App() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage('Error fetching data'))
  }, [])

  return (
    <div>
      <h1>Project 1 Client (React + TS)</h1>
      <p id="message">{message}</p>
    </div>
  )
}

export default App
