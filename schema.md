//User

User {
  name: string;            // Ad (örn: 'Nadir')
  surname: string;         // Soyad (örn: 'Həbibov')
  email: string;           // E-posta adresi
  phone: string;           // Telefon numarası
  birthday: {              // Doğum Tarihi
    day: string;
    month: string;
    year: string;
  };
  gender: 'male' | 'female'; // Cinsiyet (Kişi/Qadın)
  role: 'user' | 'admin'; // Rol (Kullanıcı/Yönetici)
}

//Sepet Öğesi (CartItem)

CartItem {
  id: string | number;     // Ürün ID'si
  title: string;           // Ürün adı
  price: number;           // Fiyat
  image: string;           // Görsel URL
  size: string;            // Seçilen beden
  quantity: number;        // Adet (Sepette kaç tane olduğu)
  seller?: {               // Satıcı bilgisi (opsiyonel)
    name: string;
  };
}

//Address

Address {
  id: string;              // Benzersiz adres ID'si (tahmini)
  title: string;           // Adres Başlığı (örn: 'Ev', 'İş')
  contactName: string;     // İletişim kurulacak kişi (örn: 'Nadir Həbibov')
  addressLine1: string;    // Açık adres satırı 1 (Cadde, sokak)
  addressLine2?: string;   // Açık adres satırı 2 (Daire, blok vb.)
  city: string;            // Şehir (örn: 'Bakı')
  country: string;         // Ülke (örn: 'Azərbaycan')
  phone: string;           // İletişim telefonu
}

//Order

Order {
  id: string;              // Sipariş No (örn: 'ORD-293812')
  date: string;            // Sipariş Tarihi (örn: '15 Yanvar 2026')
  status: 'delivered' | 'shipping' | 'processing'; // Durum (Teslim Edildi, Kargoda, Hazırlanır)
  totalAmount: number;     // Toplam Tutar
  items: string;           // Ürün özet bilgisi (Normalde Product[] dizisi olmalı)
  mainImage: string;       // Siparişi temsil eden ana görsel
}


//product

Product {
  id: number;              // Benzersiz kimlik (örn: 1)
  title: string;           // Ürün adı (örn: 'Qara rəngli ziyafət donu')
  price: number;           // Fiyat (örn: 25)
  oldPrice?: number;       // İsteğe bağlı eski fiyat (indirim için)
  image: string;           // Ürün görsel URL'i
  brand: string;           // Marka (örn: 'Zara')
  size?: string;           // Beden (örn: 'M')
  condition?: string;      // Durum (örn: 'Yeni', 'İkinci El')
  city?: string;           // Şehir
  storePriceFactor?: number; // Mağaza fiyat çarpanı
  category: 'women' | 'men' | 'kids' | 'bags' | 'shoes' | 'accessories';
}

//Category

Category {
  id: number;              // Benzersiz kimlik (örn: 1)
  name: string;            // Kategori adı (örn: 'Kadın')
  slug: string;            // URL'de kullanılan kısa ad (örn: 'kadın')
  image?: string;           // Kategori görsel URL'i
}