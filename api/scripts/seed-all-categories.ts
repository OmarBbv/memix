import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../src/config/typeorm.config';
import { Category } from '../src/categories/entities/category.entity';
import { Product } from '../src/products/entities/product.entity';
import { ProductStock } from '../src/products/entities/product-stock.entity';
import { ProductColorVariant } from '../src/products/entities/product-color-variant.entity';
import { Brand } from '../src/brands/entities/brand.entity';
import { LISTING_TYPE } from '../src/products/enums/listing.type.enum';

async function seed() {
  const dataSource = new DataSource(typeOrmConfig as any);
  await dataSource.initialize();

  const categoryRepo = dataSource.getRepository(Category);
  const productRepo = dataSource.getRepository(Product);
  const brandRepo = dataSource.getRepository(Brand);
  const colorRepo = dataSource.getRepository(ProductColorVariant);
  const stockRepo = dataSource.getRepository(ProductStock);

  console.log('--- 🚀 BULK SEEDING ALL CATEGORIES STARTED ---');

  const categories = await categoryRepo.find();
  console.log(`Found ${categories.length} categories.`);

  const brandsData = ['Zara', 'Nike', 'Adidas', 'Mango', 'H&M', 'Levi\'s', 'Massimo Dutti', 'Bershka', 'Pull & Bear'];
  const colors = ['Qara', 'Ağ', 'Göy', 'Boz', 'Yaşıl', 'Qırmızı', 'Bej'];
  const sizes = ['S', 'M', 'L', 'XL', '40', '41', '42', '43', 'Standart'];
  const images = [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
      'https://images.unsplash.com/photo-1586363104862-3a5e2ca60d99?w=800',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800'
  ];

  // 1. Ensure brands exist
  const brandMap = new Map<string, Brand>();
  for (const bName of brandsData) {
      const slug = bName.toLowerCase().replace(/ /g, '-');
      let brand = await brandRepo.findOne({ where: [{ name: bName }, { slug }] });
      if (!brand) {
          brand = brandRepo.create({ name: bName, slug });
          brand = await brandRepo.save(brand);
      }
      brandMap.set(bName, brand);
  }

  let totalProducts = 0;

  for (const cat of categories) {
    // Add 3-5 products per category to reach ~150-250 products total
    const productCount = Math.floor(Math.random() * 3) + 3; 
    console.log(`📦 Adding ${productCount} products to category: ${cat.name} (${cat.slug})`);

    for (let i = 1; i <= productCount; i++) {
      const brandName = brandsData[Math.floor(Math.random() * brandsData.length)];
      const brand = brandMap.get(brandName);
      const price = Math.floor(Math.random() * 200) + 15;
      const mainImg = images[Math.floor(Math.random() * images.length)];

      const product = productRepo.create({
        name: `${brandName} ${cat.name} - Model ${i}`,
        description: `Yüksək keyfiyyətli ${cat.name}. ${brandName} markası tərəfindən premium materiallardan hazırlanmışdır.`,
        price: price,
        category: cat,
        brand: brand,
        isActive: true,
        isFeatured: Math.random() > 0.8,
        banner: mainImg,
        images: [mainImg],
        listingType: Math.random() > 0.3 ? LISTING_TYPE.NEW : LISTING_TYPE.USED,
        tags: [cat.slug, brandName.toLowerCase(), 'yeni']
      });

      const savedP = await productRepo.save(product);
      totalProducts++;

      // Create 1-2 color variants
      const colorCount = Math.floor(Math.random() * 2) + 1;
      for (let v = 0; v < colorCount; v++) {
          const colorName = colors[Math.floor(Math.random() * colors.length)];
          const variant = await colorRepo.save(colorRepo.create({
              product: savedP,
              color: colorName,
              images: [images[Math.floor(Math.random() * images.length)]]
          }));

          // Create stocks (1-3 sizes)
          const sizeCount = Math.floor(Math.random() * 3) + 1;
          for (let s = 0; s < sizeCount; s++) {
              const sizeVal = sizes[Math.floor(Math.random() * sizes.length)];
              await stockRepo.save(stockRepo.create({
                  product: savedP,
                  colorVariant: variant,
                  size: sizeVal,
                  stock: Math.floor(Math.random() * 50) + 1
              }));
          }
      }
    }
  }

  console.log(`\n\n✨ BULK SEEDING COMPLETED! Total products added: ${totalProducts}`);
  await dataSource.destroy();
}

seed().catch(err => {
  console.error('❌ SEED ERROR:', err);
  process.exit(1);
});
