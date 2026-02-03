
export interface Product {
  id: number;
  title: string;
  price: number;
  oldPrice?: number;
  image: string;
  brand: string;
  size?: string;
  condition?: string;
  city?: string;
  storePriceFactor?: number;
  category: 'women' | 'men' | 'kids' | 'bags' | 'shoes' | 'accessories';
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Qara rəngli ziyafət donu',
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
    price: 25,
    brand: 'Zara',
    storePriceFactor: 1.5,
    category: 'women'
  },
  {
    id: 2,
    title: 'Oversize pambıq köynək',
    image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=800&auto=format&fit=crop&q=80",
    price: 45,
    brand: 'H&M',
    storePriceFactor: 1.8,
    category: 'women'
  },
  {
    id: 3,
    title: 'Klassik bej rəngli trençkot',
    image: "https://images.unsplash.com/photo-1583336663277-620dc1996580?w=800&auto=format&fit=crop&q=80",
    price: 120,
    brand: 'Mango',
    storePriceFactor: 2.5,
    category: 'women'
  },
  {
    id: 4,
    title: 'Yüksək belli cins şalvar',
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80",
    price: 35,
    brand: 'Stradivarius',
    storePriceFactor: 1.6,
    category: 'women'
  },
  {
    id: 5,
    title: 'Qışlıq Yün Palto',
    image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800&auto=format&fit=crop&q=80",
    price: 85,
    brand: 'Massimo Dutti',
    storePriceFactor: 2.2,
    category: 'women'
  },

  // MEN (IDs: 100-199)
  {
    id: 100,
    title: 'Klassik Kostyum',
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80",
    price: 150,
    brand: 'Zara Man',
    storePriceFactor: 1.8,
    category: 'men'
  },
  {
    id: 101,
    title: 'Cin Gödəkçə',
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&auto=format&fit=crop&q=80",
    price: 60,
    brand: 'Pull&Bear',
    storePriceFactor: 1.5,
    category: 'men'
  },
  {
    id: 102,
    title: 'Klassik Köynək',
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
    price: 30,
    brand: 'H&M',
    storePriceFactor: 1.4,
    category: 'men'
  },
  {
    id: 103,
    title: 'Bej Şalvar',
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80",
    price: 40,
    brand: 'Bershka',
    storePriceFactor: 1.6,
    category: 'men'
  },

  // KIDS (IDs: 200-299)
  {
    id: 200,
    title: 'Körpə üçün bodi',
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop&q=80",
    price: 12,
    brand: 'Zara Kids',
    storePriceFactor: 1.5,
    category: 'kids'
  },
  {
    id: 201,
    title: 'Zolaqlı Tişört',
    image: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=800&auto=format&fit=crop&q=80",
    price: 15,
    brand: 'H&M Kids',
    storePriceFactor: 1.3,
    category: 'kids'
  },
  {
    id: 202,
    title: 'Çiçəkli yay donu',
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80",
    price: 35,
    brand: 'Mango Kids',
    storePriceFactor: 1.7,
    category: 'kids'
  },
  {
    id: 203,
    title: 'Qışlıq Gödəkçə',
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop&q=80",
    price: 45,
    brand: 'Gap',
    storePriceFactor: 1.9,
    category: 'kids'
  },
  {
    id: 204,
    title: 'Qırmızı Yağmurluq',
    image: "https://images.unsplash.com/photo-1604467794349-0b74285de7e7?w=800&auto=format&fit=crop&q=80",
    price: 50,
    brand: 'Next',
    storePriceFactor: 1.6,
    category: 'kids'
  },
  {
    id: 205,
    title: 'Pambıq Pijama Dəsti',
    image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&auto=format&fit=crop&q=80",
    price: 20,
    brand: 'Carter\'s',
    storePriceFactor: 1.4,
    category: 'kids'
  },
  {
    id: 206,
    title: 'Uşaq Kedləri',
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    price: 40,
    brand: 'Converse',
    storePriceFactor: 1.8,
    category: 'kids'
  },
  {
    id: 207,
    title: 'Rəngli Papaq',
    image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&auto=format&fit=crop&q=80",
    price: 10,
    brand: 'Benetton',
    storePriceFactor: 2.0,
    category: 'kids'
  },

  // BAGS (IDs: 300-399)
  {
    id: 300,
    title: 'Dəri Əl Çantası',
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&auto=format&fit=crop&q=80",
    price: 55,
    brand: 'Zara',
    storePriceFactor: 1.6,
    category: 'bags'
  },
  {
    id: 301,
    title: 'Məxmər Çanta',
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
    price: 40,
    brand: 'Parfois',
    storePriceFactor: 1.4,
    category: 'bags'
  },
  {
    id: 302,
    title: "Sarı Sırt Çantası",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    price: 35,
    brand: "Kanken",
    storePriceFactor: 2.0,
    category: 'bags'
  },

  // ACCESSORIES (IDs: 400-499)
  {
    id: 400,
    title: 'Zərif Boyunbağı',
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80",
    price: 25,
    brand: 'Pandora',
    storePriceFactor: 2.0,
    category: 'accessories'
  },
  {
    id: 401,
    title: 'Qızıl Üzük Seti',
    image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&auto=format&fit=crop&q=80",
    price: 45,
    brand: 'Cartier',
    storePriceFactor: 2.5,
    category: 'accessories'
  },
  {
    id: 402,
    title: 'Mirvari Sırğalar',
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80",
    price: 30,
    brand: 'Swarovski',
    storePriceFactor: 1.8,
    category: 'accessories'
  },
  {
    id: 403,
    title: 'Gümüş Qolbaq',
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&auto=format&fit=crop&q=80",
    price: 55,
    brand: 'Tiffany & Co.',
    storePriceFactor: 3.0,
    category: 'accessories'
  },
  {
    id: 404,
    title: 'Minimalist Boyunbağı',
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&auto=format&fit=crop&q=80",
    price: 20,
    brand: 'H&M',
    storePriceFactor: 1.5,
    category: 'accessories'
  },
  {
    id: 405,
    title: 'Brilliant Qaşlı Üzük',
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80",
    price: 120,
    brand: 'Vugar J.',
    storePriceFactor: 1.6,
    category: 'accessories'
  },
  {
    id: 406,
    title: 'Müasir Dizayn Sırğa',
    image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&auto=format&fit=crop&q=80",
    price: 28,
    brand: 'Mango',
    storePriceFactor: 1.4,
    category: 'accessories'
  },
  {
    id: 407,
    title: 'Zəncir Boyunbağı',
    image: "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=800&auto=format&fit=crop&q=80",
    price: 35,
    brand: 'Zara',
    storePriceFactor: 1.7,
    category: 'accessories'
  },

  // SHOES (IDs: 500-599)
  {
    id: 500,
    title: 'Qəhvəyi Klassik Ayaqqabı',
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80",
    price: 65,
    brand: 'Massimo Dutti',
    storePriceFactor: 2.1,
    category: 'shoes'
  },
  {
    id: 501,
    title: 'Dəri Çəkmə',
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop&q=80",
    price: 90,
    brand: 'Dr. Martens',
    storePriceFactor: 1.8,
    category: 'shoes'
  },
  {
    id: 502,
    title: "Qırmızı İdman Ayaqqabısı",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
    price: 80,
    brand: "Nike",
    storePriceFactor: 1.7,
    category: 'shoes'
  }
];
