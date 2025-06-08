import React from 'react'
import './BookDetails.css'

interface Book {
  key: string
  title: string
  author_name?: string[]
  cover_i?: number
  first_publish_year?: number
  language?: string[]
}

interface Props {
  book: Book
  onClose: () => void
  onAddToCart: (book: Book) => void
}

const BookDetails: React.FC<Props> = ({ book, onClose, onAddToCart }) => {
  const imageUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : ''

  return (
    <div className="book-details-overlay">
      <div className="book-details-modal">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="book-details-content">
          {imageUrl ? (
            <img src={imageUrl} alt={book.title} />
          ) : (
            <div className="no-image">Ingen bild</div>
          )}
          <div className="book-info">
            <h2>{book.title}</h2>
            <p><strong>Författare:</strong> {book.author_name?.join(', ') || 'Okänd'}</p>
            <p><strong>Utgivningsår:</strong> {book.first_publish_year || 'Okänt'}</p>
            <p><strong>Språk:</strong> {book.language?.join(', ') || 'Okänt'}</p>
            <button className="add-to-cart" onClick={() => onAddToCart(book)}>
              Lägg i varukorg
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetails
