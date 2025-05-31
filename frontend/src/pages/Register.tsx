import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Register.css'

const Register = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registrering misslyckades')
        return
      }

      setMessage('Registrering lyckades! Du kan nu logga in.')
      setError('');
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      console.error('Register error:', error)
      setError('Något gick fel. Försök igen.')
    }
  }

  return (
    <div className="auth-container">
      <h2>Registrera</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Användarnamn"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Skapa konto</button>
      </form>
    </div>
  );
};

export default Register
