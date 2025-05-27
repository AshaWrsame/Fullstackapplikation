import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export async function getDb() {
  return open({
    filename: 'database.sqlite',
    driver: sqlite3.Database,
  })
}

export async function createUser(username: string, hashedPassword: string, role: string = 'user') {
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
    username,
    hashedPassword,
    role
  );
  return result.lastID
}

export async function findUserByUsername(username: string) {
  const db = await getDb()
  return db.get('SELECT * FROM users WHERE username = ?', username);
}
