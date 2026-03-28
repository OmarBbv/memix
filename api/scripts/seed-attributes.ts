import { createConnection, Connection, In } from 'typeorm';
import { Category } from '../src/categories/entities/category.entity';
import { Attribute } from '../src/attributes/entities/attribute.entity';
import { AttributeOption } from '../src/attributes/entities/attribute-option.entity';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const attributesData = [
  {
    name: 'Materyal',
    options: ['Pambıq', 'Poliester', 'Lycra', 'Dəri', 'Süni Dəri', 'Kətan', 'Yun', 'İpək', 'Viskon'],
    categorySlugs: ['kisi-geyim', 'qadin-geyim', 'kisi-ayaqqabi', 'qadin-ayaqqabi', 'kisi-canta', 'qadin-canta']
  },
  {
    name: 'Kalıp',
    options: ['Slim Fit', 'Regular Fit', 'Oversize', 'Relaxed', 'Skinny', 'Classic'],
    categorySlugs: ['kisi-geyim', 'qadin-geyim']
  },
  {
    name: 'Kumaş Tipi',
    options: ['Toxuma', 'Örmə', 'Denim', 'Saten', 'Məxmər', 'Şifon'],
    categorySlugs: ['kisi-geyim', 'qadin-geyim']
  },
  {
    name: 'Yaka Tipi',
    options: ['V-Yaxa', 'Dairəvi Yaxa', 'Dik Yaxa', 'Polo Yaxa', 'Gömlek Yaxa', 'Kapşonlu'],
    categorySlugs: ['kisi-geyim', 'qadin-geyim']
  },
  {
    name: 'Kol Tipi',
    options: ['Uzun Qol', 'Qısa Qol', 'Qolsuz', 'Sıfır Qol', 'Teleskopik Qol'],
    categorySlugs: ['kisi-geyim', 'qadin-geyim']
  },
  {
    name: 'Desen',
    options: ['Düz', 'Zolaqlı', 'Xallı', 'Naxışlı', 'Loqolu', 'Rəngli'],
    categorySlugs: ['kisi-geyim', 'qadin-geyim', 'kisi-canta', 'qadin-canta']
  },
  {
    name: 'Bağlama Tipi',
    options: ['Bağlı', 'Zəncirli (Fermuar)', 'Düyməli', 'Cırt-cırtlı', 'Bağsız'],
    categorySlugs: ['kisi-ayaqqabi', 'qadin-ayaqqabi', 'kisi-geyim', 'qadin-geyim']
  },
  {
    name: 'Topuk Boyu',
    options: ['Düz (1-4 sm)', 'Orta (5-9 sm)', 'Hündür (10 sm+)', 'Platforma'],
    categorySlugs: ['qadin-ayaqqabi']
  },
  {
    name: 'Bölmə Sayısı',
    options: ['1', '2', '3', '4', '5+'],
    categorySlugs: ['kisi-canta', 'qadin-canta']
  }
];

async function seed() {
  let connection: Connection;
  try {
    connection = await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'metroboomin2425',
      database: process.env.DB_DATABASE || 'memix',
      entities: [path.join(__dirname, '../src/**/*.entity{.ts,.js}')],
      synchronize: false,
    });

    console.log('Connected to database for attribute seeding...');
    const attrRepo = connection.getRepository(Attribute);
    const optionRepo = connection.getRepository(AttributeOption);
    const categoryRepo = connection.getRepository(Category);

    for (const item of attributesData) {
      let attribute = await attrRepo.findOne({ 
        where: { name: item.name },
        relations: ['options', 'categories'] 
      });

      if (!attribute) {
        attribute = attrRepo.create({ name: item.name });
        attribute = await attrRepo.save(attribute);
        console.log(`Created Attribute: ${item.name}`);
      }

      // Add options
      for (const optValue of item.options) {
        let option = await optionRepo.findOne({ 
          where: { value: optValue, attribute: { id: attribute.id } } 
        });
        if (!option) {
          option = optionRepo.create({ value: optValue, attribute });
          await optionRepo.save(option);
          console.log(`  Added Option: ${optValue} to ${item.name}`);
        }
      }

      // Link to categories
      const categories = await categoryRepo.find({
        where: { slug: In(item.categorySlugs) }
      });
      
      if (categories.length > 0) {
        attribute.categories = categories;
        await attrRepo.save(attribute);
        console.log(`  Linked ${item.name} to ${categories.length} categories`);
      }
    }

    console.log('Successfully seeded attributes!');

  } catch (error) {
    console.error('Error seeding attributes:', error);
  } finally {
    if (connection!) await connection.close();
  }
}

seed();
