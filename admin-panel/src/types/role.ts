export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions: string[];
  isActive: boolean;
}

export interface IRolesService {
  getAll(): Promise<Role[]>;
  create(role: Partial<Role>): Promise<Role>;
  update(id: number, role: Partial<Role>): Promise<Role>;
  delete(id: number): Promise<void>;
}

export const PERMISSION_LIST = [
  { id: 'view:dashboard', name: 'Dashboard' },

  { id: 'view:users', name: 'İstifadəçiləri Görmək' },
  { id: 'create:users', name: 'İstifadəçi Yaratmaq' },
  { id: 'edit:users', name: 'İstifadəçi Redaktəsi' },
  { id: 'delete:users', name: 'İstifadəçi Silmək' },

  { id: 'view:products', name: 'Məhsulları Görmək' },
  { id: 'create:products', name: 'Məhsul Yaratmaq' },
  { id: 'edit:products', name: 'Məhsul Redaktəsi' },
  { id: 'delete:products', name: 'Məhsul Silmək' },

  { id: 'view:categories', name: 'Kateqoriyaları Görmək' },

  { id: 'view:orders', name: 'Sifarişləri Görmək' },
  { id: 'edit:orders', name: 'Sifariş Redaktəsi' },

  { id: 'view:marketing', name: 'Marketinqi Görmək' },

  { id: 'view:warehouse', name: 'Anbar Qeydlərini Görmək' },
  { id: 'create:warehouse', name: 'Anbar Qeydi Yaratmaq' },

  { id: 'view:analytics', name: 'Statistikanı Görmək' },

  { id: 'view:settings', name: 'Tənzimləmələri Görmək' },
  { id: 'edit:settings', name: 'Tənzimləmələri Dəyişmək' },

  { id: 'manage:roles', name: 'Rolların İdarəedilməsi' }
];
