import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { SearchService } from './search/search.service';
import { Product } from './products/entities/product.entity';
import { ProductStock } from './branches/entities/product-stock.entity';
import { Category, SizeType } from './categories/entities/category.entity';
import { Branch } from './branches/entities/branch.entity';

const dummyImages = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80',
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80',
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1200&q=80',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
  'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80',
  'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1200&q=80',
  'https://plus.unsplash.com/premium_photo-1681276170683-70fbfbaeeaf7?w=800&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80',
];

function slugify(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '') + '-' + Math.floor(Math.random() * 10000);
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const searchService = app.get(SearchService);

  const productRepo = dataSource.getRepository(Product);
  const stockRepo = dataSource.getRepository(ProductStock);
  const categoryRepo = dataSource.getRepository(Category);
  const branchRepo = dataSource.getRepository(Branch);

  console.log('Seeding 3-level hierarchal mock data...');

  await dataSource.query('TRUNCATE TABLE categories, products, branches, product_stocks, order_items, orders CASCADE');
  try {
     if ((searchService as any).client?.indices) {
        await (searchService as any).client.indices.delete({ index: 'products' });
     } else if ((searchService as any).elasticsearchService) {
        await (searchService as any).elasticsearchService.indices.delete({ index: 'products' });
     }
  } catch(e) {}

  const branch1 = await branchRepo.save({ name: 'Gənclik Mall', address: 'Fətəli Xan Xoyski', phone: '012-345-67-89' });

  // LEVEL 1
  const cWomen = await categoryRepo.save(categoryRepo.create({ name: 'Qadın', slug: slugify('Qadın'), isActive: true, showOnHome: true }));
  const cMen = await categoryRepo.save(categoryRepo.create({ name: 'Kişi', slug: slugify('Kişi'), isActive: true, showOnHome: true }));
  const cTech = await categoryRepo.save(categoryRepo.create({ name: 'Elektronika', slug: slugify('Elektronika'), isActive: true, showOnHome: true }));

  // LEVEL 2 (Men)
  const cMenClothes = await categoryRepo.save(categoryRepo.create({ name: 'Geyim', slug: slugify('Kişi Geyim'), isActive: true, parent: { id: cMen.id } }));
  const cMenShoes = await categoryRepo.save(categoryRepo.create({ name: 'Ayaqqabı', slug: slugify('Kişi Ayaqqabı'), isActive: true, parent: { id: cMen.id }, sizeType: SizeType.AYAQQABI }));

  // LEVEL 3 (Men -> Geyim)
  const cMenTshirt = await categoryRepo.save(categoryRepo.create({ name: 'Köynək', slug: slugify('Kişi Köynək'), isActive: true, parent: { id: cMenClothes.id } }));
  const cMenJeans = await categoryRepo.save(categoryRepo.create({ name: 'Şalvar', slug: slugify('Kişi Şalvar'), isActive: true, parent: { id: cMenClothes.id } }));
  
  // LEVEL 2 (Women)
  const cWomenClothes = await categoryRepo.save(categoryRepo.create({ name: 'Geyim', slug: slugify('Qadın Geyim'), isActive: true, parent: { id: cWomen.id } }));
  
  // LEVEL 3 (Women -> Geyim)
  const cWomenDress = await categoryRepo.save(categoryRepo.create({ name: 'Paltar', slug: slugify('Qadın Paltar'), isActive: true, parent: { id: cWomenClothes.id } }));
  const cWomenSkirt = await categoryRepo.save(categoryRepo.create({ name: 'Etek', slug: slugify('Qadın Etek'), isActive: true, parent: { id: cWomenClothes.id } }));

  // LEVEL 2 (Tech)
  const cPhones = await categoryRepo.save(categoryRepo.create({ name: 'Telefonlar', slug: slugify('Smartfonlar'), isActive: true, parent: { id: cTech.id } }));
  const cComputers = await categoryRepo.save(categoryRepo.create({ name: 'Kompüterlər', slug: slugify('Kompüterlər'), isActive: true, parent: { id: cTech.id } }));

  // LEVEL 3 (Tech -> Phones)
  const cApple = await categoryRepo.save(categoryRepo.create({ name: 'iPhone', slug: slugify('iPhone'), isActive: true, parent: { id: cPhones.id } }));
  const cSamsung = await categoryRepo.save(categoryRepo.create({ name: 'Samsung', slug: slugify('Samsung'), isActive: true, parent: { id: cPhones.id } }));

  // Add some products to Level 3 categories
  const mockProducts = [
    {
      name: 'iPhone 15 Pro',
      description: 'The latest iPhone with Titanium design.',
      price: 2499.00,
      categoryId: cApple.id,
      images: [dummyImages[8]],
      stocks: [{ branchId: branch1.id, color: 'Natural Titanium', size: null, stock: 10 }]
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      description: 'AI-powered smartphone with 200MP camera.',
      price: 2199.00,
      categoryId: cSamsung.id,
      images: [dummyImages[8]],
      stocks: [{ branchId: branch1.id, color: 'Titanium Gray', size: null, stock: 5 }]
    },
    {
      name: 'Kişi Pambıq Köynək',
      description: 'Mavi rəngli, 100% pambıq köynək.',
      price: 55.00,
      categoryId: cMenTshirt.id,
      images: [dummyImages[2]],
      stocks: [{ branchId: branch1.id, color: 'Mavi', size: 'L', stock: 20 }]
    }
  ];

  for (const mp of mockProducts) {
    const p = productRepo.create({
      name: mp.name,
      description: mp.description,
      price: mp.price,
      category: { id: mp.categoryId },
      images: mp.images,
      banner: mp.images[0],
      isFeatured: true,
      tags: [],
      variants: {}
    });
    const savedP = await productRepo.save(p);
    
    const stockEntities = mp.stocks.map(s => stockRepo.create({
      product: { id: savedP.id } as any,
      productId: savedP.id,
      branch: { id: s.branchId } as any,
      branchId: s.branchId,
      color: s.color,
      size: s.size,
      stock: s.stock
    }));
    await stockRepo.save(stockEntities);
    await searchService.indexProduct(await productRepo.findOne({ where: { id: savedP.id }, relations: ['category'] }) as any);
  }

  console.log('3-Level Seeding Completed!');
  await app.close();
}
bootstrap();
