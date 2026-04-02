import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../src/config/typeorm.config';
import { Category } from '../src/categories/entities/category.entity';
import { Product } from '../src/products/entities/product.entity';
import { ProductStock } from '../src/products/entities/product-stock.entity';

async function seed() {
  const dataSource = new DataSource(typeOrmConfig as any);
  await dataSource.initialize();

  const categoryRepo = dataSource.getRepository(Category);
  const productRepo = dataSource.getRepository(Product);
  const stockRepo = dataSource.getRepository(ProductStock);

  console.log('--- TEST DATA SEEDING STARTED ---');

  const sizeTypeMappings: Record<string, string> = {
    'ayaqqabi': 'ayaqqabi',
    'futbolka': 'beden-text',
    'salvar': 'beden-numeric',
    'kemer': 'tek-olcu',
    'usaq-paltari': 'yas-grupu',
    'don': 'beden-text',
    'koynek': 'beden-text',
    'pencek': 'beden-text',
  };

  const categories = await categoryRepo.find();
  for (const cat of categories) {
    if (sizeTypeMappings[cat.slug]) {
      cat.sizeType = sizeTypeMappings[cat.slug];
      await categoryRepo.save(cat);
      console.log(`Updated category ${cat.name} with sizeType: ${cat.sizeType}`);
    }
  }

  // 2. Ölçü dəyərləri
  const sizeValues: Record<string, string[]> = {
    'beden-text': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    'beden-numeric': ['28', '30', '32', '34', '36', '38'],
    'ayaqqabi': ['36', '37', '38', '39', '40', '41', '42', '43', '44'],
    'uzuk': ['14', '16', '18', '20', '22'],
    'tek-olcu': ['Standart'],
    'yas-grupu': ['0-3 ay', '6-12 ay', '1-2 yaş', '3-4 yaş'],
  };

  const images = [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600',
    'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600',
  ];

  const brands = await dataSource.getRepository('brands').find();
  const conditions = ['Yeni', 'Etiketli', 'Çox yaxşı', 'Yaxşı', 'Yeni kimi'];

  console.log('Clearing old test products...');
  await productRepo.query('DELETE FROM products'); // This should cascade to stocks

  // 3. Hər kateqoriya üçün 5-12 arası məhsul yarat
  for (const cat of categories) {
    const productCount = Math.floor(Math.random() * (12 - 5 + 1)) + 5;
    console.log(`Adding ${productCount} products to category: ${cat.name}`);

    for (let i = 1; i <= productCount; i++) {
      const randomBrand = brands.length > 0 ? brands[Math.floor(Math.random() * brands.length)] : undefined;
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];

      const product = productRepo.create({
        name: `${cat.name} Məhsulu #${i}`,
        description: `${cat.name} üçün test təsviri. Bu məhsul dinamik ölçü testləri üçündür.`,
        price: Math.floor(Math.random() * 200) + 10,
        category: cat,
        brand: randomBrand as any,
        isActive: true,
        banner: images[Math.floor(Math.random() * images.length)],
        variants: {
          condition: randomCondition
        }
      });

      const savedProduct = await productRepo.save(product);

      // Ölçü tipinə görə stok/ölçü əlavə et
      const stType = cat.sizeType || 'beden-text'; // default
      const possibleSizes = sizeValues[stType] || sizeValues['beden-text'];

      // Məhsula 2-3 fərqli ölçü verək
      const numSizes = Math.floor(Math.random() * 3) + 1;
      const shuffled = [...possibleSizes].sort(() => 0.5 - Math.random());
      const selectedSizes = shuffled.slice(0, numSizes);

      for (const sizeVal of selectedSizes) {
        const stock = stockRepo.create({
          product: savedProduct,
          size: sizeVal,
          stock: Math.floor(Math.random() * 50) + 1
        });
        await stockRepo.save(stock);
      }
    }
  }

  console.log('--- TEST DATA SEEDING COMPLETED ---');
  await dataSource.destroy();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
