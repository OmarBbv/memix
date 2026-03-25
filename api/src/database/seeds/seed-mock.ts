import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../../app.module';
import { CategoriesService } from '../../categories/categories.service';
import { BranchesService } from '../../branches/branches.service';
import { SearchService } from '../../search/search.service';
import { Product } from '../../products/entities/product.entity';
import { ProductStock } from '../../branches/entities/product-stock.entity';
import { SizeType } from '../../categories/entities/category.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const dataSource = app.get(DataSource);
  const categoriesService = app.get(CategoriesService);
  const branchesService = app.get(BranchesService);
  const searchService = app.get(SearchService);

  const productRepo = dataSource.getRepository(Product);
  const stockRepo = dataSource.getRepository(ProductStock);

  console.log('Seeding mock data...');

  await dataSource.query(
    'TRUNCATE TABLE categories, products, branches, product_stocks, order_items, orders CASCADE',
  );
  try {
    await (searchService as any).elasticsearchService.indices.delete({
      index: 'products',
    });
  } catch (e) {}

  const branch1: any = await branchesService.create({
    name: 'Gənclik Mall',
    address: 'Fətəli Xan Xoyski',
    phoneNumber: '012-345-67-89',
    isActive: true,
  });
  const branch2: any = await branchesService.create({
    name: 'Nizami küçəsi (Torqovı)',
    address: 'Nizami 12',
    phoneNumber: '012-111-22-33',
    isActive: true,
  });

  const level1Names = [
    'Geyim',
    'Ayaqqabı',
    'Aksessuar',
    'Elektronika',
    'Kosmetika',
    'Ev və Yaşam',
    'İdman',
    'Kitab',
    'Oyuncaq',
    'Uşaq',
    'Saat',
    'Eynək',
    'Çanta',
    'Parfümeriya',
    'Məişət Texnikası',
    'Ofis ləvazimatları',
    'Hədiyyəlik',
    'Avtomobil',
    'Musiqi Alətləri',
    'Petshop',
  ];

  const level1Categories: any[] = [];
  for (let i = 0; i < level1Names.length; i++) {
    const cat = await categoriesService.create({
      name: level1Names[i],
      isActive: true,
      showOnHome: i < 11,
    });
    level1Categories.push(cat);
  }

  const level2Types = [
    'Kişi',
    'Qadın',
    'Uşaq',
    'Yeni Kolleksiya',
    'Endirimlər',
  ];
  const level3Items: Record<string, string[]> = {
    Geyim: [
      'T-Shirt',
      'Şalvar',
      'Don',
      'Paltar',
      'Kostyum',
      'Kürək',
      'Jaket',
      'Corab',
    ],
    Ayaqqabı: [
      'Sneaker',
      'Klassik',
      'Bot',
      'Sandalet',
      'İdman Ayaqqabısı',
      'Ev Ayaqqabısı',
    ],
    Aksessuar: [
      'Kəmər',
      'Pulqabı',
      'Eynək',
      'Şarf',
      'Əlcək',
      'Papaq',
      'Bijuteriya',
    ],
    Elektronika: [
      'Telefon',
      'Kompyuter',
      'Qulaqlıq',
      'Smart Saat',
      'Aksessuarlar',
      'Kamera',
    ],
    Kosmetika: [
      'Makiyaj',
      'Dəriyə Qulluq',
      'Ətir',
      'Saç Qulluğu',
      'Vanna və Bədən',
    ],
    Default: ['Məhsul A', 'Məhsul B', 'Məhsul C', 'Xüsusi Model', 'Yeni Gələn'],
  };

  const allLevel2Categories: any[] = [];
  const allLevel3Categories: any[] = [];

  for (const l1 of level1Categories) {
    // Each L1 gets 3-5 subcategories
    const subCount = 3 + Math.floor(Math.random() * 3);
    for (let j = 0; j < subCount; j++) {
      const l2 = await categoriesService.create({
        name: `${l1.name} - ${level2Types[j % level2Types.length]}`,
        isActive: true,
        parentId: l1.id,
        sizeType:
          l1.name === 'Ayaqqabı' ? SizeType.AYAQQABI : SizeType.BEDEN_TEXT,
      });
      allLevel2Categories.push(l2);

      // Each L2 gets 5-8 sub-subcategories
      const items = level3Items[l1.name] || level3Items['Default'];
      const leafCount = 5 + Math.floor(Math.random() * 4);
      for (let k = 0; k < leafCount; k++) {
        const l3 = await categoriesService.create({
          name: items[k % items.length] || `Alt Model ${k + 1}`,
          isActive: true,
          parentId: l2.id,
        });
        allLevel3Categories.push(l3);
      }
    }
  }

  // Pick some categories for the legacy product references in the script
  const cMenShoes = allLevel3Categories[0];
  const cMenClothes = allLevel3Categories[1];
  const cWomenShoes = allLevel3Categories[2];
  const cWomenAccessories = allLevel3Categories[3];

  const allCategories = [
    ...level1Categories,
    ...allLevel2Categories,
    ...allLevel3Categories,
  ];
  const productImages = [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80',
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
    'https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=800&q=80',
    'https://images.unsplash.com/photo-1524289286702-f07229da36f5?w=800&q=80',
  ];

  console.log(
    `Seeding 5 products for each of the ${allCategories.length} categories (Total: ${allCategories.length * 5})...`,
  );

  for (const category of allCategories) {
    const productsToSave: any[] = [];
    for (let i = 1; i <= 5; i++) {
      const p = productRepo.create({
        name: `${category.name} Məhsul ${i}`,
        description: `${category.name} üçün xüsusi dizayn edilmiş premium məhsul. Keyfiyyətli materiallardan hazırlanmışdır.`,
        price: Math.floor(Math.random() * 500) + 10,
        category: { id: category.id },
        isFeatured: i === 1,
        tags: [category.name.split(' ')[0], 'Yeni', 'Premium'],
        variants: { brand: 'Memix', material: 'Premium' },
        images: [
          productImages[Math.floor(Math.random() * productImages.length)],
        ],
        banner: productImages[Math.floor(Math.random() * productImages.length)],
      });
      productsToSave.push(p);
    }

    const savedProducts = await productRepo.save(productsToSave);

    for (const savedP of savedProducts) {
      // Add stocks for both branches
      const colors = ['Qara', 'Ağ', 'Mavi', 'Qırmızı'];
      const sizes =
        category.sizeType === SizeType.AYAQQABI
          ? ['40', '41', '42', '43']
          : category.sizeType === SizeType.BEDEN_TEXT
            ? ['S', 'M', 'L', 'XL']
            : ['STD'];

      const stockEntities: any[] = [];
      const branches = [branch1, branch2];

      for (const branch of branches) {
        stockEntities.push(
          stockRepo.create({
            productId: savedP.id,
            branchId: branch.id,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: sizes[Math.floor(Math.random() * sizes.length)],
            stock: Math.floor(Math.random() * 50) + 5,
          }),
        );
      }

      await stockRepo.save(stockEntities);
      await searchService.indexProduct(savedP);
    }
    console.log(`- Finished category: ${category.name}`);
  }

  console.log('Seed completed successfully!');
  await app.close();
}
bootstrap();
