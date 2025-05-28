import express, { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { getDbConnection } from '../db'

const router = express.Router()
const JWT_SECRET = 'din-hemliga-nyckel'

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, role = 'user'  } = req.body
    if (!username || !password) {
      res.status(400).json({ error: 'Användarnamn och lösenord krävs' })
      return
    }

    const db = await getDbConnection()
    const existingUser = await db.get('SELECT * FROM users WHERE username = ?', username)
    if (existingUser) {
      res.status(409).json({ error: 'Användarnamnet är redan taget' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
   await db.run(
  'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
  username, hashedPassword, role)

    res.status(201).json({ message: 'Användare registrerad!' })
  } catch (error) {
    console.error('Registreringsfel:', error)
    res.status(500).json({ error: 'Något gick fel' })
  }
})
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      res.status(400).json({ error: 'Användarnamn och lösenord krävs' })
      return
    }

    const db = await getDbConnection()
    const user = await db.get('SELECT * FROM users WHERE username = ?', username)
    console.log('Hittad user:', user)

    if (!user) {
      res.status(401).json({ error: 'Felaktigt användarnamn eller lösenord' })
      return
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    console.log('Lösenord matchar:', isPasswordValid)

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Felaktigt användarnamn eller lösenord' })
      return
    }

    const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, JWT_SECRET, {
      expiresIn: '1h',
    })

    res.json({ token })
  } catch (error) {
    console.error('Inloggningsfel:', error)
    res.status(500).json({ error: 'Något gick fel' })
  }
})


export default router
