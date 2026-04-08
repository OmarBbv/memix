import { DataSource } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Category } from '../../categories/entities/category.entity';
import { Brand } from '../../brands/entities/brand.entity';
import { ProductColorVariant } from '../../products/entities/product-color-variant.entity';
import { ProductStock } from '../../products/entities/product-stock.entity';
import { typeOrmConfig } from '../../config/typeorm.config';
import { LISTING_TYPE } from '../../products/enums/listing.type.enum';

const productsData = [
  {
    name: 'Zara Polo Köynək (Premium)',
    description: 'Yüksək keyfiyyətli, 100% pambıqdan hazırlanmış premium polo köynək. Gündəlik və işgüzar tərz üçün ideal seçimdir.',
    price: 55.00,
    categorySlug: 'kisi',
    brandName: 'Zara',
    tags: ['polo', 'zara', 'yeni', 'pambıq', 'kisi'],
    variants: [
      {
        color: 'Göy',
        images: ['https://images.unsplash.com/photo-1586363104862-3a5e2ca60d99?w=800'],
        sizes: [{ size: 'S', stock: 12 }, { size: 'M', stock: 15 }, { size: 'L', stock: 8 }, { size: 'XL', stock: 5 }]
      }
    ]
  },
  {
    name: 'Nike Air Max 270 (Kişi)',
    description: 'Maksimum rahatlıq və stil bir arada. Nike Air texnologiyası ilə gün boyu yorulmadan hərəkət edin.',
    price: 245.00,
    categorySlug: 'kisi',
    brandName: 'Nike',
    tags: ['nike', 'airmax', 'idman', 'sneaker', 'kisi'],
    variants: [
      {
        color: 'Qara/Qırmızı',
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
        sizes: [{ size: '41', stock: 5 }, { size: '42', stock: 8 }, { size: '43', stock: 10 }]
      }
    ]
  },
  {
    name: 'H&M Kətan Şalvar (Kişi)',
    description: 'Yaz və yay ayları üçün yüngül kətan şalvar. Rahat kəsim və nəfəs alan parça.',
    price: 49.90,
    categorySlug: 'kisi',
    brandName: 'H&M',
    tags: ['ketan', 'salvar', 'summer', 'hm', 'kisi'],
    variants: [
      {
        color: 'Bej',
        images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800'],
        sizes: [{ size: '30', stock: 6 }, { size: '32', stock: 12 }, { size: '34', stock: 8 }]
      }
    ]
  },
  {
    name: 'Klassik Ağ Köynək (Slim Fit)',
    description: 'İşgüzar görüşlər üçün ideal, yüksək keyfiyyətli ağ köynək.',
    price: 39.00,
    categorySlug: 'kisi',
    brandName: 'Zara',
    tags: ['koynek', 'klassik', 'zara', 'kisi'],
    variants: [
      {
        color: 'Ağ',
        images: ['https://images.unsplash.com/photo-1596755094514-f87034a26ef4?w=800'],
        sizes: [{ size: 'M', stock: 10 }, { size: 'L', stock: 15 }]
      }
    ]
  },
  {
    name: 'Göy Denim Şalvar (Loose Fit)',
    description: 'Müasir kəsimli, rahat denim şalvar.',
    price: 65.00,
    categorySlug: 'kisi',
    brandName: 'Levi\'s',
    tags: ['cins', 'salvar', 'denim', 'kisi'],
    variants: [
      {
        color: 'Göy',
        images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800'],
        sizes: [{ size: '32', stock: 20 }, { size: '34', stock: 15 }]
      }
    ]
  },
  {
    name: 'Dəri Pencək (Qara)',
    description: '100% təbii dəridən hazırlanmış qara rəngli modern pencək.',
    price: 180.00,
    categorySlug: 'kisi',
    brandName: 'Mango',
    tags: ['deri', 'pencek', 'qara', 'kisi'],
    variants: [
      {
        color: 'Qara',
        images: ['https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800'],
        sizes: [{ size: 'L', stock: 5 }, { size: 'XL', stock: 3 }]
      }
    ]
  },
  {
    name: 'İdman Şortu (Nike Pro)',
    description: 'Aktiv idman üçün nəzərdə tutulmuş yüngül və nəfəs alan şort.',
    price: 45.00,
    categorySlug: 'kisi',
    brandName: 'Nike',
    tags: ['idman', 'sort', 'nike', 'kisi'],
    variants: [
      {
        color: 'Tünd Göy',
        images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800'],
        sizes: [{ size: 'M', stock: 25 }, { size: 'L', stock: 20 }]
      }
    ]
  },
  {
    name: 'Yun Sviter (Boz)',
    description: 'Soyuq havalar üçün isti və yumşaq yun sviter.',
    price: 85.00,
    categorySlug: 'kisi',
    brandName: 'Massimo Dutti',
    tags: ['yun', 'sviter', 'boz', 'kisi'],
    variants: [
      {
        color: 'Boz',
        images: ['https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?w=800'],
        sizes: [{ size: 'M', stock: 8 }, { size: 'L', stock: 12 }]
      }
    ]
  },
  {
    name: 'Klassik Kəmər (Dəri)',
    description: 'Hər növ şalvarla uyğunlaşan zərif dəri kəmər.',
    price: 25.00,
    categorySlug: 'kisi',
    brandName: 'Zara',
    tags: ['kemer', 'deri', 'klassik', 'kisi'],
    variants: [
      {
        color: 'Qəhvəyi',
        images: ['https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800'],
        sizes: [{ size: '100', stock: 50 }, { size: '110', stock: 30 }]
      }
    ]
  },
  {
    name: 'Bomber Gödəkcə (Yaşıl)',
    description: 'Klassik bomber dizaynı, yüngül yağışa davamlı material.',
    price: 95.00,
    categorySlug: 'kisi',
    brandName: 'Pull & Bear',
    tags: ['godekce', 'bomber', 'yasil', 'kisi'],
    variants: [
      {
        color: 'Xaki',
        images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800'],
        sizes: [{ size: 'S', stock: 10 }, { size: 'M', stock: 15 }, { size: 'L', stock: 10 }]
      }
    ]
  },
  {
    name: 'Kətan Köynək (Mavi)',
    description: 'Yay aylarının vazkeçilməzi, mavi kətan köynək.',
    price: 45.00,
    categorySlug: 'kisi',
    brandName: 'H&M',
    tags: ['ketan', 'koynek', 'mavi', 'kisi'],
    variants: [
      {
        color: 'Açıq Mavi',
        images: ['https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=800'],
        sizes: [{ size: 'M', stock: 18 }, { size: 'L', stock: 12 }]
      }
    ]
  },
  {
    name: 'T-Shirt (Oversize)',
    description: 'Rahat və geniş kəsimli ağ T-shirt.',
    price: 25.00,
    categorySlug: 'kisi',
    brandName: 'Bershka',
    tags: ['tshirt', 'oversize', 'ag', 'kisi'],
    variants: [
      {
        color: 'Ağ',
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
        sizes: [{ size: 'S', stock: 30 }, { size: 'M', stock: 40 }, { size: 'L', stock: 25 }]
      }
    ]
  },
  {
    name: 'Hoodie (Qara)',
    description: 'İstiliyi qoruyan, yumşaq içlikli qara hoodie.',
    price: 55.00,
    categorySlug: 'kisi',
    brandName: 'Nike',
    tags: ['hoodie', 'nike', 'qara', 'kisi'],
    variants: [
      {
        color: 'Qara',
        images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'],
        sizes: [{ size: 'M', stock: 15 }, { size: 'L', stock: 10 }]
      }
    ]
  },
  {
    name: 'Cargo Şalvar (Bej)',
    description: 'Çoxcibli, funksional cargo şalvar.',
    price: 70.00,
    categorySlug: 'kisi',
    brandName: 'Zara',
    tags: ['cargo', 'salvar', 'bej', 'kisi'],
    variants: [
      {
        color: 'Bej',
        images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800'],
        sizes: [{ size: '32', stock: 12 }, { size: '34', stock: 10 }]
      }
    ]
  },
  {
    name: 'İdman Ayaqqabısı (Adidas Stan Smith)',
    description: 'Klassik dizaynlı, hər gün üçün rahat ağ sneaker.',
    price: 130.00,
    categorySlug: 'kisi',
    brandName: 'Adidas',
    tags: ['adidas', 'sneaker', 'ag', 'kisi'],
    variants: [
      {
        color: 'Ağ/Yaşıl',
        images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800'],
        sizes: [{ size: '42', stock: 10 }, { size: '43', stock: 5 }]
      }
    ]
  },
  {
    name: 'Beysbol Papagı (NY)',
    description: 'Şəhər üslubunda, tənzimlənən beysbol papagı.',
    price: 20.00,
    categorySlug: 'kisi',
    brandName: 'New Era',
    tags: ['papaq', 'ny', 'kisi'],
    variants: [
      {
        color: 'Göy',
        images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800'],
        sizes: [{ size: 'Standart', stock: 100 }]
      }
    ]
  },
  {
    name: 'Yüngül Trençkot (Boz)',
    description: 'Payız mövsümü üçün ideal, klassik kəsimli trençkot.',
    price: 150.00,
    categorySlug: 'kisi',
    brandName: 'Mango',
    tags: ['trenckot', 'payiz', 'boz', 'kisi'],
    variants: [
      {
        color: 'Boz',
        images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800'],
        sizes: [{ size: 'L', stock: 5 }, { size: 'XL', stock: 2 }]
      }
    ]
  },
  {
    name: 'Jogger Şalvar (Nike Air)',
    description: 'Gündəlik rahatlıq üçün yumşaq materiallı jogger.',
    price: 60.00,
    categorySlug: 'kisi',
    brandName: 'Nike',
    tags: ['jogger', 'nike', 'rahat', 'kisi'],
    variants: [
      {
        color: 'Göy',
        images: ['https://images.unsplash.com/photo-1552066344-24632e509313?w=800'],
        sizes: [{ size: 'M', stock: 20 }, { size: 'L', stock: 15 }]
      }
    ]
  },
  {
    name: 'Klassik Çəkmə (Dəri)',
    description: 'Formal geyimlərlə uyğunlaşan, parlaq dəri çəkmə.',
    price: 140.00,
    categorySlug: 'kisi',
    brandName: 'Derimod',
    tags: ['cekme', 'deri', 'klassik', 'kisi'],
    variants: [
      {
        color: 'Qara',
        images: ['https://images.unsplash.com/photo-1614252332242-7c30999554a3?w=800'],
        sizes: [{ size: '42', stock: 8 }, { size: '43', stock: 6 }]
      }
    ]
  },
  {
    name: 'Piknik Səbəti Köynəyi (Ekoseli)',
    description: 'Qaba falan, ekoseli yay köynəyi.',
    price: 35.00,
    categorySlug: 'kisi',
    brandName: 'H&M',
    tags: ['koynek', 'ekoseli', 'hm', 'kisi'],
    variants: [
      {
        color: 'Qırmızı ekoseli',
        images: ['https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=800'],
        sizes: [{ size: 'M', stock: 10 }, { size: 'L', stock: 5 }]
      }
    ]
  }
];

async function seed() {
  const dataSource = new DataSource(typeOrmConfig as any);
  await dataSource.initialize();

  const productRepo = dataSource.getRepository(Product);
  const categoryRepo = dataSource.getRepository(Category);
  const brandRepo = dataSource.getRepository(Brand);
  const variantRepo = dataSource.getRepository(ProductColorVariant);
  const stockRepo = dataSource.getRepository(ProductStock);

  console.log('🧹 Clearing existing products and related data...');
  await dataSource.query('TRUNCATE products CASCADE');

  console.log(`🌱 Seeding ${productsData.length} core products...`);

  for (const data of productsData) {
    const category = await categoryRepo.findOne({ where: { slug: data.categorySlug } });
    if (!category) {
      console.warn(`⚠️ Category not found for slug: ${data.categorySlug}. Skipping: ${data.name}`);
      continue;
    }

    const slug = data.brandName.toLowerCase().replace(/ /g, '-');
    let brand = await brandRepo.findOne({ 
      where: [
        { name: data.brandName },
        { slug: slug }
      ]
    });
    
    if (!brand) {
      brand = brandRepo.create({ name: data.brandName, slug: slug });
      await brandRepo.save(brand);
    }

    const product = productRepo.create({
      name: data.name,
      description: data.description,
      price: data.price,
      banner: data.variants[0].images[0],
      category: category,
      brand: brand,
      tags: data.tags,
      isActive: true,
      isFeatured: true,
      listingType: LISTING_TYPE.NEW,
      images: data.variants.flatMap(v => v.images)
    });

    const savedProduct = await productRepo.save(product);
    console.log(`  ✅ Product: ${savedProduct.name}`);

    for (const vData of data.variants) {
      const variant = variantRepo.create({
        product: savedProduct,
        color: vData.color,
        images: vData.images
      });
      const savedVariant = await variantRepo.save(variant);
      console.log(`    🎨 Variant: ${savedVariant.color}`);

      for (const sData of vData.sizes) {
        const stock = stockRepo.create({
          product: savedProduct,
          colorVariant: savedVariant,
          size: sData.size,
          stock: sData.stock
        });
        await stockRepo.save(stock);
      }
    }
  }

  console.log('\n✨ Product seeding completed successfully!');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Error during seeding:', err);
  process.exit(1);
});
