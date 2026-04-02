import { DataSource } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { typeOrmConfig } from '../../config/typeorm.config';
import { generateSlug } from '../../common/utils/slug.util';

const categoriesToSeed = [
// Image 1
  { name: 'Alt paltarı', skuPrefixUsed: 'A5-A', skuPrefixNew: 'AY1-A' },
  { name: 'Ayaqqabı', skuPrefixUsed: 'A2-A', skuPrefixNew: 'DY1-A' },
  { name: 'Brici', skuPrefixUsed: 'D2-B', skuPrefixNew: 'BY1-B' },
  { name: 'Çanta', skuPrefixUsed: 'A1-Ç', skuPrefixNew: 'DY1-Ç' },
  { name: 'Corab', skuPrefixUsed: 'A6-C', skuPrefixNew: 'AY1-C' },
  { name: 'Çulki', skuPrefixUsed: 'A5-C', skuPrefixNew: 'JY1-C' },
  { name: 'Çimərlik p', skuPrefixUsed: 'D2-Ç', skuPrefixNew: 'BY1-Ç' },
  { name: 'Dəri g', skuPrefixUsed: 'C3-D', skuPrefixNew: 'CY3-D' },
  { name: 'Don', skuPrefixUsed: 'C1-D', skuPrefixNew: 'BY2-D' },
  { name: 'Dublyonka', skuPrefixUsed: 'C3-DB', skuPrefixNew: 'CY3-DB' },
// Image 2
  { name: 'Əlcək', skuPrefixUsed: 'A5-Ə', skuPrefixNew: 'AY1-Ə' },
  { name: 'Ev tekstili', skuPrefixUsed: 'H2-E', skuPrefixNew: 'BY3-E' },
  { name: 'Futbolka', skuPrefixUsed: 'F1-F', skuPrefixNew: 'CY3-F' },
  { name: 'Gecə geyimi', skuPrefixUsed: 'A3-G', skuPrefixNew: 'AY2-G' },
  { name: 'Gödəkcə', skuPrefixUsed: 'D4-G', skuPrefixNew: 'CY2-G' },
  { name: 'İdman', skuPrefixUsed: 'D1-İ', skuPrefixNew: 'AY2-İ' },
  { name: 'İp', skuPrefixUsed: 'A5-İ', skuPrefixNew: null },
  { name: 'Jilet', skuPrefixUsed: 'B2-J', skuPrefixNew: 'CY2-J' },
  { name: 'Kalqotka', skuPrefixUsed: 'A6-K', skuPrefixNew: 'AY1-K' },
  { name: 'Kəmər', skuPrefixUsed: 'A1-K', skuPrefixNew: 'AY2-K' },
  { name: 'Kombinizon', skuPrefixUsed: 'B2-K', skuPrefixNew: null },
// Image 3
  { name: 'Kostyum', skuPrefixUsed: 'C2-K', skuPrefixNew: 'CY1-K' },
  { name: 'Köynək', skuPrefixUsed: 'E2-K', skuPrefixNew: 'DY3-K' },
  { name: 'Oyuncaq', skuPrefixUsed: 'A4-O', skuPrefixNew: 'DY3-O' },
  { name: 'Papaq', skuPrefixUsed: 'A6-P', skuPrefixNew: 'AY2-P' },
  { name: 'Pencək', skuPrefixUsed: 'C2-P', skuPrefixNew: 'CY2-P' },
  { name: 'Polo', skuPrefixUsed: 'B1-P', skuPrefixNew: 'CY3-P' },
  { name: 'Qalstuk', skuPrefixUsed: 'A6-Q', skuPrefixNew: null },
  { name: 'Şal-Şərf', skuPrefixUsed: 'A3-Ş', skuPrefixNew: 'BY-Ş' },
  { name: 'Şalvar', skuPrefixUsed: 'G1-Ş', skuPrefixNew: 'AY3-Ş' },
  { name: 'Şortik', skuPrefixUsed: 'D3-Ş', skuPrefixNew: 'BY1-Ş' },
  { name: 'Sviter', skuPrefixUsed: 'E1-S', skuPrefixNew: 'BY2-S' },
  { name: 'Tolstovka', skuPrefixUsed: 'B2-T', skuPrefixNew: 'DY3-T' },
  { name: 'Uşaq paltarı', skuPrefixUsed: 'B3-U', skuPrefixNew: 'DY2-U' },
  { name: 'Xalat', skuPrefixUsed: 'H2-X', skuPrefixNew: null },
  { name: 'Xəz qarışığı', skuPrefixUsed: 'A4-X', skuPrefixNew: null },
  { name: 'Xəz təbii', skuPrefixUsed: 'C3-X', skuPrefixNew: null },
  { name: 'Xüsusi geyim', skuPrefixUsed: 'C2-X', skuPrefixNew: null },
  { name: 'Yeni İl miksi', skuPrefixUsed: 'İ1-Y', skuPrefixNew: null },
  { name: 'Ətək', skuPrefixUsed: 'E1-Ə', skuPrefixNew: 'CY1-Ə' },
  { name: 'Moto geyim', skuPrefixUsed: 'C2-M', skuPrefixNew: null },
  { name: 'Ov geyimi', skuPrefixUsed: 'C2-O', skuPrefixNew: null },
];

async function seed() {
  const dataSource = new DataSource(typeOrmConfig as any);
  await dataSource.initialize();

  const categoryRepo = dataSource.getRepository(Category);

  console.log('Clearing existing categories...');
  await categoryRepo.query(
    'TRUNCATE TABLE categories RESTART IDENTITY CASCADE',
  );

  console.log('Seeding categories...');

  const usedSlugs = new Set<string>();

  function getUniqueSlug(name: string): string {
    const baseSlug = generateSlug(name);
    let slug = baseSlug;
    let counter = 2;
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    usedSlugs.add(slug);
    return slug;
  }

  for (const [index, catData] of categoriesToSeed.entries()) {
    const cat = categoryRepo.create({
      name: catData.name,
      slug: getUniqueSlug(catData.name),
      order: index,
      isActive: true,
      showOnHome: true,
      imageUrl: null,
      skuPrefixUsed: catData.skuPrefixUsed,
      skuPrefixNew: catData.skuPrefixNew,
    });

    await categoryRepo.save(cat);
  }

  console.log(`Seeding completed successfully! ${categoriesToSeed.length} categories inserted.`);
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
