import 'dotenv/config';
import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  migrations: [`${__dirname}/migrations/**/*.ts`],
});

export default dataSource;
