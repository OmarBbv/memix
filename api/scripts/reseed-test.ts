import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../src/config/typeorm.config';

async function run() {
  const dataSource = new DataSource(typeOrmConfig as any);
  await dataSource.initialize();
  
  console.log('Cleaning up products and logs...');
  // Delete in order to satisfy foreign keys
  await dataSource.query('DELETE FROM product_stocks');
  await dataSource.query('DELETE FROM products');
  await dataSource.query('DELETE FROM warehouse_logs');

  // Ensure at least one category exists
  let catId;
  const cats = await dataSource.query('SELECT id FROM categories LIMIT 1');
  if (cats.length > 0) {
    catId = cats[0].id;
  } else {
    const catResult = await dataSource.query("INSERT INTO categories (name, description) VALUES ('Electronic', 'Gadgets') RETURNING id");
    catId = catResult[0].id;
  }

  console.log(`Using Category ID: ${catId}`);

  const testDate = '2026-04-05';
  console.log(`Using Test Date: ${testDate}`);

  // 5 products with specific prices and stocks
  const prices = [100.00, 200.00, 300.00, 400.00, 500.00];
  const stocks = [10, 5, 2, 1, 4];
  const totalValue = prices.reduce((acc, p, i) => acc + (p * stocks[i]), 0);
  const totalCount = stocks.reduce((acc, s) => acc + s, 0);

  console.log('Creating 5 test products...');
  for (let i = 0; i < 5; i++) {
    const pResult = await dataSource.query(`
      INSERT INTO products (name, description, price, "categoryId", "isFeatured", "isActive", "isDeleted", "variants", "attributes", "tags", "createdAt", "updatedAt") 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11) 
      RETURNING id
    `, [`Product ${i+1}`, `Description ${i+1}`, prices[i], catId, false, true, false, '{}', '{}', '{}', testDate]);
    
    const pId = pResult[0].id;
    await dataSource.query(`INSERT INTO product_stocks (stock, "productId") VALUES ($1, $2)`, [stocks[i], pId]);
    console.log(`  ✅ Added Product ${i+1}: Price ${prices[i]}, Stock ${stocks[i]}`);
  }

  console.log('\nCreating warehouse budget log for today...');
  const budget = 10000;
  const budgetCount = 100;
  
  await dataSource.query(`
    INSERT INTO warehouse_logs ("recordDate", "productCount", "totalAmount", note, "createdAt", "updatedAt") 
    VALUES ($1, $2, $3, $4, $1, $1)
  `, [testDate, budgetCount, budget, 'Test Budget for Verification']);

  console.log(`Budget: ${budget}, Expected Value Spent: ${totalValue}, Expected Balance: ${budget - totalValue}`);
  console.log(`Target Count: ${budgetCount}, Expected Count Spent: ${totalCount}, Expected count balance: ${budgetCount - totalCount}`);

  console.log('\n✨ Database cleaned and re-seeded successfully!');
  await dataSource.destroy();
}

run().catch((err) => {
  console.error('❌ Error during re-seeding:', err);
  process.exit(1);
});
