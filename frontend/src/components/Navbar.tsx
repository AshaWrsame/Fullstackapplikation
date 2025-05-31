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
        <Link to="/">Bokbutiken</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Hem</Link>
        <Link to="/products">Böcker</Link>
        {!token && <Link to="/login">Logga in</Link>}
        {token && (
          <>
            <span className="navbar-role"> {role}</span>
            <button onClick={handleLogout}>Logga ut</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar
