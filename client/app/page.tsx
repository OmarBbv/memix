import { CategorySelector } from "@/components/home/CategorySelector";
import { PromoBanners } from "@/components/home/PromoBanners";
import { PromoGrid } from "@/components/home/PromoGrid";
import { CategoryPreview } from "@/components/home/CategoryPreview";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* <CategorySelector /> */}
      <PromoBanners />
      <PromoGrid />
      <CategoryPreview />
    </div>
  );
}
