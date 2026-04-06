import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ValuationService {
  private readonly logger = new Logger(ValuationService.name);
  private valuations: any[] = [];
  private readonly mapping: Record<string, string> = {
    'POLO': 'POLO',
    'GÖDƏKCƏ': 'GODEKCE',
    'ŞALVAR': 'SALVAR',
    'T-SHIRT': 'T-shirt',
    'KÖYNƏK': 'KOYNEK',
    'PENCƏK': 'PENCEK',
    'KOSTYU': 'KOSTYUM',
    'DON': 'DON',
    'YUXU GEYIMI': 'GECE',
    'GECƏ PALTARI': 'GECE',
    'AYAQQABI': 'AYAQQABI',
    'CANTA': 'CANTA',
    'ÇANTA': 'CANTA',
    'ŞORTIK': 'SORTIK',
    'SORTIK': 'SORTIK',
    'ETEK': 'ETEK',
    'ƏTƏK': 'ETEK',
    'SVITER': 'SVITER',
    'TOLSTOVKA': 'TOLSTOVKA',
    'İDMAN': 'IDMAN',
    'IDMAN': 'IDMAN',
    'USAQ PALTARI': 'USAQ PALTARI',
    'UŞAQ PALTARI': 'USAQ PALTARI',
    'KEMER': 'KEMER',
    'KƏMƏR': 'KEMER',
    'PAPAQ': 'PAPAQ',
    'BRICI': 'BRICI',
    'DUBLENKA': 'DUBLENKA',
    'DUBLYONKA': 'DUBLENKA',
    'JILET': 'JILET ', // Excel has a trailing space in some keys
  };

  constructor() {
    this.loadValuations();
  }

  private loadValuations() {
    try {
      const filePath = path.join(process.cwd(), 'src/database/seeds/brand-valuations.json');
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        this.valuations = JSON.parse(fileContent);
        this.logger.log('✅ Brand valuations loaded successfully.');
      } else {
        this.logger.warn(`⚠️ Brand valuations file not found at ${filePath}`);
      }
    } catch (error) {
      this.logger.error('❌ Error loading brand valuations:', error);
    }
  }

  getValuation(brandName: string, categoryName: string): number | null {
    if (!this.valuations.length) return null;

    // Normallaşdırma
    const normalizedBrand = brandName.trim().toUpperCase();
    const normalizedCatRaw = categoryName.trim().toUpperCase();
    const mappedKey = this.mapping[normalizedCatRaw] || normalizedCatRaw;

    // Excel-də bəzi brendlər fərqli yazıla bilər (məs: PULL & BEAR vs PULL&BEAR)
    const brandData = this.valuations.find(v =>
      v.MARKALAR && v.MARKALAR.trim().toUpperCase() === normalizedBrand
    ) || this.valuations.find(v =>
      v.MARKALAR && v.MARKALAR.trim().toUpperCase().replace(/\s+/g, '') === normalizedBrand.replace(/\s+/g, '')
    );

    if (!brandData) {
      // Əgər brend yoxdursa ADSIZ MALLAR-a baxaq
      const adsizData = this.valuations.find(v => v.MARKALAR === 'ADSIZ MALLAR');
      if (adsizData && adsizData[mappedKey]) {
        return adsizData[mappedKey];
      }
      return null;
    }

    return brandData[mappedKey] || null;
  }
}
