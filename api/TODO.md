# 📋 Memix API - Qalan İşlər

## ✅ Tamamlananlar
- [x] İstifadəçi idarəetməsi (Users)
- [x] Autentifikasiya (Auth - JWT, Google)
- [x] Məhsullar (Products)
- [x] Kateqoriyalar (Categories)
- [x] Filiallar və Stok (Branches & Stock)
- [x] Səbət (Cart)
- [x] Sifarişlər (Orders)
- [x] Şəkil yükləmə (Uploads)
- [x] Bütün modullar üçün Unit testlər

## 🔴 Prioritet 1 - Vacib Funksiyalar

### 💳 Ödəniş İnteqrasiyası
- [ ] Stripe inteqrasiyası
- [ ] PayPal inteqrasiyası
- [ ] Yerli ödəniş sistemləri (Kapital Bank, Paşa Bank)
- [ ] Ödəniş statusu izləmə
- [ ] Ödəniş tarixçəsi

### 📧 Email Bildirişləri
- [x] Nodemailer konfiqurasiyası
- [x] Sifariş təsdiqi emaili
- [x] Şifrə sıfırlama emaili
- [x] Xoş gəldin emaili
- [x] Email şablonları (templates)

### 🔔 Real-time Bildirişlər (WebSocket)
- [x] Socket.io inteqrasiyası
- [x] Yeni sifariş bildirişi (Admin)
- [x] Sifariş statusu bildirişi (Müştəri)
- [x] Online istifadəçi sayı
- [ ] Kurye GPS izləmə
- [ ] Chat sistemi

### 👨‍🍳 Kurye Sistemi
- [ ] Kurye entity-si
- [ ] Kurye qeydiyyatı və girişi
- [ ] Sifarişi kuryeyə təyin etmə
- [ ] Kurye statusu (aktiv, məşğul, offline)
- [ ] GPS koordinat izləmə (opsional)

## 🟡 Prioritet 2 - Əlavə Funksiyalar

### ⭐ Rəy və Reytinq
- [x] Review entity-si
- [x] Məhsullara ulduz vermək (1-5)
- [x] Şərh yazmaq
- [x] Rəyləri təsdiqləmə (admin)
- [x] Ortalama reytinq hesablama

### ❤️ İstək Siyahısı (Wishlist)
- [x] Wishlist entity-si
- [x] Məhsul əlavə etmə/silmə
- [x] İstək siyahısını görüntüləmə
- [x] Səbətə köçürmə

### 🎫 Kupon və Endirim
- [x] Coupon entity-si
- [x] Promo kod yaratma
- [x] Endirim növləri (faiz, məbləğ)
- [x] Kupon validasiyası
- [x] İstifadə limiti

### 📊 Statistika və Hesabatlar
- [x] Satış statistikası (günlük, aylıq)
- [x] Ən çox satılan məhsullar
- [x] Gəlir hesabatları
- [x] İstifadəçi aktivliyi
- [x] Filial üzrə performans

## 🟢 Prioritet 3 - Təkmilləşdirmələr

### 🔍 Axtarış və Filtrləmə
- [ ] Elasticsearch inteqrasiyası
- [ ] Tam mətn axtarışı (Full-text search)
- [ ] Axtarış tarixçəsi
- [ ] Populyar axtarışlar

### 📱 Push Bildirişlər
- [ ] Firebase Cloud Messaging (FCM)
- [ ] Mobil bildirişlər
- [ ] Bildiriş parametrləri

### 🌐 Çoxdillilik (i18n)
- [ ] Azərbaycan dili
- [ ] İngilis dili
- [ ] Rus dili

### 🔐 Təhlükəsizlik
- [ ] Rate limiting
- [ ] CORS konfiqurasiyası
- [ ] Helmet.js
- [ ] SQL injection qorunması
- [ ] XSS qorunması

### 📝 Sənədləşdirmə
- [ ] Swagger/OpenAPI
- [ ] API sənədləri
- [ ] Postman kolleksiyası

## 🎨 Frontend İşləri

### Admin Paneli
- [ ] Dashboard
- [ ] Məhsul idarəetməsi
- [ ] Sifariş idarəetməsi
- [ ] İstifadəçi idarəetməsi
- [ ] Statistika görünüşləri

### Müştəri Paneli
- [ ] Ana səhifə
- [ ] Məhsul kataloqu
- [ ] Məhsul detayları
- [ ] Səbət
- [ ] Sifariş tarixçəsi
- [ ] Profil parametrləri

### Kurye Paneli
- [ ] Aktiv sifarişlər
- [ ] Sifariş qəbulu
- [ ] Naviqasiya
- [ ] Tarixçə

## 🚀 DevOps və Deploy

- [ ] Docker konfiqurasiyası
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Production environment
- [ ] Monitoring (Sentry, LogRocket)
- [ ] Backup strategiyası
