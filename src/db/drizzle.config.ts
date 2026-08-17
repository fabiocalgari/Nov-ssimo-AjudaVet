import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.SQL_HOST || process.env.PGHOST || 'localhost',
    user: process.env.SQL_USER || process.env.PGUSER || 'postgres',
    password: process.env.SQL_PASSWORD || process.env.PGPASSWORD || '',
    database: process.env.SQL_DB_NAME || process.env.PGDATABASE || 'postgres',
  }
});
