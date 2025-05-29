import express from 'express'
import { getDbConnection } from '../db'
import { authenticateToken } from '../middleware/authorization'

const router = express.Router();

router.post('/', authenticateToken
