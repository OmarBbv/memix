# Endirim Sistemi Sənədləşdirməsi (Discount System Documentation)

Bu sənəd layihədəki endirim sisteminin arxa tərəfdə (backend) necə işlədiyini, verilənlər bazası strukturunu və tətbiq olunma məntiqini izah edir.

## 1. Verilənlər Bazası Strukturu (Database Entities)

Endirim sistemi əsasən `discounts` cədvəli və `products` cədvəli arasındakı əlaqə üzərində qurulub.

### Discount Entity (`api/src/discounts/entities/discount.entity.ts`)

`discounts` cədvəli aşağıdakı sütunlara malikdir:

| Sahə Adı (Field) | Tip (Type) | İzahı (Description) |
| :--- | :--- | :--- |
| `id` | `number` | Unikal identifikator. |
| `type` | `enum` | Endirim növü: `percentage` (faiz) və ya `fixed` (sabit məbləğ). Standart: `percentage`. |
| `value` | `decimal` | Endirimin dəyəri. Məsələn, 20 (faiz və ya valyuta). |
| `startDate` | `timestamp` | Endirimin başlama tarixi (boş ola bilər). |
| `endDate` | `timestamp` | Endirimin bitmə tarixi (boş ola bilər). |
| `isActive` | `boolean` | Endirimin aktiv olub-olmadığını göstərir. Standart: `true`. |
| `productId` | `Relation` | Endirimin aid olduğu məhsul (One-to-One əlaqə). |
| `createdAt` | `timestamp` | Yaradılma tarixi. |
| `updatedAt` | `timestamp` | Son yenilənmə tarixi. |

### Product Entity (`api/src/products/entities/product.entity.ts`)

Məhsul cədvəlində endirimlə əlaqəli sahə:

*   **`discount`**: `OneToOne` əlaqəsi. Hər bir məhsulun **yalnız bir** aktiv endirimi ola bilər.

## 2. İş Məntiqi (Business Logic)

Endirim məntiqi `DiscountsService` (`api/src/discounts/discounts.service.ts`) daxilində idarə olunur.

### Endirim Yaratma Prosesi (`create` metodu)

1.  **Məhsulun Yoxlanılması**: İlk öncə sistem `productId` vasitəsilə məhsulun mövcudluğunu yoxlayır.
2.  **Mövcud Endirim Yoxlanışı**: Əgər məhsulun artıq bir endirimi varsa, sistem xəta qaytarır (`BadRequestException`). Bir məhsulda eyni anda yalnız bir endirim qeydi ola bilər.
3.  **Endirimin Yaradılması**: Əgər maneə yoxdursa, yeni `Discount` obyekti yaradılır və `product` ilə əlaqələndirilir.
4.  **Yadda Saxlama**: Məlumat bazaya yazılır.

### Endirim Hesablanması (Frontend tərəfi üçün qeyd)

Backend sadəcə endirim qaydasını saxlayır. Qiymətin hesablanması adətən ya sorğu zamanı (məsələn, Product Service-də) ya da frontend-də edilir:

*   **Percentage**: `Yeni Qiymət = Əsas Qiymət - (Əsas Qiymət * Value / 100)`
*   **Fixed**: `Yeni Qiymət = Əsas Qiymət - Value`

## 3. API İstifadəsı

Endirim yaratmaq üçün istifadə olunan API (nümunə):

**Endpoint**: `POST /discounts`

**Request Body (JSON):**
```json
{
  "productId": 101,
  "type": "percentage",
  "value": 15,
  "startDate": "2024-03-01T00:00:00Z",
  "endDate": "2024-03-10T23:59:59Z",
  "isActive": true
}
```

Bu sorğu göndərildikdə backend yuxarıdakı məntiqə uyğun olaraq endirimi cədvələ əlavə edir.
