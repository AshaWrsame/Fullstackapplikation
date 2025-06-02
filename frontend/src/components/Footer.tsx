import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-section">
        <p><strong>Länkar</strong></p>
        <Link to="/">Hem</Link>
        <Link to="/products">Böcker</Link>
        <Link to="/login">Logga in</Link>
      </div>

      <div className="footer-section">
        <p><strong>Mooney's Book Store</strong></p>
        <p>&copy; 2025 Alla rättigheter förbehållna</p>
      </div>

      <div className="footer-section">
        <p><strong>Kontakt</strong></p>
        <p>Email: info@mooneysbooks.com</p>
        <p>Telefon: 070-123 00 00</p>
      </div>
    </footer>
  )
}

export default Footer
