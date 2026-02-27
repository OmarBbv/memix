import { httpClientPublic } from "../lib/httpClient";
import { PromotionsResponse } from "../types/promotions.types";
import { PromotionsServiceTypes } from "../types/promotions.service.types";

class PromotionsService implements PromotionsServiceTypes {
  async getPromotions(): Promise<PromotionsResponse> {
    try {
      const { data } = await httpClientPublic.get("/promotions");
      return data;
    } catch (error) {
      console.error("PromotionsService getPromotions error:", error);
      throw error;
    }
  }
}

export const promotionsService = new PromotionsService();
