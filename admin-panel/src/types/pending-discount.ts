export interface PendingDiscount {
  productId: number;
  productName: string;
  brandId: number | null;
  brandName: string | null;
  listingType: string;
  daysListed: number;
  suggestedPercentage: number;
  currentPrice: number;
  suggestedPrice: number;
  createdAt: string;
}
