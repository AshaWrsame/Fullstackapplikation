import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

async function initDb() {
  const db = await open({
    filename: 'database.sqlite',
    driver: sqlite3.Database,
  })

  console.log('Ansluten till databasen.');

  await db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
  `)

  await db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price INTEGER NOT NULL,
      image_url TEXT,
      category_id INTEGER,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );
  `)

await db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user'
  )
`);

  console.log('Tabeller skapade!')
  await db.close()
}

initDb().catch((err) => {
  console.error('Fel vid initiering av databas:', err)
})
