import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'

const Navbar: React.FC = () => {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null
  const role = decodedToken?.role

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Mooney´s Book Store</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/products">Books</Link>
        {!token && <Link to="/login">Login</Link>}
        {token && (
          <>
            <Link to="/order-history">Orderhistorik</Link>
            <span className="navbar-role">{role}</span>
            {role === 'Admin' && (
              <Link to="/admin-orders">Admin Ordrar</Link>
            )}
            <Link to="/cart">Varukorg</Link>
            <button onClick={handleLogout}>Log out</button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
