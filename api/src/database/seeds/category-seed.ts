import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../../app.module';
import { Category } from '../../categories/entities/category.entity';
import { generateSlug } from '../../common/utils/slug.util';

interface CategorySeedData {
  name: string;
  slug?: string;
  skuPrefixUsed?: string | null;
  skuPrefixNew?: string | null;
  children?: CategorySeedData[];
}

const categoriesToSeed: CategorySeedData[] = [
  {
    name: 'Kişi',
    slug: 'kisi',
    children: [
      {
        name: 'Geyim',
        slug: 'kisi-geyim',
        children: [
          { name: 'Alt paltarı', skuPrefixUsed: 'A5-A', skuPrefixNew: 'AY1-A' },
          { name: 'Brici', skuPrefixUsed: 'D2-B', skuPrefixNew: 'BY1-B' },
          { name: 'Çimərlik geyimi', skuPrefixUsed: 'D2-Ç', skuPrefixNew: 'BY1-Ç' },
          { name: 'Dəri geyimi', skuPrefixUsed: 'C3-D', skuPrefixNew: 'CY3-D' },
          { name: 'Dublyonka', skuPrefixUsed: 'C3-DB', skuPrefixNew: 'CY3-DB' },
          { name: 'Futbolka', skuPrefixUsed: 'F1-F', skuPrefixNew: 'CY3-F' },
          { name: 'Gödəkcə', skuPrefixUsed: 'D4-G', skuPrefixNew: 'CY2-G' },
          { name: 'İdman', skuPrefixUsed: 'D1-İ', skuPrefixNew: 'AY2-İ' },
          { name: 'Jilet', skuPrefixUsed: 'B2-J', skuPrefixNew: 'CY2-J' },
          { name: 'Kombinizon', skuPrefixUsed: 'B2-K', skuPrefixNew: null },
          { name: 'Kostyum', skuPrefixUsed: 'C2-K', skuPrefixNew: 'CY1-K' },
          { name: 'Köynək', skuPrefixUsed: 'E2-K', skuPrefixNew: 'DY3-K' },
          { name: 'Pencək', skuPrefixUsed: 'C2-P', skuPrefixNew: 'CY2-P' },
          { name: 'Polo', skuPrefixUsed: 'B1-P', skuPrefixNew: 'CY3-P' },
          { name: 'Şalvar', skuPrefixUsed: 'G1-Ş', skuPrefixNew: 'AY3-Ş' },
          { name: 'Şortik', skuPrefixUsed: 'D3-Ş', skuPrefixNew: 'BY1-Ş' },
          { name: 'Sviter', skuPrefixUsed: 'E1-S', skuPrefixNew: 'BY2-S' },
          { name: 'Tolstovka', skuPrefixUsed: 'B2-T', skuPrefixNew: 'DY3-T' },
          { name: 'Moto geyim', skuPrefixUsed: 'C2-M', skuPrefixNew: null },
          { name: 'Ov geyimi', skuPrefixUsed: 'C2-O', skuPrefixNew: null },
          { name: 'Xüsusi geyim', skuPrefixUsed: 'C2-X', skuPrefixNew: null },
        ]
      },
      {
        name: 'Ayaqqabı',
        skuPrefixUsed: 'A2-A',
        skuPrefixNew: 'DY1-A'
      },
      {
        name: 'Çanta',
        skuPrefixUsed: 'A1-Ç',
        skuPrefixNew: 'DY1-Ç'
      },
      {
        name: 'Aksesuar',
        slug: 'kisi-aksesuar',
        children: [
          { name: 'Əlcək', skuPrefixUsed: 'A5-Ə', skuPrefixNew: 'AY1-Ə' },
          { name: 'Kəmər', skuPrefixUsed: 'A1-K', skuPrefixNew: 'AY2-K' },
          { name: 'Papaq', skuPrefixUsed: 'A6-P', skuPrefixNew: 'AY2-P' },
          { name: 'Qalstuk', skuPrefixUsed: 'A6-Q', skuPrefixNew: null },
          { name: 'Şal-Şərf', skuPrefixUsed: 'A3-Ş', skuPrefixNew: 'BY-Ş' },
          { name: 'Corab', skuPrefixUsed: 'A6-C', skuPrefixNew: 'AY1-C' },
        ]
      }
    ]
  },
  {
    name: 'Qadın',
    slug: 'qadin',
    children: [
      {
        name: 'Geyim',
        slug: 'qadin-geyim',
        children: [
          { name: 'Alt paltarı', skuPrefixUsed: 'A5-A', skuPrefixNew: 'AY1-A' },
          { name: 'Don', skuPrefixUsed: 'C1-D', skuPrefixNew: 'BY2-D' },
          { name: 'Ətək', skuPrefixUsed: 'E1-Ə', skuPrefixNew: 'CY1-Ə' },
          { name: 'Gecə geyimi', skuPrefixUsed: 'A3-G', skuPrefixNew: 'AY2-G' },
          { name: 'Kalqotka', skuPrefixUsed: 'A6-K', skuPrefixNew: 'AY1-K' },
          { name: 'Çulki', skuPrefixUsed: 'A5-C', skuPrefixNew: 'JY1-C' },
          { name: 'Köynək', skuPrefixUsed: 'E2-K', skuPrefixNew: 'DY3-K' },
          { name: 'Futbolka', skuPrefixUsed: 'F1-F', skuPrefixNew: 'CY3-F' },
          { name: 'Şalvar', skuPrefixUsed: 'G1-Ş', skuPrefixNew: 'AY3-Ş' },
          { name: 'Gödəkcə', skuPrefixUsed: 'D4-G', skuPrefixNew: 'CY2-G' },
        ]
      },
      {
        name: 'Ayaqqabı',
        skuPrefixUsed: 'A2-A',
        skuPrefixNew: 'DY1-A'
      },
      {
        name: 'Çanta',
        skuPrefixUsed: 'A1-Ç',
        skuPrefixNew: 'DY1-Ç'
      }
    ]
  },
  {
    name: 'Uşaq',
    slug: 'usaq',
    children: [
      { name: 'Uşaq paltarı', skuPrefixUsed: 'B3-U', skuPrefixNew: 'DY2-U' },
      { name: 'Oyuncaq', skuPrefixUsed: 'A4-O', skuPrefixNew: 'DY3-O' },
    ]
  },
  {
    name: 'Ümumi / Digər',
    slug: 'umumi',
    children: [
      { name: 'Ev tekstili', skuPrefixUsed: 'H2-E', skuPrefixNew: 'BY3-E' },
      { name: 'Xalat', skuPrefixUsed: 'H2-X', skuPrefixNew: null },
      { name: 'Xəz qarışığı', skuPrefixUsed: 'A4-X', skuPrefixNew: null },
      { name: 'Xəz təbii', skuPrefixUsed: 'C3-X', skuPrefixNew: null },
      { name: 'Yeni İl miksi', skuPrefixUsed: 'İ1-Y', skuPrefixNew: null },
      { name: 'İp', skuPrefixUsed: 'A5-İ', skuPrefixNew: null },
    ]
  }
];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const categoryRepo = dataSource.getRepository(Category);

  console.log('Clearing existing categories...');
  await categoryRepo.query(
    'TRUNCATE TABLE categories RESTART IDENTITY CASCADE',
  );

  console.log('Seeding hierarchical categories...');

  const usedSlugs = new Set<string>();

  function getUniqueSlug(name: string, requestedSlug?: string): string {
    const baseSlug = requestedSlug || generateSlug(name);
    let slug = baseSlug;
    let counter = 2;
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    usedSlugs.add(slug);
    return slug;
  }

  async function seedRecursive(items: CategorySeedData[], parent?: Category) {
    for (const [index, catData] of items.entries()) {
      const cat = categoryRepo.create({
        name: catData.name,
        slug: getUniqueSlug(catData.name, catData.slug),
        order: index,
        isActive: true,
        showOnHome: true,
        imageUrl: null,
        skuPrefixUsed: catData.skuPrefixUsed || null,
        skuPrefixNew: catData.skuPrefixNew || null,
        parent: parent || undefined,
      });

      const savedCat = await categoryRepo.save(cat);
      console.log(`Created category: ${savedCat.name} (Slug: ${savedCat.slug})`);

      if (catData.children && catData.children.length > 0) {
        await seedRecursive(catData.children, savedCat);
      }
    }
  }

  try {
    await seedRecursive(categoriesToSeed);
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
