import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const client = postgres({
  host: process.env.SQL_HOST || process.env.PGHOST || 'localhost',
  user: process.env.SQL_USER || process.env.PGUSER || 'postgres',
  password: process.env.SQL_PASSWORD || process.env.PGPASSWORD || '',
  database: process.env.SQL_DB_NAME || process.env.PGDATABASE || 'postgres',
  prepare: false
});
export const db = drizzle(client, { schema });
