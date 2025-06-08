import React, { useEffect, useState } from 'react';
import './products.css';
import BookDetails from '../components/BookDetails';

interface Book {
  key: string
  title: string
  author_name?: string[]
  cover_i?: number;
  subject?: string[]
  first_publish_year?: number
  language?: string[]
}

const Products: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [limit, setLimit] = useState(20)
  const [subject, setSubject] = useState('')
  const [year, setYear] = useState('')
  const [language, setLanguage] = useState('')
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  const fetchBooks = async () => {
    try {
      let baseUrl = `https://openlibrary.org/search.json?`
      let params = [`q=programming`]

      if (subject) params.push(`subject=${subject}`)
      if (year) params.push(`first_publish_year=${year}`)
      if (language) params.push(`language=${language}`)

      params.push(`limit=${limit}`)

      const queryUrl = baseUrl + params.join('&')
      const response = await fetch(queryUrl)
      const data = await response.json()
      setBooks(data.docs)
    } catch (error) {
      console.error('Fel vid hämtning av böcker:', error)
    }
  };
const price = Math.floor(Math.random() * 200) + 50
  useEffect(() => {
    fetchBooks()
  }, [limit, subject, year, language])

  const handleAddToCart = (book: Book) => {
    const productId = book.key.replace('/works/', '')
    const imageUrl = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : ''

    const cartItem = {
      product_id: productId,
      title: book.title,
      image_url: imageUrl,
      quantity: 1,
      price,
    }

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const updatedCart = [...existingCart, cartItem]
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    alert('Boken har lagts till i varukorgen!')
  }

  return (
    <div className="products-container">
      <h1>Alla Böcker</h1>

      <div className="filter">
        <label>
          Ämne:
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">Alla</option>
            <option value="fiction">Fiction</option>
            <option value="history">History</option>
            <option value="science">Science</option>
            <option value="technology">Technology</option>
            <option value="biography">Biography</option>
          </select>
        </label>

        <label>
          År:
          <input
            type="number"
            value={year}
            placeholder="Ex: 2020"
            onChange={(e) => setYear(e.target.value)}
          />
        </label>

        <label>
          Språk:
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="">Alla</option>
            <option value="eng">Engelska</option>
            <option value="swe">Svenska</option>
            <option value="ger">Tyska</option>
            <option value="fre">Franska</option>
            <option value="spa">Spanska</option>
          </select>
        </label>
      </div>

      <div className="book-grid">
        {books.map((book) => {
          const imageUrl = book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : '';

          return (
            <div className="book-card" key={book.key} onClick={() => setSelectedBook(book)}>
              {imageUrl ? (
                <img src={imageUrl} alt={book.title} />
              ) : (
                <div className="no-image">Ingen bild</div>
              )}
              <h3>{book.title}</h3>
              <p>{book.author_name?.join(', ')}</p>
            </div>
          );
        })}
      </div>

      <button className="show-more" onClick={() => setLimit(limit + 10)}>
        Visa fler böcker
      </button>

      {selectedBook && (
        <BookDetails
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  )
}

export default Products
