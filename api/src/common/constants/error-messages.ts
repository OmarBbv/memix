export enum ErrorMessages {
  // İstifadəçi xətaları (User errors)
  USER_NOT_FOUND = 'İstifadəçi tapılmadı',
  USER_ALREADY_EXISTS = 'Bu e-poçt ünvanı ilə istifadəçi artıq mövcuddur',

  // Autentifikasiya xətaları (Authentication errors)
  INVALID_CREDENTIALS = 'E-poçt və ya şifrə yanlışdır',
  UNAUTHORIZED = 'İcazəsiz giriş',
  TOKEN_EXPIRED = 'Sessiya müddəti bitdi, yenidən daxil olun',
  PASSWORD_REQUIRED = 'Şifrə mütləq daxil edilməlidir',

  // İcazə xətaları (Permission errors)
  FORBIDDEN_RESOURCE = 'Bu resursa daxil olmaq üçün icazəniz yoxdur',
  ADMIN_ROLE_REQUIRED = 'Yalnız administratorlar bu əməliyyatı yerinə yetirə bilər',

  // Server xətaları (Server errors)
  INTERNAL_SERVER_ERROR = 'Daxili server xətası baş verdi, zəhmət olmasa biraz sonra yenidən cəhd edin',

  // Məhsul xətaları
  PRODUCT_NOT_FOUND = 'Məhsul tapılmadı',
  CATEGORY_NOT_FOUND = 'Kateqoriya tapılmadı',
}
