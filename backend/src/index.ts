import express from 'express'
import cors from 'cors'
import productsRouter from './routes/products'

const app = express()
const PORT = 3000

app.use(cors());
app.use(express.json())
app.use('/products', productsRouter)

app.get('/', (req, res) => {
  res.send('Välkommen till API:et!')
})

app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`)
})
