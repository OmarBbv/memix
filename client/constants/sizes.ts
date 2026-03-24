export type SizeType =
  | 'beden-text'      // Paltar, köynək, alt geyim
  | 'beden-numeric'   // Şalvar, cins
  | 'ayaqqabi'        // Ayaqqabı, bot
  | 'uzuk'            // Üzük
  | 'tek-olcu'        // Çanta, kəmər, parfüm
  | 'yas-grupu';      // Uşaq geyimi

export interface SizeOption {
  value: string;
  label: string;
}

export const SIZE_TYPES: Record<SizeType, { title: string; description: string; sizes: SizeOption[] }> = {
  'beden-text': {
    title: 'Bədən ölçüsü',
    description: 'Standart geyim ölçüləri',
    sizes: [
      { value: 'XS', label: 'XS' },
      { value: 'S', label: 'S' },
      { value: 'M', label: 'M' },
      { value: 'L', label: 'L' },
      { value: 'XL', label: 'XL' },
      { value: 'XXL', label: 'XXL' },
      { value: '3XL', label: '3XL' },
    ],
  },
  'beden-numeric': {
    title: 'Nömrə ilə ölçü',
    description: 'Şalvar, cins üçün nömrə ölçüləri',
    sizes: [
      { value: '28', label: '28' },
      { value: '29', label: '29' },
      { value: '30', label: '30' },
      { value: '31', label: '31' },
      { value: '32', label: '32' },
      { value: '33', label: '33' },
      { value: '34', label: '34' },
      { value: '36', label: '36' },
      { value: '38', label: '38' },
      { value: '40', label: '40' },
      { value: '42', label: '42' },
      { value: '44', label: '44' },
    ],
  },
  'ayaqqabi': {
    title: 'Ayaqqabı nömrəsi',
    description: 'Ayaqqabı və bot ölçüləri',
    sizes: [
      { value: '35', label: '35' },
      { value: '36', label: '36' },
      { value: '37', label: '37' },
      { value: '38', label: '38' },
      { value: '39', label: '39' },
      { value: '40', label: '40' },
      { value: '41', label: '41' },
      { value: '42', label: '42' },
      { value: '43', label: '43' },
      { value: '44', label: '44' },
      { value: '45', label: '45' },
    ],
  },
  'uzuk': {
    title: 'Üzük ölçüsü',
    description: 'Üzük və əl aksesuarı ölçüləri',
    sizes: [
      { value: '14', label: '14' },
      { value: '15', label: '15' },
      { value: '16', label: '16' },
      { value: '17', label: '17' },
      { value: '18', label: '18' },
      { value: '19', label: '19' },
      { value: '20', label: '20' },
      { value: '21', label: '21' },
      { value: '22', label: '22' },
    ],
  },
  'tek-olcu': {
    title: 'Standart',
    description: 'Tək ölçülü məhsullar (çanta, kəmər, parfüm)',
    sizes: [
      { value: 'STD', label: 'Standart' },
    ],
  },
  'yas-grupu': {
    title: 'Yaş qrupu',
    description: 'Uşaq geyimləri üçün yaş ölçüləri',
    sizes: [
      { value: '0-3ay', label: '0-3 ay' },
      { value: '3-6ay', label: '3-6 ay' },
      { value: '6-12ay', label: '6-12 ay' },
      { value: '1-2yas', label: '1-2 yaş' },
      { value: '2-3yas', label: '2-3 yaş' },
      { value: '3-4yas', label: '3-4 yaş' },
      { value: '4-5yas', label: '4-5 yaş' },
      { value: '5-6yas', label: '5-6 yaş' },
      { value: '6-7yas', label: '6-7 yaş' },
      { value: '7-8yas', label: '7-8 yaş' },
    ],
  },
};

/**
 * Kateqoriyanın sizeType-na görə ölçüləri qaytarır.
 * Əgər sizeType null/undefined olarsa, fallback olaraq product.variants.size istifadə olunur.
 */
export function getSizesForCategory(sizeType: SizeType | string | null | undefined): SizeOption[] | null {
  if (!sizeType) return null;
  return SIZE_TYPES[sizeType as SizeType]?.sizes || null;
}

/**
 * Ölçü dəyərinin label-ini qaytarır (qaydanin icindeki "1-2 yaş" kimi labelleri tapmaq üçün)
 */
export function getSizeLabel(sizeType: SizeType | string | null | undefined, value: string): string {
  if (!sizeType) return value;
  const config = SIZE_TYPES[sizeType as SizeType];
  if (!config) return value;
  const found = config.sizes.find(s => s.value === value);
  return found?.label || value;
}
