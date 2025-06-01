import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './OrderHistory.css'

interface Order {
  order_id: number;
  created_at: string;
  product_id: number;
  quantity: number;
  name: string;
  price: number;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Du är inte inloggad')
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/orders/history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setOrders(response.data.orders)
        console.log("ORDERS:", response.data.orders)
      } catch (err) {
        console.error(err)
        setError('Kunde inte hämta orderhistorik')
      }
    }

    fetchOrders()
  }, [])

  return (
    <div className="order-history-container">
      <h2>Orderhistorik</h2>
      {error && <p className="error">{error}</p>}
      {orders.length === 0 && !error ? (
        <p>Du har inga tidigare ordrar.</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Produkt</th>
              <th>Antal</th>
              <th>Pris</th>
              <th>Datum</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.order_id}</td>
                <td>{order.name}</td>
                <td>{order.quantity}</td>
                <td>{order.price} kr</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistory
