import { PromotionsResponse } from "./promotions.types";

export interface PromotionsServiceTypes {
  getPromotions(): Promise<PromotionsResponse>;
}
