import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../src/config/typeorm.config';
import { Category } from '../src/categories/entities/category.entity';
import { Product } from '../src/products/entities/product.entity';
import { ProductStock } from '../src/products/entities/product-stock.entity';
import { ProductColorVariant } from '../src/products/entities/product-color-variant.entity';
import { LISTING_TYPE } from '../src/products/enums/listing.type.enum';

async function seed() {
  const dataSource = new DataSource(typeOrmConfig as any);
  await dataSource.initialize();

  const categoryRepo = dataSource.getRepository(Category);
  const productRepo = dataSource.getRepository(Product);
  const stockRepo = dataSource.getRepository(ProductStock);
  const colorRepo = dataSource.getRepository(ProductColorVariant);
  const brandRepo = dataSource.getRepository('brands');

  console.log('--- 🚀 COMPREHENSIVE SEEDING STARTED ---');

  // 1. Ölçü tiplərini kateqoriyalara bağlayaq
  const sizeTypeMappings: Record<string, string> = {
    'ayaqqabi': 'ayaqqabi',
    'futbolka': 'beden-text',
    'salvar': 'beden-numeric',
    'kemer': 'tek-olcu',
    'usaq-paltari': 'yas-grupu',
    'don': 'beden-text',
    'koynek': 'beden-text',
    'pencek': 'beden-text',
    'papaq': 'tek-olcu',
    'etek': 'beden-numeric',
  };

  const categories = await categoryRepo.find();
  for (const cat of categories) {
    if (sizeTypeMappings[cat.slug]) {
      cat.sizeType = sizeTypeMappings[cat.slug];
      await categoryRepo.save(cat);
    }
  }

  // 2. Data Bankı
  const colorPalette = [
    'Qara', 'Ağ', 'Qırmızı', 'Mavi', 'Yaşıl', 'Sarı', 'Bənövşəyi', 'Narıncı', 
    'Bordo', 'Antrasit', 'Bej', 'Ekru', 'Firuzəyi', 'Xaki', 'Qəhvəyi', 'Gümüşü', 
    'Qızılı', 'Çəhrayı', 'Lila', 'Indiqo', 'Tütün', 'Mint'
  ];

  const sizeValues: Record<string, string[]> = {
    'beden-text': ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
    'beden-numeric': ['28', '30', '32', '34', '36', '38', '40', '42', '44', '46'],
    'ayaqqabi': ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
    'uzuk': ['12', '14', '16', '18', '20', '22'],
    'tek-olcu': ['Standart'],
    'yas-grupu': ['0-3 ay', '3-6 ay', '6-12 ay', '1-2 yaş', '2-3 yaş', '4-5 yaş', '6-7 yaş'],
  };

  const materials = ['Pambıq', 'Dəri', 'İpək', 'Keten', 'Yün', 'Polyester', 'Denim'];
  const fits = ['Slim Fit', 'Regular Fit', 'Oversize', 'Relaxed Fit', 'Skinny'];
  const genders = ['Kişi', 'Qadın', 'Unisex', 'Uşaq'];
  const conditions = ['Yeni', 'Etiketli', 'Çox yaxşı', 'Yaxşı', 'Yeni kimi'];

  const images = [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600',
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600',
  ];

  const brands = await brandRepo.find();

  console.log('🧹 Clearing existing store data...');
  await productRepo.query('DELETE FROM products'); 

  // --- 2.5 Alt Kateqoriyaların yaradılması (Yeni Məntiq) ---
  const parentSubMappings: Record<string, string[]> = {
    'ayaqqabi': ['İdman ayaqqabısı', 'Klassik ayaqqabı', 'Botlar'],
    'futbolka': ['Polo Futbolka', 'V-yaxa Futbolka', 'Printli Futbolka'],
    'salvar': ['Cins Şalvar', 'Klassik Şalvar', 'Kargo Şalvar'],
    'canta': ['Sırt çantası', 'Əl çantası', 'Cüzdanlar'],
  };

  for (const [parentSlug, subNames] of Object.entries(parentSubMappings)) {
    const parent = await categoryRepo.findOne({ where: { slug: parentSlug } });
    if (parent) {
      console.log(`🌿 Creating subcategories for: ${parent.name}`);
      for (const subName of subNames) {
        const subSlug = subName.toLowerCase().replace(/ /g, '-');
        let sub = await categoryRepo.findOne({ where: { slug: subSlug } });
        if (!sub) {
          sub = categoryRepo.create({
            name: subName,
            slug: subSlug,
            parent: parent,
            sizeType: parent.sizeType, // Miras al
            isActive: true
          });
          await categoryRepo.save(sub);
        }
      }
    }
  }

  // Bütün kateqoriyaları (yaxınlarda yaradılanlar daxil) yenidən çəkək
  const allCategories = await categoryRepo.find();

  // 3. Kateqoriya üzrə Professional Seeding
  for (const cat of allCategories) {
    const productCount = Math.floor(Math.random() * (12 - 5 + 1)) + 5;
    console.log(`📦 Adding products to category: ${cat.name}`);

    for (let i = 1; i <= productCount; i++) {
        const selectedBrand = brands[Math.floor(Math.random() * brands.length)];
        const selectedGender = genders[Math.floor(Math.random() * genders.length)];
        const selectedListingType = Math.random() > 0.4 ? LISTING_TYPE.NEW : LISTING_TYPE.USED;
        const skuBase = `${cat.slug.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

        const product = productRepo.create({
            name: `${selectedBrand?.name || 'Memix'} ${cat.name} - Model ${i}`,
            description: `Bu ${cat.name} yüksək keyfiyyətli materiallardan hazırlanmışdır. ${selectedGender} üçün nəzərdə tutulub. Rahatlıq və stili bir arada təqdim edir.`,
            price: Math.floor(Math.random() * 450) + 25,
            sku: `${skuBase}-${i}`,
            barcode: `869${Math.floor(1000000000 + Math.random() * 9000000000)}`,
            gender: selectedGender,
            weight: Number((Math.random() * 2).toFixed(2)),
            category: cat,
            brand: selectedBrand as any,
            listingType: selectedListingType,
            isActive: true,
            isFeatured: Math.random() > 0.8,
            banner: images[Math.floor(Math.random() * images.length)],
            tags: [cat.slug, 'premium', 'yeni-sezon', selectedGender.toLowerCase()],
            attributes: {
                material: materials[Math.floor(Math.random() * materials.length)],
                fit: fits[Math.floor(Math.random() * fits.length)],
                origin: 'Türkiyə'
            },
            variants: {
                condition: conditions[Math.floor(Math.random() * conditions.length)]
            }
        });

        const savedProduct = await productRepo.save(product);

        // --- Rəng və Ölçü Variantları (Complex Logic) ---
        const colorCount = Math.floor(Math.random() * 4) + 1; // Hər məhsula 1-4 arası rəng
        const selectedColors = [...colorPalette].sort(() => 0.5 - Math.random()).slice(0, colorCount);

        for (const colorName of selectedColors) {
            const colorVariant = await colorRepo.save({
                product: savedProduct,
                color: colorName,
                images: [
                    images[Math.floor(Math.random() * images.length)],
                    images[Math.floor(Math.random() * images.length)]
                ]
            });

            // Ölçü tipinə görə stok
            const stType = cat.sizeType || 'beden-text';
            const possibleSizes = sizeValues[stType] || sizeValues['beden-text'];
            
            // Hər rəng üçün 3-5 fərqli ölçü olsun (stokda olanlar)
            const numSizes = Math.floor(Math.random() * 5) + 2;
            const selectedSizes = [...possibleSizes].sort(() => 0.5 - Math.random()).slice(0, numSizes);

            for (const sizeVal of selectedSizes) {
                await stockRepo.save({
                    product: savedProduct,
                    colorVariant: colorVariant,
                    size: sizeVal,
                    stock: Math.floor(Math.random() * 30) + 1
                });
            }
        }
    }
  }

  console.log('\n--- ✨ DATABASE IS NOW FULL & PROFESSIONAL! ---');
  await dataSource.destroy();
}

seed().catch(err => {
  console.error('❌ SEED ERROR:', err);
  process.exit(1);
});
