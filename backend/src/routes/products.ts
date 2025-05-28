import express from 'express'
import { getDbConnection } from '../db'
import { authenticateToken, requireAdmin } from '../middleware/authorization'

const router = express.Router()

router.get('/', async (req, res) => {
  const db = await getDbConnection()
  const products = await db.all('SELECT * FROM products')
  res.json(products)
})

router.get('/:id', async (req, res) => {
  const db = await getDbConnection()
  const product = await db.get('SELECT * FROM products WHERE id = ?', req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404).json({ error: 'Produkten hittades inte' })
  }
})

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const { name, description, price, image_url, category_id } = req.body

  if (!name || !price) {
    res.status(400).json({ error: 'Namn och pris krävs' })
    return
  }

  const db = await getDbConnection()
  const result = await db.run(
    `INSERT INTO products (name, description, price, image_url, category_id)
     VALUES (?, ?, ?, ?, ?)`,
    name, description, price, image_url, category_id
  )

  const newProduct = await db.get('SELECT * FROM products WHERE id = ?', result.lastID)
  res.status(201).json(newProduct)
})

router.post('/admin-only', authenticateToken, requireAdmin, (req, res) => {
  res.json({ message: 'Endast admin kan se detta' })
})

export default router
