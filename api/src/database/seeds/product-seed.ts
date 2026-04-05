import { DataSource } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Category } from '../../categories/entities/category.entity';
import { Brand } from '../../brands/entities/brand.entity';
import { ProductColorVariant } from '../../products/entities/product-color-variant.entity';
import { ProductStock } from '../../products/entities/product-stock.entity';
import { typeOrmConfig } from '../../config/typeorm.config';
import { LISTING_TYPE } from '../../products/enums/listing.type.enum';

const productsData = [
  {
    name: 'Zara Polo Köynək (Premium)',
    description: 'Yüksək keyfiyyətli, 100% pambıqdan hazırlanmış premium polo köynək. Gündəlik və işgüzar tərz üçün ideal seçimdir.',
    price: 55.00,
    categorySlug: 'polo',
    brandName: 'Zara',
    tags: ['polo', 'zara', 'yeni', 'pambıq'],
    variants: [
      {
        color: 'Göy',
        images: ['https://images.unsplash.com/photo-1586363104862-3a5e2ca60d99?w=800'],
        sizes: [
          { size: 'S', stock: 12 },
          { size: 'M', stock: 15 },
          { size: 'L', stock: 8 },
          { size: 'XL', stock: 5 }
        ]
      },
      {
        color: 'Ağ',
        images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800'],
        sizes: [
          { size: 'M', stock: 10 },
          { size: 'L', stock: 12 }
        ]
      }
    ]
  },
  {
    name: 'Nike Air Max 270',
    description: 'Maksimum rahatlıq və stil bir arada. Nike Air texnologiyası ilə gün boyu yorulmadan hərəkət edin.',
    price: 245.00,
    categorySlug: 'ayaqqabi',
    brandName: 'Nike',
    tags: ['nike', 'airmax', 'idman', 'sneaker'],
    variants: [
      {
        color: 'Qara/Qırmızı',
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
        sizes: [
          { size: '41', stock: 5 },
          { size: '42', stock: 8 },
          { size: '43', stock: 10 },
          { size: '44', stock: 4 }
        ]
      }
    ]
  },
  {
    name: 'H&M Kətan Şalvar',
    description: 'Yaz və yay ayları üçün yüngül kətan şalvar. Rahat kəsim və nəfəs alan parça.',
    price: 49.90,
    categorySlug: 'salvar',
    brandName: 'H&M',
    tags: ['ketan', 'salvar', 'summer', 'hm'],
    variants: [
      {
        color: 'Bej',
        images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800'],
        sizes: [
          { size: '30', stock: 6 },
          { size: '32', stock: 12 },
          { size: '34', stock: 8 }
        ]
      }
    ]
  },
  {
    name: 'Mango Midi Don',
    description: 'Zərif və şax bir görünüş üçün Mango-dan yeni sezon midi don.',
    price: 89.00,
    categorySlug: 'don',
    brandName: 'MANGO',
    tags: ['don', 'mango', 'midi', 'qadin'],
    variants: [
      {
        color: 'Çiçəkli',
        images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'],
        sizes: [
          { size: 'XS', stock: 4 },
          { size: 'S', stock: 10 },
          { size: 'M', stock: 15 }
        ]
      }
    ]
  },
  {
    name: 'Pull & Bear Denim Gödəkcə',
    description: 'Klassik denim stilini Pull & Bear fərqi ilə yaşayın. Davamlı parça və modern kəsim.',
    price: 75.00,
    categorySlug: 'godekce',
    brandName: 'Pull & Bear',
    tags: ['denim', 'jacket', 'pullbear', 'new'],
    variants: [
      {
        color: 'Açıq Mavi',
        images: ['https://images.unsplash.com/photo-1576995853123-5a103055b19b?w=800'],
        sizes: [
          { size: 'S', stock: 7 },
          { size: 'M', stock: 12 },
          { size: 'L', stock: 5 }
        ]
      }
    ]
  }
];

async function seed() {
  const dataSource = new DataSource(typeOrmConfig as any);
  await dataSource.initialize();

  const productRepo = dataSource.getRepository(Product);
  const categoryRepo = dataSource.getRepository(Category);
  const brandRepo = dataSource.getRepository(Brand);
  const variantRepo = dataSource.getRepository(ProductColorVariant);
  const stockRepo = dataSource.getRepository(ProductStock);

  console.log('🧹 Clearing existing products and related data...');
  await dataSource.query('TRUNCATE products CASCADE');

  console.log(`🌱 Seeding ${productsData.length} core products...`);

  for (const data of productsData) {
    const category = await categoryRepo.findOne({ where: { slug: data.categorySlug } });
    if (!category) {
      console.warn(`⚠️ Category not found for slug: ${data.categorySlug}. Skipping: ${data.name}`);
      continue;
    }

    let brand = await brandRepo.findOne({ where: { name: data.brandName } });
    if (!brand) {
      brand = brandRepo.create({ name: data.brandName, slug: data.brandName.toLowerCase().replace(/ /g, '-') });
      await brandRepo.save(brand);
    }

    const product = productRepo.create({
      name: data.name,
      description: data.description,
      price: data.price,
      banner: data.variants[0].images[0],
      category: category,
      brand: brand,
      tags: data.tags,
      isActive: true,
      isFeatured: true,
      listingType: LISTING_TYPE.NEW,
      images: data.variants.flatMap(v => v.images)
    });

    const savedProduct = await productRepo.save(product);
    console.log(`  ✅ Product: ${savedProduct.name}`);

    for (const vData of data.variants) {
      const variant = variantRepo.create({
        product: savedProduct,
        color: vData.color,
        images: vData.images
      });
      const savedVariant = await variantRepo.save(variant);
      console.log(`    🎨 Variant: ${savedVariant.color}`);

      for (const sData of vData.sizes) {
        const stock = stockRepo.create({
          product: savedProduct,
          colorVariant: savedVariant,
          size: sData.size,
          stock: sData.stock
        });
        await stockRepo.save(stock);
      }
    }
  }

  console.log('\n✨ Product seeding completed successfully!');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Error during seeding:', err);
  process.exit(1);
});
