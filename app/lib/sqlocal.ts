import { Kysely } from 'kysely'
import { SQLocalKysely } from 'sqlocal/kysely'

// Initialize SQLocalKysely and pass the dialect to Kysely
const { dialect } = new SQLocalKysely(':memory:')
export const db = new Kysely({ dialect })
