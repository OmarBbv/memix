// import { createConnection, Connection } from 'typeorm';
// import { Category, SizeType } from '../src/categories/entities/category.entity';
// import * as dotenv from 'dotenv';
// import * as path from 'path';

// // Load env
// dotenv.config({ path: path.join(__dirname, '../.env') });

// const categoriesData = [
//   {
//     name: 'Kişi',
//     slug: 'kisi',
//     children: [
//       {
//         name: 'Geyim',
//         slug: 'kisi-geyim',
//         children: [
//           { name: 'Tişört', slug: 'kisi-tisort', sizeType: SizeType.BEDEN_TEXT },
//           { name: 'Şort', slug: 'kisi-sort', sizeType: SizeType.BEDEN_TEXT },
//           { name: 'Köynək', slug: 'kisi-koynek', sizeType: SizeType.BEDEN_TEXT },
//           { name: 'İdman şalvarı', slug: 'kisi-idman-salvari', sizeType: SizeType.BEDEN_TEXT },
//           { name: 'Şalvar', slug: 'kisi-salvar', sizeType: SizeType.BEDEN_NUMERIC },
//           { name: 'Sweatshirt', slug: 'kisi-sweatshirt', sizeType: SizeType.BEDEN_TEXT },
//           { name: 'Jaket', slug: 'kisi-jaket', sizeType: SizeType.BEDEN_TEXT },
//           { name: 'Kostyum', slug: 'kisi-kostyum', sizeType: SizeType.BEDEN_TEXT },
//           { name: 'Mont & Kurtka', slug: 'kisi-mont', sizeType: SizeType.BEDEN_TEXT },
//           { name: 'Palto', slug: 'kisi-palto', sizeType: SizeType.BEDEN_TEXT },
//         ]
//       },
//       {
//         name: 'Ayaqqabı',
//         slug: 'kisi-ayaqqabi',
//         children: [
//           { name: 'İdman ayaqqabısı', slug: 'kisi-idman-ayaqqabisi', sizeType: SizeType.AYAQQABI },
//           { name: 'Gündəlik ayaqqabı', slug: 'kisi-gundelik-ayaqqabi', sizeType: SizeType.AYAQQABI },
//           { name: 'Sneaker', slug: 'kisi-sneaker', sizeType: SizeType.AYAQQABI },
//           { name: 'Klassik ayaqqabı', slug: 'kisi-klassik-ayaqqabi', sizeType: SizeType.AYAQQABI },
//           { name: 'Bot & Çəkmə', slug: 'kisi-bot', sizeType: SizeType.AYAQQABI },
//           { name: 'Sandalet & Təlik', slug: 'kisi-telik', sizeType: SizeType.AYAQQABI },
//           { name: 'Loafer', slug: 'kisi-loafer', sizeType: SizeType.AYAQQABI },
//         ]
//       },
//       {
//         name: 'Çanta',
//         slug: 'kisi-canta',
//         children: [
//           { name: 'Sırt çantası', slug: 'kisi-back-pack', sizeType: SizeType.TEK_OLCU },
//           { name: 'Çiyin çantası', slug: 'kisi-shoulder-bag', sizeType: SizeType.TEK_OLCU },
//           { name: 'Spor çanta', slug: 'kisi-spor-bag', sizeType: SizeType.TEK_OLCU },
//           { name: 'Pul qabı', slug: 'kisi-wallet', sizeType: SizeType.TEK_OLCU },
//           { name: 'Evrak çantası', slug: 'kisi-briefcase', sizeType: SizeType.TEK_OLCU },
//           { name: 'Bel çantası', slug: 'kisi-waist-bag', sizeType: SizeType.TEK_OLCU },
//         ]
//       },
//       {
//         name: 'Aksesuar',
//         slug: 'kisi-aksesuar',
//         children: [
//           { name: 'Saat', slug: 'kisi-saat', sizeType: SizeType.TEK_OLCU },
//           { name: 'Günəş eynəyi', slug: 'kisi-gunes-eyneyi', sizeType: SizeType.TEK_OLCU },
//           { name: 'Kəmər', slug: 'kisi-kemer', sizeType: SizeType.TEK_OLCU },
//           { name: 'Qalstuk', slug: 'kisi-tie', sizeType: SizeType.TEK_OLCU },
//           { name: 'Şarf & Əlcək', slug: 'kisi-scarf', sizeType: SizeType.TEK_OLCU },
//         ]
//       }
//     ]
//   },
//   {
//     name: 'Qadın',
//     slug: 'qadin',
//     children: [
//       {
//         name: 'Geyim',
//         slug: 'qadin-geyim',
//         children: [
//           { name: 'Libas', slug: 'qadin-libas', sizeType: SizeType.BEDEN_TEXT },
//           { name: 'Tişört', slug: 'qadin-tisort', sizeType: SizeType.BEDEN_TEXT },
//           { name: 'Şalvar', slug: 'qadin-salvar', sizeType: SizeType.BEDEN_NUMERIC },
//           { name: 'Yubka', slug: 'qadin-yubka', sizeType: SizeType.BEDEN_TEXT },
//           { name: 'Bluz', slug: 'qadin-bluz', sizeType: SizeType.BEDEN_TEXT },
//           { name: 'Gödəkçə', slug: 'qadin-jaket', sizeType: SizeType.BEDEN_TEXT },
//           { name: 'Cins şalvar', slug: 'qadin-jeans', sizeType: SizeType.BEDEN_NUMERIC },
//           { name: 'Mont', slug: 'qadin-mont', sizeType: SizeType.BEDEN_TEXT },
//           { name: 'Pijama dəstləri', slug: 'qadin-pijama', sizeType: SizeType.BEDEN_TEXT },
//         ]
//       },
//       {
//         name: 'Ayaqqabı',
//         slug: 'qadin-ayaqqabi',
//         children: [
//           { name: 'Hündürdaban ayaqqabı', slug: 'qadin-hundurdaban-ayaqqabi', sizeType: SizeType.AYAQQABI },
//           { name: 'İdman ayaqqabısı', slug: 'qadin-idman-ayaqqabisi', sizeType: SizeType.AYAQQABI },
//           { name: 'Sneaker', slug: 'qadin-sneaker', sizeType: SizeType.AYAQQABI },
//           { name: 'Sandalet', slug: 'qadin-sandalet', sizeType: SizeType.AYAQQABI },
//           { name: 'Balerin', slug: 'qadin-balerin', sizeType: SizeType.AYAQQABI },
//           { name: 'Bot & Çəkmə', slug: 'qadin-bot', sizeType: SizeType.AYAQQABI },
//           { name: 'Sabo & Terlik', slug: 'qadin-sabo', sizeType: SizeType.AYAQQABI },
//           { name: 'Loafer & Babet', slug: 'qadin-loafer', sizeType: SizeType.AYAQQABI },
//         ]
//       },
//       {
//         name: 'Çanta',
//         slug: 'qadin-canta',
//         children: [
//           { name: 'Çiyin çantası', slug: 'qadin-ciyin-cantasi', sizeType: SizeType.TEK_OLCU },
//           { name: 'Sırt çantası', slug: 'qadin-sirt-cantasi', sizeType: SizeType.TEK_OLCU },
//           { name: 'Əl çantası', slug: 'qadin-el-cantasi', sizeType: SizeType.TEK_OLCU },
//           { name: 'Cüzdan', slug: 'qadin-wallet', sizeType: SizeType.TEK_OLCU },
//           { name: 'Abiye çanta', slug: 'qadin-evening-bag', sizeType: SizeType.TEK_OLCU },
//           { name: 'Plaj çantası', slug: 'qadin-beach-bag', sizeType: SizeType.TEK_OLCU },
//         ]
//       }
//     ]
//   },
//   {
//     name: 'Uşaq',
//     slug: 'usaq',
//     children: [
//       {
//         name: 'Körpə (0-2 yaş)',
//         slug: 'korpe-0-2-yas',
//         children: [
//           { name: 'Body', slug: 'korpe-body', sizeType: SizeType.YAS_GRUPU },
//           { name: 'Tulum', slug: 'korpe-tulum', sizeType: SizeType.YAS_GRUPU },
//           { name: 'Körpə ayaqqabısı', slug: 'korpe-shoes', sizeType: SizeType.YAS_GRUPU },
//         ]
//       },
//       {
//         name: 'Oğlan uşağı',
//         slug: 'oglan-usaqi',
//         children: [
//           { name: 'Tişört', slug: 'oglan-tisort', sizeType: SizeType.YAS_GRUPU },
//           { name: 'Şalvar', slug: 'oglan-salvar', sizeType: SizeType.YAS_GRUPU },
//           { name: 'İdman ayaqqabısı', slug: 'oglan-shoes', sizeType: SizeType.AYAQQABI },
//         ]
//       },
//       {
//         name: 'Qız uşağı',
//         slug: 'qiz-usaqi',
//         children: [
//           { name: 'Libas', slug: 'qiz-libas', sizeType: SizeType.YAS_GRUPU },
//           { name: 'Yubka', slug: 'qiz-yubka', sizeType: SizeType.YAS_GRUPU },
//           { name: 'Qadın ayaqqabı', slug: 'qiz-shoes', sizeType: SizeType.AYAQQABI },
//         ]
//       }
//     ]
//   }
// ];

// async function seed() {
//   let connection: Connection;
//   try {
//     connection = await createConnection({
//       type: 'postgres',
//       host: process.env.DB_HOST || 'localhost',
//       port: parseInt(process.env.DB_PORT || '5432'),
//       username: process.env.DB_USERNAME || 'postgres',
//       password: process.env.DB_PASSWORD || 'metroboomin2425',
//       database: process.env.DB_DATABASE || 'memix',
//       entities: [path.join(__dirname, '../src/**/*.entity{.ts,.js}')],
//       synchronize: false,
//     });

//     console.log('Connected to database for expanded seeding...');
//     const categoryRepo = connection.getRepository(Category);

//     async function processCategories(items: any[], parent: Category | null = null) {
//       for (const item of items) {
//         let category = await categoryRepo.findOne({ where: { slug: item.slug } });
        
//         if (!category) {
//           category = categoryRepo.create({
//             name: item.name,
//             slug: item.slug,
//             sizeType: item.sizeType || null,
//             parent: parent as any,
//           });
//           category = await categoryRepo.save(category);
//           console.log(`Created: ${category.name}`);
//         } else {
//           // Update existing to ensure SizeType is correct
//           category.sizeType = item.sizeType || category.sizeType;
//           await categoryRepo.save(category);
//           console.log(`Updated/Skipped: ${category.name}`);
//         }

//         if (item.children && item.children.length > 0) {
//           await processCategories(item.children, category);
//         }
//       }
//     }

//     await processCategories(categoriesData);
//     console.log('Successfully seeded expanded categories!');

//   } catch (error) {
//     console.error('Error seeding categories:', error);
//   } finally {
//     if (connection!) await connection.close();
//   }
// }

// seed();
