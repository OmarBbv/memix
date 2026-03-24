import { DataSource } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { typeOrmConfig } from '../../config/typeorm.config';

/**
 * Product Seed
 *
 * Hər kateqoriyaya məhsul əlavə edir.
 * Hansı URL-ə daxil olanda hansı məhsulları görəcəksiniz:
 *
 * /category/qadinlar       → Bütün qadın məhsulları (child-lardan da toplanır)
 *    /category/cins        → "Qara Skinny Cins", "Mavi Mom Cins"
 *    /category/bluzkalar   → "İpək Bluzka", "Pambıq Bluzka"
 *    /category/yubkalar    → "Pileli Midi Yubka"
 *    /category/zara        → "Zara Trençkot", "Zara Əlbisə"
 *    /category/nike        → "Nike Qadın İdman Dəsti"
 *
 * /category/kisiler        → Bütün kişi məhsulları
 *    /category/koynekler   → "Klassik Ağ Köynək", "Slim Fit Köynək"
 *    /category/salvarlar   → "Chino Şalvar"
 *    /category/cinsler     → "Kişi Regular Cins"
 *    /category/zara-2      → "Zara Kişi Blazer"
 *
 * /category/cantalar       → Bütün çanta məhsulları
 *    /category/sirt-cantalari → "Kanken Sırt Çantası"
 *    /category/ciyin-cantalari → "Dəri Çiyin Çantası"
 *
 * /category/aksesuarlar    → Bütün aksesuar məhsulları
 *    /category/biju        → "Pandora Bilərzik", "Swarovski Boyunbağı"
 *    /category/saatlar     → "Casio Qol Saatı"
 *
 * /category/ayaqqabilar    → Bütün ayaqqabı məhsulları
 *    /category/idman-ayaqqabilari → "Nike Air Max", "Adidas Ultraboost"
 *    /category/zerif-ayaqqabilar  → "Klassik Dəri Ayaqqabı"
 *
 * /category/usaqlar        → Bütün uşaq məhsulları
 *    /category/korpeler    → "Körpə Bodi Dəsti"
 *    /category/kicik-usaqlar → "Uşaq Pambıq Tişört"
 */

const productsData = [
  // ===== QADINLAR =====
  // Cins (ID: 20)
  {
    name: 'Qara Skinny Cins',
    price: 45,
    categoryId: 20,
    description: 'Yüksək belli, dar kəsim qadın cinsi',
    banner:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600',
    variants: {
      brand: 'Zara',
      size: ['XS', 'S', 'M', 'L'],
      color: 'Qara',
      condition: 'Yeni',
    },
  },
  {
    name: 'Mavi Mom Cins',
    price: 55,
    categoryId: 20,
    description: 'Rahat kəsim retro stil cins şalvar',
    banner:
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600',
    variants: {
      brand: 'H&M',
      size: ['S', 'M', 'L', 'XL'],
      color: 'Mavi',
      condition: 'Çox yaxşı',
    },
  },

  // Bluzkalar (ID: 17)
  {
    name: 'İpək Bluzka',
    price: 85,
    categoryId: 17,
    description: 'Zərif ipək parçadan hazırlanmış bluzka',
    banner:
      'https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=600',
    variants: {
      brand: 'Massimo Dutti',
      size: ['S', 'M', 'L'],
      color: 'Krem',
      condition: 'Yeni',
    },
  },
  {
    name: 'Pambıq Bluzka',
    price: 35,
    categoryId: 17,
    description: '100% pambıq, gündəlik geyim üçün ideal',
    banner:
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600',
    variants: {
      brand: 'Stradivarius',
      size: ['XS', 'S', 'M'],
      color: 'Ağ',
      condition: 'Yeni',
    },
  },

  // Yubkalar (ID: 23)
  {
    name: 'Pileli Midi Yubka',
    price: 65,
    categoryId: 23,
    description: 'Klassik pileli midi yubka',
    banner:
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600',
    variants: {
      brand: 'Mango',
      size: ['S', 'M', 'L'],
      color: 'Bej',
      condition: 'Yeni',
    },
  },

  // Zara (Qadın Brendlər) (ID: 27)
  {
    name: 'Zara Trençkot',
    price: 120,
    categoryId: 27,
    description: 'Klassik bej rəngli trençkot, payız/qış mövsümü üçün',
    banner:
      'https://images.unsplash.com/photo-1583336663277-620dc1996580?w=600',
    variants: {
      brand: 'Zara',
      size: ['S', 'M', 'L', 'XL'],
      color: 'Bej',
      condition: 'Etiketli',
    },
  },
  {
    name: 'Zara Əlbisə',
    price: 95,
    categoryId: 27,
    description: 'Zərif axşam əlbisəsi, qara rəng',
    banner:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600',
    variants: {
      brand: 'Zara',
      size: ['XS', 'S', 'M'],
      color: 'Qara',
      condition: 'Yeni',
    },
  },

  // Nike (Qadın Brendlər) (ID: 29)
  {
    name: 'Nike Qadın İdman Dəsti',
    price: 150,
    categoryId: 29,
    description: 'Rahat idman geyim dəsti',
    banner:
      'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600',
    variants: {
      brand: 'Nike',
      size: ['S', 'M', 'L'],
      color: 'Bənövşəyi',
      condition: 'Yeni',
    },
  },

  // ===== KİŞİLƏR =====
  // Köynəklər (ID: 47)
  {
    name: 'Klassik Ağ Köynək',
    price: 40,
    categoryId: 47,
    description: 'İşgüzar görünüş üçün klassik ağ köynək',
    banner:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600',
    variants: {
      brand: 'Massimo Dutti',
      size: ['M', 'L', 'XL'],
      color: 'Ağ',
      condition: 'Yeni',
    },
  },
  {
    name: 'Slim Fit Köynək',
    price: 35,
    categoryId: 47,
    description: 'Dar kəsim casual köynək',
    banner:
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600',
    variants: {
      brand: 'H&M',
      size: ['S', 'M', 'L'],
      color: 'Göy',
      condition: 'Çox yaxşı',
    },
  },

  // Şalvarlar (ID: 45)
  {
    name: 'Chino Şalvar',
    price: 50,
    categoryId: 45,
    description: 'Rahat kəsim chino şalvar',
    banner:
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600',
    variants: {
      brand: 'Bershka',
      size: ['M', 'L', 'XL'],
      color: 'Bej',
      condition: 'Yeni',
    },
  },

  // Cinslər (ID: 46)
  {
    name: 'Kişi Regular Cins',
    price: 60,
    categoryId: 46,
    description: 'Klassik kəsim kişi cinsi',
    banner: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',
    variants: {
      brand: "Levi's",
      size: ['30', '32', '34', '36'],
      color: 'Tünd mavi',
      condition: 'Yeni',
    },
  },

  // Zara (Kişi Brendlər) (ID: 55)
  {
    name: 'Zara Kişi Blazer',
    price: 110,
    categoryId: 55,
    description: 'Slim fit blazer ceket',
    banner:
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600',
    variants: {
      brand: 'Zara',
      size: ['M', 'L', 'XL'],
      color: 'Qara',
      condition: 'Etiketli',
    },
  },

  // ===== ÇANTALAR =====
  // Sırt çantaları (ID: 63)
  {
    name: 'Kanken Sırt Çantası',
    price: 70,
    categoryId: 63,
    description: 'Fjällräven Kanken klassik sırt çantası',
    banner: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
    variants: { brand: 'Kanken', color: 'Sarı', condition: 'Yeni' },
  },

  // Çiyin çantaları (ID: 64)
  {
    name: 'Dəri Çiyin Çantası',
    price: 90,
    categoryId: 64,
    description: 'Həqiqi dəridən hazırlanmış çiyin çantası',
    banner:
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600',
    variants: { brand: 'Parfois', color: 'Qəhvəyi', condition: 'Çox yaxşı' },
  },

  // ===== AKSESUARLAR =====
  // Biju (ID: 70)
  {
    name: 'Pandora Bilərzik',
    price: 45,
    categoryId: 70,
    description: 'Gümüş bilərzik charm-larla',
    banner:
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600',
    variants: { brand: 'Pandora', condition: 'Yeni' },
  },
  {
    name: 'Swarovski Boyunbağı',
    price: 65,
    categoryId: 70,
    description: 'Kristal boyunbağı',
    banner:
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600',
    variants: { brand: 'Swarovski', condition: 'Yeni' },
  },

  // Saatlar (ID: 71)
  {
    name: 'Casio Qol Saatı',
    price: 80,
    categoryId: 71,
    description: 'Casio klassik qol saatı',
    banner:
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600',
    variants: { brand: 'Casio', color: 'Gümüşü', condition: 'Yeni' },
  },

  // ===== AYAQQABILAR =====
  // İdman ayaqqabıları (ID: 77)
  {
    name: 'Nike Air Max',
    price: 130,
    categoryId: 77,
    description: 'Nike Air Max 90, klassik idman ayaqqabısı',
    banner: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    variants: {
      brand: 'Nike',
      size: ['40', '41', '42', '43', '44'],
      color: 'Qırmızı',
      condition: 'Yeni',
    },
  },
  {
    name: 'Adidas Ultraboost',
    price: 160,
    categoryId: 77,
    description: 'Adidas Ultraboost, rahat qaçış ayaqqabısı',
    banner: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600',
    variants: {
      brand: 'Adidas',
      size: ['41', '42', '43', '44'],
      color: 'Ağ',
      condition: 'Yeni',
    },
  },

  // Zərif ayaqqabılar (ID: 78)
  {
    name: 'Klassik Dəri Ayaqqabı',
    price: 95,
    categoryId: 78,
    description: 'Kişi üçün klassik dəri ayaqqabı',
    banner:
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600',
    variants: {
      brand: 'Massimo Dutti',
      size: ['40', '41', '42', '43'],
      color: 'Qəhvəyi',
      condition: 'Yeni',
    },
  },

  // ===== UŞAQLAR =====
  // Körpələr (ID: 84)
  {
    name: 'Körpə Bodi Dəsti',
    price: 25,
    categoryId: 84,
    description: '3-lü pambıq bodi dəsti, 0-12 ay',
    banner:
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600',
    variants: {
      brand: "Carter's",
      size: ['0-3 ay', '3-6 ay', '6-12 ay'],
      condition: 'Yeni',
    },
  },

  // Kiçik uşaqlar (ID: 85)
  {
    name: 'Uşaq Pambıq Tişört',
    price: 15,
    categoryId: 85,
    description: 'Rəngli pambıq tişört, 2-8 yaş',
    banner:
      'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=600',
    variants: {
      brand: 'H&M Kids',
      size: ['2-3', '4-5', '6-7'],
      color: 'Sarı',
      condition: 'Yeni',
    },
  },
];

async function seed() {
  const dataSource = new DataSource(typeOrmConfig as any);
  await dataSource.initialize();

  const productRepo = dataSource.getRepository(Product);

  console.log('Clearing existing products...');
  await productRepo.query('DELETE FROM products');

  console.log(`Seeding ${productsData.length} products...`);

  for (const data of productsData) {
    const product = productRepo.create({
      name: data.name,
      price: data.price,
      description: data.description,
      banner: data.banner,
      variants: data.variants,
      category: { id: data.categoryId } as any,
      isFeatured: false,
    });
    await productRepo.save(product);
    console.log(`  ✅ ${data.name} → categoryId: ${data.categoryId}`);
  }

  console.log('\n✨ Product seeding completed!');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
