import express from 'express'
import cors from 'cors'
import authRoutes from './routes/Roles'
import productRoutes from './routes/products'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/api/products', productRoutes)

app.get('/', (req, res) => {
  res.send('Välkommen till e-butiken API!');
})

app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`)
})
