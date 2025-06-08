import express from 'express'
import { getDbConnection } from '../datab'
import { authenticateToken } from '../middleware/authorization'

const router = express.Router()

router.post('/', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { items } = req.body
    const userId = req.user?.userId

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Inga produkter angivna' })
      return
    }

    const db = await getDbConnection()
    const result = await db.run(`INSERT INTO orders (user_id) VALUES (?)`, userId)
    const orderId = result.lastID

    for (const item of items) {
      const { product_id, title, image_url, quantity, price } = item

      const product = await db.get('SELECT * FROM products WHERE id = ?', product_id)

      if (!product) {
        await db.run(
          `INSERT INTO products (id, name, description, price, image_url, category_id)
           VALUES (?, ?, ?, ?, ?, ?)`,
          product_id,
          title,
          'Ingen beskrivning',
          price || 100,
          image_url,
          1
        )
      }

      await db.run(
        `INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)`,
        orderId,
        product_id,
        quantity
      )
    }

    res.status(201).json({ message: 'Order skapad', orderId })
  } catch (error) {
    console.error('Fel vid order:', error);
    res.status(500).json({ error: 'Serverfel ' })
  }
});

router.get('/history', authenticateToken, async (req, res): Promise<void> => {
  try {
    const userId = req.user?.userId
    const db = await getDbConnection()

    const orders = await db.all(
      `SELECT o.id as order_id, o.created_at, oi.product_id, oi.quantity, p.name, p.price
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON p.id = oi.product_id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      userId
    )

    res.json({ orders })
  } catch (error) {
    console.error('Fel vid hämtning av orderhistorik:', error)
    res.status(500).json({ error: 'Serverfel vid hämtning av orderhistorik' })
  }
})

router.get('/admin', authenticateToken, async (req, res): Promise<void> => {
  const userRole = req.user?.role;
  if (userRole !== 'Admin') {
    res.status(403).json({ error: 'Endast administratörer ' })
    return
  }

  try {
    const db = await getDbConnection()
    const orders = await db.all(`
      SELECT o.id AS order_id, o.created_at, u.username, oi.product_id, oi.quantity, p.name AS title, p.price
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      ORDER BY o.created_at DESC
    `)

    res.json({ orders })
  } catch (error) {
    console.error('Fel vid hämtning av ordrar:', error)
    res.status(500).json({ error: 'Serverfel' });
  }
})

router.put('/:order_id', authenticateToken, async (req, res): Promise<void> => {
  const userRole = req.user?.role
  if (userRole !== 'Admin') {
    res.status(403).json({ error: 'Endast administratörer har behörighet.' })
    return
  }

  const { order_id } = req.params
  const { title, quantity, price } = req.body

  if (!title || !quantity || !price) {
    res.status(400).json({ error: 'kräv.' })
    return;
  }

  try {
    const db = await getDbConnection()

    await db.run(
      `UPDATE products SET name = ?, price = ? WHERE id = (SELECT product_id FROM order_items WHERE order_id = ?)`,
      title,
      price,
      order_id
    )

    await db.run(`UPDATE order_items SET quantity = ? WHERE order_id = ?`, quantity, order_id)

    res.json({ message: 'Order uppdaterad.' })
  } catch (error) {
    console.error('Fel vid uppdatering:', error)
    res.status(500).json({ error: 'Serverfel vid uppdatering av order.' })
  }
})

router.delete('/:order_id', authenticateToken, async (req, res): Promise<void> => {
  const userRole = req.user?.role
  if (userRole !== 'Admin') {
    res.status(403).json({ error: 'Endast administratörer har behörighet.' })
    return
  }

  const { order_id } = req.params

  try {
    const db = await getDbConnection()

    await db.run(`DELETE FROM order_items WHERE order_id = ?`, order_id)

    await db.run(`DELETE FROM orders WHERE id = ?`, order_id)

    res.json({ message: `Order ${order_id} har raderats.` })
  } catch (error) {
    console.error('Fel vid borttagning av order:', error)
    res.status(500).json({ error: 'Serverfel vid borttagning av order.' })
  }
})


export default router
