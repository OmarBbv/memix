import { Card, CreateCardRequest } from "./card.types";

export interface CardsServiceTypes {
  getAll(): Promise<Card[]>;
  create(data: CreateCardRequest): Promise<Card>;
  delete(id: number): Promise<void>;
}
