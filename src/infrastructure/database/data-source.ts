import 'dotenv/config';
import { join } from 'path';
import { DataSource } from 'typeorm';



export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [join(__dirname, '..', '..', 'modules', '**', '*.orm-entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
});
