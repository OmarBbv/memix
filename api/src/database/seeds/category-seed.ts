import { DataSource } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { typeOrmConfig } from '../../config/typeorm.config';
import { generateSlug } from '../../common/utils/slug.util';

const categoryData = [
  {
    name: 'Qadınlar',
    children: [
      {
        name: 'Populyar',
        children: [
          'Bu gün əlavə edilənlər',
          'Ən aşağı qiymətlər',
          'Ən çox bəyənilənlər',
          '🔥 Günün tapıntıları',
          'Qış klassikləri',
          'Ceketlər, paltolar və jiletlər',
          'Qışın rahatlığında',
          '🇹🇭 Tommy Hilfiger Shop'
        ]
      },
      {
        name: 'Qadın geyimləri',
        children: [
          'Trenco',
          'Üzgüçülük geyimləri',
          'Alt geyim',
          'Bluzkalar',
          'Ponço və boksro',
          'Kombinezonlar',
          'Cins',
          'Yeleklər',
          'Jiletlər',
          'Yubkalar',
          'Dəri ceketlər',
          'Kostyumlar',
          'Şortlar',
          'Paltolar'
        ]
      },
      {
        name: 'Brendlər',
        children: [
          'Zara',
          'Tommy Hilfiger',
          'Nike',
          'Pinko',
          'Karl Lagerfeld',
          'Bütün brendləri gör'
        ]
      },
      {
        name: 'Şəxsi vaucherlər',
        children: ['FRESH']
      },
      {
        name: 'Saxlanılmış filtrlər',
        children: ['Saxlanılmış filtrlərinizi görmək üçün profilə daxil olun.']
      }
    ]
  },
  {
    name: 'Kişilər',
    children: [
      {
        name: 'Populyar',
        children: ['Bu gün əlavə edilənlər', 'Ən aşağı qiymətlər', 'Ən çox bəyənilənlər']
      },
      {
        name: 'Kişi geyimləri',
        children: [
          'Kostyumlar',
          'Ceketlər',
          'Şalvarlar',
          'Cinslər',
          'Köynəklər',
          'T-shirtlər',
          'Paltolar',
          'Jaketlər',
          'Üzgüçülük geyimləri',
          'Alt geyim',
          'Şortlar'
        ]
      },
      {
        name: 'Brendlər',
        children: ['Zara', 'Tommy Hilfiger', 'Nike']
      }
    ]
  },
  {
    name: 'Çantalar',
    children: [
      {
        name: 'Populyar',
        children: ['Bu gün əlavə edilənlər', 'Ən aşağı qiymətlər']
      },
      {
        name: 'Çanta növləri',
        children: ['Sırt çantaları', 'Çiyin çantaları']
      }
    ]
  },
  {
    name: 'Aksesuarlar',
    children: [
      {
        name: 'Populyar',
        children: ['Bu gün əlavə edilənlər', 'Ən aşağı qiymətlər']
      },
      {
        name: 'Növlər',
        children: ['Biju', 'Saatlar']
      }
    ]
  },
  {
    name: 'Ayaqqabılar',
    children: [
      {
        name: 'Populyar',
        children: ['Bu gün əlavə edilənlər', 'Ən aşağı qiymətlər']
      },
      {
        name: 'Növlər',
        children: ['İdman ayaqqabıları', 'Zərif ayaqqabılar']
      }
    ]
  },
  {
    name: 'Uşaqlar',
    children: [
      {
        name: 'Populyar',
        children: ['Bu gün əlavə edilənlər', 'Ən aşağı qiymətlər']
      },
      {
        name: 'Yaş qrupları',
        children: ['Körpələr', 'Kiçik uşaqlar']
      }
    ]
  }
];

async function seed() {
  const dataSource = new DataSource(typeOrmConfig as any);
  await dataSource.initialize();

  const categoryRepo = dataSource.getRepository(Category);

  console.log('Clearing existing categories...');
  await categoryRepo.query('TRUNCATE TABLE categories RESTART IDENTITY CASCADE');

  console.log('Seeding categories...');

  for (const [parentOrder, parentData] of categoryData.entries()) {
    const parent = categoryRepo.create({
      name: parentData.name,
      slug: generateSlug(parentData.name),
      order: parentOrder,
      isActive: true,
      showOnHome: true,
      imageUrl: `/cat${parentOrder + 1}.jpeg`
    });

    const savedParent = await categoryRepo.save(parent);

    if (parentData.children) {
      for (const [childOrder, childData] of parentData.children.entries()) {
        const child = categoryRepo.create({
          name: childData.name,
          slug: generateSlug(`${savedParent.name}-${childData.name}`),
          order: childOrder,
          isActive: true,
          parent: savedParent
        });

        const savedChild = await categoryRepo.save(child);

        if (childData.children) {
          for (const [leafOrder, leafName] of childData.children.entries()) {
            const leaf = categoryRepo.create({
              name: leafName,
              slug: generateSlug(`${savedParent.name}-${childData.name}-${leafName}`),
              order: leafOrder,
              isActive: true,
              parent: savedChild
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

seed().catch(err => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
