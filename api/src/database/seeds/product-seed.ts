import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../../config/typeorm.config';
import { Product } from '../../products/entities/product.entity';
import { Category } from '../../categories/entities/category.entity';

async function seedProducts() {
  const dataSource = new DataSource(typeOrmConfig as any);
  await dataSource.initialize();

  const productRepo = dataSource.getRepository(Product);
  const categoryRepo = dataSource.getRepository(Category);

  const categories = await categoryRepo.find({
    where: [
      { slug: 'qadinlar' },
      { slug: 'kisiler' }
    ]
  });

  if (categories.length === 0) {
    console.error('Kategoriler bulunamadı!');
    await dataSource.destroy();
    return;
  }

  const brands = ['Zara', 'H&M', 'Mango', 'Bershka', 'Nike', 'Adidas', 'Tommy Hilfiger', 'Pinko', 'Karl Lagerfeld', 'Pull&Bear', 'Massimo Dutti'];
  const colors = ['Qara', 'Ağ', 'Qırmızı', 'Mavi', 'Çəhrayı', 'Yaşıl', 'Bej', 'Lacivert', 'Boz'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const materials = ['Pambıq', 'Dəri', 'İpək', 'Yün', 'Kətan', 'Polyester'];

  console.log('Kategoriler için test ürünleri ekleniyor...');

  const products: Product[] = [];

  for (const category of categories) {
    console.log(`${category.name} kategorisi için 30 ürün ekleniyor...`);

    for (let i = 1; i <= 30; i++) {
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      const material = materials[Math.floor(Math.random() * materials.length)];
      const price = Math.floor(Math.random() * 250) + 20;

      const product = productRepo.create({
        name: `${brand} ${category.name === 'Kişilər' ? 'Kişi' : 'Qadın'} ${material} Geyim ${i}`,
        description: `${brand} brendindən çox keyfiyyətli ${material} materialdan, ${color} rəngdə ${category.name.toLowerCase()} üçün geyim.`,
        price: price,
        stock: Math.floor(Math.random() * 50) + 5,
        category: category,
        banner: '/uploads/banner-1771242663037-447409299.jpeg',
        images: ['/uploads/images-1771242663038-719841696.jpg'],
        variants: {
          brand: brand,
          color: color,
          size: size,
          material: material,
          city: 'Bakı'
        },
        tags: [category.slug, 'yeni', brand.toLowerCase(), color.toLowerCase(), 'bakı'],
        isFeatured: Math.random() > 0.7
      });
      products.push(product);
    }
  }

  await productRepo.save(products);
  console.log(`${products.length} adet ürün başarıyla eklendi!`);
  await dataSource.destroy();
}

seedProducts().catch(err => console.error(err));
