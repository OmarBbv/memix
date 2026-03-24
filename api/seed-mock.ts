import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { CategoriesService } from './categories/categories.service';
import { BranchesService } from './branches/branches.service';
import { SearchService } from './search/search.service';
import { Product } from './products/entities/product.entity';
import { ProductStock } from './branches/entities/product-stock.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const dataSource = app.get(DataSource);
  const categoriesService = app.get(CategoriesService);
  const branchesService = app.get(BranchesService);
  const searchService = app.get(SearchService);

  const productRepo = dataSource.getRepository(Product);
  const stockRepo = dataSource.getRepository(ProductStock);

  console.log('Seeding mock data...');

  await dataSource.query('TRUNCATE TABLE categories, products, branches, product_stocks, order_items, orders CASCADE');
  try { await searchService.client.indices.delete({ index: 'products' }); } catch(e) {}

  const branch1 = await branchesService.create({ name: 'Gənclik Mall', address: 'Fətəli Xan Xoyski', phoneNumber: '012-345-67-89', isActive: true });
  const branch2 = await branchesService.create({ name: 'Nizami küçəsi (Torqovı)', address: 'Nizami 12', phoneNumber: '012-111-22-33', isActive: true });

  const cWomen = await categoriesService.create({ name: 'Qadın', isActive: true, onHome: true });
  const cMen = await categoriesService.create({ name: 'Kişi', isActive: true, onHome: true });
  
  const cMenShoes = await categoriesService.create({ name: 'Ayaqqabı', isActive: true, onHome: true, parentId: cMen.id, sizeType: 'ayaqqabi' });
  const cMenClothes = await categoriesService.create({ name: 'Geyim', isActive: true, onHome: false, parentId: cMen.id, sizeType: 'beden-text' });
  
  const cWomenShoes = await categoriesService.create({ name: 'Ayaqqabı', isActive: true, onHome: true, parentId: cWomen.id, sizeType: 'ayaqqabi' });
  const cWomenAccessories = await categoriesService.create({ name: 'Aksessuar', isActive: true, onHome: false, parentId: cWomen.id, sizeType: 'uzuk' });

  const mockProducts = [
    {
      name: 'Nike Air Max 270',
      description: 'Çox rahat qaçış ayaqqabısı. Yeni premium model.',
      price: 349.99,
      categoryId: cMenShoes.id,
      isFeatured: true,
      tags: ['Nike', 'Qaçış', 'İdman'],
      variants: { brand: 'Nike', material: 'Mesh', 'mövsüm': 'Yay' },
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'],
      banner: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80',
      stocks: [
        { branchId: branch1.id, color: 'Qırmızı', size: '41', stock: 5 },
        { branchId: branch1.id, color: 'Qırmızı', size: '42', stock: 2 },
        { branchId: branch1.id, color: 'Qara', size: '41', stock: 10 },
      ]
    },
    {
      name: 'Zara Premium Köynək',
      description: 'Klassik kəsim, 100% pambıq köynək.',
      price: 89.00,
      categoryId: cMenClothes.id,
      isFeatured: false,
      tags: ['Zara', 'Klassik', 'Köynək'],
      variants: { brand: 'Zara', material: 'Pambıq', 'forma': 'Slim Fit' },
      images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
      banner: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1200&q=80',
      stocks: [
        { branchId: branch1.id, color: 'Qara', size: 'M', stock: 15 },
        { branchId: branch1.id, color: 'Qara', size: 'L', stock: 8 },
        { branchId: branch2.id, color: 'Ağ', size: 'M', stock: 4 },
        { branchId: branch2.id, color: 'Ağ', size: 'L', stock: 12 },
      ]
    },
    {
      name: 'Vans Old Skool',
      description: 'Klassik Vans ayaqqabısı. İkonik dizayn.',
      price: 159.50,
      categoryId: cWomenShoes.id,
      isFeatured: true,
      tags: ['Vans', 'Sneaker', 'Klassik'],
      variants: { brand: 'Vans', material: 'Zamşa' },
      images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80'],
      banner: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1200&q=80',
      stocks: [
        { branchId: branch1.id, color: 'Sarı', size: '36', stock: 2 },
        { branchId: branch1.id, color: 'Sarı', size: '37', stock: 5 },
        { branchId: branch2.id, color: 'Sarı', size: '38', stock: 7 },
      ]
    },
    {
      name: 'Swarovski Zərif Üzük',
      description: 'Premium brilyant daşlı üzük. Minimalist dizayn.',
      price: 299.00,
      categoryId: cWomenAccessories.id,
      isFeatured: true,
      tags: ['Swarovski', 'Üzük', 'Premium'],
      variants: { brand: 'Swarovski', material: 'Gümüş', 'daş': 'Brilyant' },
      images: ['https://plus.unsplash.com/premium_photo-1681276170683-70fbfbaeeaf7?w=800&q=80'],
      banner: 'https://plus.unsplash.com/premium_photo-1681276170683-70fbfbaeeaf7?w=1200&q=80',
      stocks: [
        { branchId: branch1.id, color: 'Gümüş', size: '16', stock: 1 },
        { branchId: branch1.id, color: 'Gümüş', size: '17', stock: 3 },
        { branchId: branch1.id, color: 'Qızılı', size: '16', stock: 2 },
      ]
    }
  ];

  for (const mp of mockProducts) {
    const p = productRepo.create({
      name: mp.name,
      description: mp.description,
      price: mp.price,
      category: { id: mp.categoryId },
      isFeatured: mp.isFeatured,
      tags: mp.tags,
      variants: mp.variants,
      images: mp.images,
      banner: mp.banner,
    });
    const savedP = await productRepo.save(p);
    
    // Add stocks
    const stockEntities = mp.stocks.map(s => stockRepo.create({
      productId: savedP.id,
      branchId: s.branchId,
      color: s.color,
      size: s.size,
      stock: s.stock
    }));
    await stockRepo.save(stockEntities);

    // Index
    await searchService.indexProduct(savedP);
  }

  console.log('Seed completed successfully!');
  await app.close();
}
bootstrap();
