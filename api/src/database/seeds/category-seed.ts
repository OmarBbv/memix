import { DataSource } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { typeOrmConfig } from '../../config/typeorm.config';
import { generateSlug } from '../../common/utils/slug.util';

const topCategories = [
  'Qadınlar',
  'Kişilər',
  'Uşaqlar',
  'Elektronika',
  'Ev və Yaşam',
  'Kosmetika',
  'İdman və Açıq Hava',
  'Ayaqqabı və Çanta',
  'Supermarket',
  'Avtomobil və Motosikl',
];

const subCategoryPrefixes = [
  'Geyim',
  'Ayaqqabı',
  'Aksesuar',
  'Kosmetika və Baxım',
  'Yeni Gələnlər',
  'Populyar',
  'Seçilmiş',
  'Endirimli',
  'Premium',
  'İxtisaslaşmış Məhsullar',
];

const categoryData = topCategories.map((topName) => {
  return {
    name: topName,
    children: subCategoryPrefixes.map((subPrefix, index) => {
      const subName = `${subPrefix} (${topName})`;
      return {
        name: subName,
        children: Array.from({ length: 10 }).map(
          (_, leafIndex) => `${subPrefix} Tipi ${leafIndex + 1} - ${topName}`,
        ),
      };
    }),
  };
});

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

  for (const [parentOrder, parentData] of categoryData.entries()) {
    const parent = categoryRepo.create({
      name: parentData.name,
      slug: getUniqueSlug(parentData.name),
      order: parentOrder,
      isActive: true,
      showOnHome: true,
      imageUrl: `/cat${parentOrder + 1}.jpeg`,
    });

    const savedParent = await categoryRepo.save(parent);

    if (parentData.children) {
      for (const [childOrder, childData] of parentData.children.entries()) {
        const child = categoryRepo.create({
          name: childData.name,
          slug: getUniqueSlug(childData.name),
          order: childOrder,
          isActive: true,
          parent: savedParent,
        });

        const savedChild = await categoryRepo.save(child);

        if (childData.children) {
          for (const [leafOrder, leafName] of childData.children.entries()) {
            const leaf = categoryRepo.create({
              name: leafName,
              slug: getUniqueSlug(leafName),
              order: leafOrder,
              isActive: true,
              parent: savedChild,
            });
            await categoryRepo.save(leaf);
          }
        }
      }
    }
  }

  console.log('Seeding completed successfully!');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
