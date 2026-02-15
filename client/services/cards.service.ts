import { httpClientPrivate } from "@/lib/httpClient";
import { Card, CreateCardRequest } from "@/types/card.types";
import { CardsServiceTypes } from "@/types/card.service.types";

class CardsService implements CardsServiceTypes {
  async getAll(): Promise<Card[]> {
    try {
      const response = await httpClientPrivate.get('/cards');
      return response.data;
    } catch (error) {
      console.error("CardsService getAll error:", error);
      throw error;
    }
  }

  async create(data: CreateCardRequest): Promise<Card> {
    try {
      const response = await httpClientPrivate.post('/cards', data);
      return response.data;
    } catch (error) {
      console.error("CardsService create error:", error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await httpClientPrivate.delete(`/cards/${id}`);
    } catch (error) {
      console.error("CardsService delete error:", error);
      throw error;
    }
  }
}

export const cardsService = new CardsService();
