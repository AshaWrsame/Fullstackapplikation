import React, { useEffect, useState } from 'react';
import './Cart.css';

interface CartItem {
  product_id: string;
  title: string;
  image_url: string;
  quantity: number;
  price: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<CartItem>({
    product_id: '',
    title: '',
    image_url: '',
    quantity: 1,
    price: 0,
  });

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }

    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setIsAdmin(decoded.role === 'Admin');
    }
  }, []);

  const updateLocalStorage = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const removeItem = (product_id: string) => {
    const updated = cartItems.filter(item => item.product_id !== product_id);
    updateLocalStorage(updated);
  };

  const changeQuantity = (product_id: string, delta: number) => {
    const updated = cartItems.map(item => {
      if (item.product_id === product_id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    updateLocalStorage(updated);
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Du måste vara inloggad för att beställa.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: cartItems }),
      });

      if (response.ok) {
        alert('Din beställning har genomförts!');
        localStorage.removeItem('cart');
        setCartItems([]);
      } else {
        const data = await response.json();
        alert(data.error || 'Kunde inte slutföra beställningen.');
      }
    } catch (error) {
      console.error('Fel vid beställning:', error);
      alert('Ett fel uppstod vid beställning.');
    }
  };

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setEditForm(cartItems[index]);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: name === 'price' || name === 'quantity' ? +value : value });
  };

  const handleEditSave = () => {
    if (editingIndex !== null) {
      const updated = [...cartItems];
      updated[editingIndex] = editForm;
      updateLocalStorage(updated);
      setEditingIndex(null);
    }
  };

  return (
    <div className="cart-container">
      <h2>Varukorg</h2>
      {cartItems.length === 0 ? (
        <p>Din varukorg är tom.</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Bild</th>
                <th>Titel</th>
                <th>Pris</th>
                <th>Antal</th>
                <th>Totalt</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={item.product_id}>
                  <td><img src={item.image_url} alt={item.title} className="cart-image" /></td>
                  <td>{item.title}</td>
                  <td>{item.price} kr</td>
                  <td>
                    <button onClick={() => changeQuantity(item.product_id, -1)}>-</button>
                    {item.quantity}
                    <button onClick={() => changeQuantity(item.product_id, 1)}>+</button>
                  </td>
                  <td>{item.price * item.quantity} kr</td>
                  <td><button onClick={() => removeItem(item.product_id)}>Ta bort</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-total">Totalt att betala: {totalPrice} kr</div>

          <div className="payment-method">
            <h3>Välj betalningsmetod:</h3>
            <label><input type="radio" name="payment" value="card" onChange={(e) => setPaymentMethod(e.target.value)} /> Kort</label>
            <label><input type="radio" name="payment" value="swish" onChange={(e) => setPaymentMethod(e.target.value)} /> Swish</label>
            <label><input type="radio" name="payment" value="invoice" onChange={(e) => setPaymentMethod(e.target.value)} /> Faktura</label>
          </div>

          <button className="checkout-button" onClick={handleOrder}>Beställ</button>

          {isAdmin && (
            <div className="admin-editor">
              <h3>Redigera beställning (Admin)</h3>
              {editingIndex !== null && (
                <div className="edit-form">
                  <input name="title" value={editForm.title} onChange={handleEditChange} placeholder="Titel" />
                  <input name="price" type="number" value={editForm.price} onChange={handleEditChange} placeholder="Pris" />
                  <input name="quantity" type="number" value={editForm.quantity} onChange={handleEditChange} placeholder="Antal" />
                  <button onClick={handleEditSave}>Spara</button>
                </div>
              )}
              <ul>
                {cartItems.map((item, index) => (
                  <li key={index}>
                    {item.title} <button onClick={() => handleEditClick(index)}>Redigera</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
