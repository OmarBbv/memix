import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum BannerLocation {
  HOME_MAIN_SLIDER = 'HOME_MAIN_SLIDER',     // Ana səhifə üst slider
  HOME_MIDDLE = 'HOME_MIDDLE',               // Ana səhifə orta hissə
  SIDEBAR = 'SIDEBAR',                       // Yan panel
  CATEGORY_HEADER = 'CATEGORY_HEADER',       // Kateqoriya başlığı
}

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  tag: string; // Məsələn: "Xüsusi Təklif", "2026 Kolleksiyası"

  @Column({ nullable: true })
  imageUrl: string; // Arxa fon şəkli

  @Column({ nullable: true })
  mobileImageUrl: string; // Mobil üçün xüsusi şəkil (opsional)

  @Column({ nullable: true })
  link: string; // Yönləndiriləcək link

  @Column({ nullable: true })
  buttonText: string; // Düymə mətni (məs: "Kolleksiyanı İncələ")

  @Column({ nullable: true })
  secondaryButtonText: string; // İkinci düymə (əgər varsa)

  @Column({ nullable: true })
  secondaryLink: string; // İkinci düymənin linki

  @Column({
    type: 'enum',
    enum: BannerLocation,
    default: BannerLocation.HOME_MAIN_SLIDER,
  })
  location: BannerLocation;

  @Column({ default: 0 })
  order: number; // Sıralama

  @Column({ default: true })
  isActive: boolean; // Aktiv/Deaktiv

  // Statistikalar və ya Xüsusiyyətlər (JSON formatında)
  // Məsələn: [{ "label": "50% Endirim", "value": "Seçilmiş məhsullarda" }, { "label": "2K+", "value": "Yeni məhsul" }]
  @Column({ type: 'jsonb', nullable: true })
  features: Record<string, any>[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
