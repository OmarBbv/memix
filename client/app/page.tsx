import { CategorySelector } from "@/components/home/CategorySelector";
import { PromoBanners } from "@/components/home/PromoBanners";
import { PromoGrid } from "@/components/home/PromoGrid";
import { CategoryPreview } from "@/components/home/CategoryPreview";
import { BrandSelector } from "@/components/home/BrandSelector";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { FeaturesSection } from "@/components/home/FeaturesSection";

export default function Home() {
  return (
    <div className="space-y-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* <CategorySelector /> */}
        <PromoBanners />
        <PromoGrid />
      </div>
      <BrandSelector />
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        <CategoryPreview />
        <FeaturesSection />
        <NewsletterSignup />
      </div>
    </div>
  );
}
