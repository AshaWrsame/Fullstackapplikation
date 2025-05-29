import express from 'express'
import cors from 'cors'
import authRoutes from './routes/Roles'
import productRoutes from './routes/products'
import { initializeDatabase } from './datab'
import orderRoutes from './routes/orders'


const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/products', productRoutes)
app.use('/orders', orderRoutes);


app.get('/', (req, res) => {
  res.send('Välkommen till e-butiken API!')
})

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(` Servern körs på http://localhost:${PORT}`)
    })
  })
