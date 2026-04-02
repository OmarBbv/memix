export interface SizeType {
  id: number;
  name: string;
  slug: string;
}

export interface CreateSizeTypeDto {
  name: string;
}

export interface ISizeTypeService {
  getAll(): Promise<SizeType[]>;
  create(data: CreateSizeTypeDto): Promise<SizeType>;
}
