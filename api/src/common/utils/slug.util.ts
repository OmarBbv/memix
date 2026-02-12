import slugify from 'slugify';

export const generateSlug = (text: string): string => {
  return slugify(text, {
    replacement: '-', // Boşluqları bu simvolla əvəz et
    lower: true, // Bütün hərfləri kiçilt
    strict: true, // Xüsusi simvolları sil (yalnız hərflər və rəqəmlər qalsın)
    locale: 'az', // Azərbaycan dili dəstəyi (ə,ö,ğ,ü,ş,ı hərfləri üçün)
    trim: true, // Başlanğıc və sondakı boşluqları sil
  });
};
