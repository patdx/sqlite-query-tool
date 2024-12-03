import { sql } from 'kysely'
import { db } from './sqlocal'

let dbPromise: Promise<typeof db> | null = null

export async function getDatabase() {
	if (!dbPromise) {
		dbPromise = seedDatabase().then(() => db)
	}
	return dbPromise
}

async function seedDatabase() {
	// Create tables
	await sql`
    CREATE TABLE IF NOT EXISTS authors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `.execute(db)

	await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author_id INTEGER NOT NULL,
      published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES authors(id)
    )
  `.execute(db)

	db.executeQuery

	// Check if we already have data
	const authorCount = await sql<{
		count: number | null
	}>`SELECT COUNT(*) as count FROM authors`.execute(db)

	if (authorCount.rows[0].count === 0) {
		// Seed authors
		const authors = [
			{ name: 'John Doe', email: 'john@example.com' },
			{ name: 'Jane Smith', email: 'jane@example.com' },
			{ name: 'Bob Wilson', email: 'bob@example.com' },
		]

		for (const author of authors) {
			await sql`INSERT INTO authors (name, email) VALUES (${author.name}, ${author.email})`.execute(
				db,
			)
		}

		// Seed posts
		const posts = [
			{
				title: 'Getting Started with SQLite',
				content: 'SQLite is a fantastic database...',
				author_id: 1,
			},
			{
				title: 'Web Development Tips',
				content: 'Here are some tips for web development...',
				author_id: 2,
			},
			{
				title: 'JavaScript Best Practices',
				content: 'Learn about JavaScript best practices...',
				author_id: 1,
			},
			{
				title: 'React Components',
				content: 'Building reusable React components...',
				author_id: 2,
			},
			{
				title: 'Database Design',
				content: 'Principles of good database design...',
				author_id: 3,
			},
		]

		for (const post of posts) {
			await sql`
        INSERT INTO posts (title, content, author_id) 
        VALUES (${post.title}, ${post.content}, ${post.author_id})
      `.execute(db)
		}
	}
}
