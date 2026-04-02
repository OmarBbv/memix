export const LISTING_TYPE = {
  NEW: 'new',
  USED: 'used',
} as const;

export type ListingType = (typeof LISTING_TYPE)[keyof typeof LISTING_TYPE]; 