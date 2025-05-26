const express = require('express')
const app = express()
const PORT = 3000
app.use(express.json())

app.get('/', (req, res) => {
    res.send({message:'Hej'})
})

app.listen(PORT, () => {
  console.log(`Redo på http://localhost:${PORT}`)
})
