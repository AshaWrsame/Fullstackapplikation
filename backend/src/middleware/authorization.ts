import { Request, Response, NextFunction, RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'din-hemliga-nyckel'

interface JwtPayload {
  userId: number;
  username: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    res.status(401).json({ error: 'Token saknas' })
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
       next()
  } catch (err) {
    res.status(403).json({ error: 'Ogiltig token' })
    return;
  }
}
export const requireRole = (role: string): RequestHandler => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      res.status(403).json({ error: 'Åtkomst nekad' });
      return
    }
    next()
  }
}
export const requireAdmin: RequestHandler = requireRole('admin')
