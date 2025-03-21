import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../shared/schema';

const { Pool } = pg;

// Use the environment variables provided by the PostgreSQL database
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Create a Drizzle instance with our schema
export const db = drizzle(pool, { schema });