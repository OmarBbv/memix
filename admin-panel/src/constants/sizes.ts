import { SizeType } from "../types/category";

export const SIZE_OPTIONS: Record<SizeType, string[]> = {
  [SizeType.BEDEN_TEXT]: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"],
  [SizeType.BEDEN_NUMERIC]: ["28", "30", "32", "34", "36", "38", "40", "42", "44", "46", "48", "50", "52", "54", "56"],
  [SizeType.AYAQQABI]: ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"],
  [SizeType.UZUK]: ["14", "15", "16", "17", "18", "19", "20", "21", "22"],
  [SizeType.TEK_OLCU]: ["STD"],
  [SizeType.YAS_GRUPU]: [
    "0-3 ay", "3-6 ay", "6-9 ay", "9-12 ay", "12-18 ay", "18-24 ay", 
    "2-3 yaş", "3-4 yaş", "4-5 yaş", "5-6 yaş", "6-7 yaş", "7-8 yaş", 
    "8-9 yaş", "9-10 yaş", "10-11 yaş", "11-12 yaş"
  ],
};
