import React, { useEffect, useState } from 'react'
import './cart.css'

interface CartItem {
  product_id: string;
  title: string;
  image_url: string;
  quantity: number;
}

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [payment, setPayment] = useState('kort')

  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      setCart(JSON.parse(storedCart))
    }
  }, [])

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  };

  const increaseQuantity = (index: number) => {
    const updated = [...cart]
    updated[index].quantity += 1
    updateCart(updated);
  }

  const decreaseQuantity = (index: number) => {
    const updated = [...cart]
    if (updated[index].quantity > 1) {
      updated[index].quantity -= 1
      updateCart(updated)
    }
  }

  const removeItem = (index: number) => {
    const updated = cart.filter((_, i) => i !== index)
    updateCart(updated)
  }

  const handleCheckout = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Du måste vara inloggad för att beställa.')
      return
    }

    try {
      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: cart }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Beställning lyckades med ${payment}!`)
        localStorage.removeItem('cart');
        setCart([])
      } else {
        alert(data.error || 'Något gick fel vid beställning.')
      }
    } catch (err) {
      console.error(err)
      alert('Kunde inte slutföra beställningen.')
    }
  };

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="cart-container">
      <h2 className="cart-title">Din varukorg</h2>

      {cart.length === 0 ? (
        <p>Din varukorg är tom.</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div className="cart-item" key={index}>
              <img src={item.image_url} alt={item.title} />
              <div className="cart-details">
                <h3>{item.title}</h3>
                <p>Antal: {item.quantity}</p>
              </div>
              <div className="cart-actions">
                <button onClick={() => increaseQuantity(index)}>+</button>
                <button onClick={() => decreaseQuantity(index)}>-</button>
                <button className="remove" onClick={() => removeItem(index)}>Ta bort</button>
              </div>
            </div>
          ))}

          <div className="cart-summary">Totalt antal böcker: {totalQuantity}</div>

          <div className="payment-options">
            <strong>Välj betalningsmetod:</strong>
            <label>
              <input
                type="radio"
                name="payment"
                value="kort"
                checked={payment === 'kort'}
                onChange={(e) => setPayment(e.target.value)}
              />
              Kort
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="swish"
                onChange={(e) => setPayment(e.target.value)}
              />
              Swish
            </label>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            Slutför beställning
          </button>
        </>
      )}
    </div>
  )
}

export default Cart
