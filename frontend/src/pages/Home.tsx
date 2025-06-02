import React from 'react'
import './home.css'

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <img src="/images/mooneys.avif" alt="Mooney's bokhandel" className="hero-image" />
      </div>

      <section className="featured-section">
        <h3>Utvalda Böcker</h3>
        <div className="book-grid">
          <div className="book-card">
            <img src="/images/The Great Gatsby.jpg" alt="The Great Gatsby" />
            <p>The Great Gatsby</p>
          </div>
          <div className="book-card">
            <img src="/images/To Kill a Mockingbird.jpg" alt="To Kill a Mockingbird" />
            <p>To Kill a Mockingbird</p>
          </div>
          <div className="book-card">
            <img src="/images/1984.jpg" alt="1984" />
            <p>1984 by George Orwell</p>
          </div>
          <div className="book-card">
            <img src="/images/Pride and Prejudice.jpg" alt="Pride and Prejudice" />
            <p>Pride and Prejudice</p>
          </div>
        </div>
      </section>

      <section className="services-section">
        <h3>Vad du kan göra</h3>
        <div className="services-grid">
          <div className="service-card">📚 Hyr böcker snabbt och smidigt</div>
          <div className="service-card">🛒 Köp dina favoritböcker för alltid</div>
          <div className="service-card">📦 Snabb leverans hem till dig</div>
        </div>
      </section>

      <section className="owner-section">
        <h3>Meet the Owner </h3>
        <div className="owner-content">
          <img src="/images/Joe.webp" alt="Joe - ägare" className="owner-image" />
          <div className="owner-text">
            <p>
              Joe är inte bara bokhandlare – han är en passionerad biblioteksälskare med en djup förståelse för människors läshunger.
              Med en bakgrund som sträcker sig från klassisk litteratur till moderna thrillers, har han en nästan skrämmande känsla
              för att veta exakt vilken bok du behöver... ibland innan du själv vet det.
            </p>
            <p>
              Han tror att varje bok har en själ, och varje läsare förtjänar att hitta sin perfekta match. Välkommen till hans värld –
              där varje sida betyder något.
            </p>
          </div>
        </div>
      </section>

      <section className="reviews">
        <h3>Kundrecensioner</h3>
        <div className="review-card">
          <p>⭐️⭐️⭐️⭐️⭐️ "Fantastisk service och stort bokutbud!" – Anna K.</p>
        </div>
        <div className="review-card">
          <p>⭐️⭐️⭐️⭐️ "Jag älskar möjligheten att hyra böcker billigt." – Erik L.</p>
        </div>
      </section>

      <section className="newsletter-section">
        <h3>Prenumerera på vårt nyhetsbrev</h3>
        <p>Få exklusiva boktips och kampanjer direkt till din inkorg.</p>
        <div className="newsletter-form">
          <input type="email" placeholder="Din e-postadress" />
          <button>Registrera dig</button>
        </div>
      </section>
    </div>
  )
}

export default Home
