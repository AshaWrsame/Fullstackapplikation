import React, { useEffect, useState } from 'react'
import './products.css'

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
}

const Products: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [limit, setLimit] = useState(20)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`https://openlibrary.org/search.json?q=programming&limit=${limit}`)
        const data = await response.json()
        setBooks(data.docs)
      } catch (error) {
        console.error('Fel vid hämtning av böcker:', error)
      }
    }

    fetchBooks()
  }, [limit])

  const handleBuy = async (book: Book) => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Du måste vara inloggad för att köpa.')
      return
    }

    const productId = book.key.replace('/works/', '')
    const imageUrl = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : '';

    try {
      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: [
            {
              product_id: productId,
              title: book.title,
              image_url: imageUrl,
              quantity: 1,
            },
          ],
        }),
      });

      const data = await response.json()
      if (response.ok) {
        alert('Boken har köpts!')
      } else {
        alert(data.error || 'Något gick fel.')
      }
    } catch (err) {
      console.error(err)
      alert('Något gick fel vid köpet.')
    }
  }

  return (
    <div className="products-container">
      <h1>Alla Böcker</h1>
      <div className="book-grid">
        {books.map((book) => {
          const imageUrl = book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : '';

          return (
            <div className="book-card" key={book.key}>
              {imageUrl ? (
                <img src={imageUrl} alt={book.title} />
              ) : (
                <div className="no-image">Ingen bild</div>
              )}
              <h3>{book.title}</h3>
              <p>{book.author_name?.join(', ')}</p>
              <button onClick={() => handleBuy(book)}>Buy</button>
            </div>
          );
        })}
      </div>
      <button className="show-more" onClick={() => setLimit(limit + 10)}>
        Visa fler böcker
      </button>
    </div>
  );
};

export default Products
