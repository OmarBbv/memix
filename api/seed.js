const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function seed() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'memix',
    password: 'metroboomin2425',
    port: 5432,
  });

  await client.connect();

  for (let i = 1; i <= 20; i++) {
    const name = `Müştəri${i}`;
    const surname = `Testliov${i}`;
    const email = `testhesab${i}_${Date.now()}@example.com`;
    const password = await bcrypt.hash('12345678', 10);
    const phone = `+99450000${i.toString().padStart(2, '0')}`;
    const role = 'user';
    const gender = i % 2 === 0 ? 'male' : 'female';

    await client.query(
      'INSERT INTO users (name, surname, email, password, phone, role, gender) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [name, surname, email, password, phone, role, gender]
    );
  }

  console.log('20 hesab ugurla yaradildi!');
  await client.end();
}

seed().catch(console.error);
