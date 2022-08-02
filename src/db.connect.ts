import { Client } from 'pg';

export const client = new Client({
  port: 5433,
  password: 'password',
  user: 'postgres',
  database: 'car_rent',
});

client.connect();
