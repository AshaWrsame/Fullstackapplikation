import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Inloggning misslyckades')
        return
      }
// skicka till startsidan
      localStorage.setItem('token', data.token)
      navigate('/')
    } catch (err) {
      console.error(err)
      setError('Något gick fel vid inloggningen')
    }
  }

  return (
    <div className="login-container">
      <h2>Logga in (User/Admin)</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Användarnamn"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Logga in</button>
        {error && <p className="error">{error}</p>}
      </form>

      <p className="register-link">
        Har du inget konto? <a href="/register">Registrera dig här</a>
      </p>
    </div>
  )
}

export default Login
