import express from 'express'
import { getDbConnection } from '../datab'
import { authenticateToken } from '../middleware/authorization'

const router = express.Router()

router.post('/', authenticateToken, async (req, res): Promise<void> => {
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
    const { product_id, title, image_url, quantity } = item

    let product = await db.get('SELECT * FROM products WHERE id = ?', product_id)

    if (!product) {
      await db.run(
        `INSERT INTO products (id, name, description, price, image_url, category_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        product_id,
        title,
        'Ingen beskrivning',
        100,
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
})

router.get('/history', authenticateToken, async (req, res): Promise<void> => {
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
})

export default router
