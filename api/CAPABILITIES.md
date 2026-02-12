# 🚀 Memix API - Sistem İmkanları

Hazırkı sistemdə Admin və İstifadəçilər aşağıdakıları edə bilər:

## 👤 İstifadəçi və Admin (Users & Auth)
- **Qeydiyyat və Giriş:** Email/Parol və ya Google ilə giriş.
- **Profil:** İstifadəçi öz profil məlumatlarını görə bilər.
- **Rollara Nəzarət:** Admin istifadəçiləri idarə edə bilər (gələcəkdə).
- **Ünvanlar:** İstifadəçi özünə birdən çox ünvan (Ev, İş) əlavə edə bilər.

## 📦 Məhsullar (Products)
- **Yaratmaq:** Admin yeni məhsul yarada bilər (Ad, Qiymət, Təsvir, Şəkillər, Kateqoriya).
- **Redaktə:** Məhsulun məlumatlarını dəyişmək.
- **Silmək:** Məhsulu sistemdən silmək.
- **Görmək:** Bütün məhsulların siyahısına və ya tək bir məhsula baxmaq.
- **Xüsusiyyətlər:** Məhsula variantlar (Rəng, Ölçü) və etiketlər (Tags) əlavə etmək.

## 📂 Kateqoriyalar (Categories)
- **İdarəetmə:** Admin yeni kateqoriyalar yarada, redaktə edə və silə bilər.
- **İyerarxiya:** Məhsulları kateqoriyalara bölmək (məsələn: Burgerlər, İçkilər).

## 🏢 Filiallar və Stok (Branches & Stock)
- **Filial Yaratmaq:** Admin yeni filiallar (məsələn: "Gənclik", "28 May") yarada bilər.
- **Filialları İdarə Etmək:** Filialın adını, ünvanını dəyişmək və ya silmək.
- **Stok İdarəetməsi:** **(YENİ)** Admin hər filial üçün məhsul sayını (stokunu) ayrı-ayrı təyin edə bilər.
    - *Misal:* "Gənclik filialında 50 ədəd Cola var, amma Nərimanovda bitib."

## 🖼️ Fayl Yükləmə (Uploads)
- **Şəkil Yükləmə:** Məhsul və ya istifadəçi şəkli yükləmək üçün xüsusi sistem. Şəkillər birbaşa serverə yüklənir və URL qaytarır.
