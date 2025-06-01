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

      <section className="how-it-works">
        <h3>Så fungerar det</h3>
        <ol>
          <li>Skapa ett konto eller logga in.</li>
          <li>Bläddra bland våra böcker och välj att hyra eller köpa.</li>
          <li>Slutför din beställning och vänta på leverans.</li>
        </ol>
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


    </div>
  )
}

export default Home
