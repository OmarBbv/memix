import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../../components/common/PageMeta";
import { useCreateBanner, useUpdateBanner, useBanners } from "../../../../hooks/useBanners";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import toast from "react-hot-toast";
import { CreateBannerFormValues, createBannerSchema } from "../../../../validations/bannerSchema";
import { BannerLocation } from "../../../../types/banner";
import { useParams } from "react-router";

export default function CreateBanner() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { data: banners, isLoading } = useBanners();
  const banner = banners?.find(b => b.id === Number(id));

  const createMutation = useCreateBanner();
  const updateMutation = useUpdateBanner();

  const { register, handleSubmit, formState: { errors } } = useForm<CreateBannerFormValues>({
    resolver: zodResolver(createBannerSchema),
    defaultValues: {
      title: "",
      description: "",
      tag: "",
      location: BannerLocation.HOME_MAIN_SLIDER,
      isActive: true,
      order: 0,
    },
    values: banner ? {
      title: banner.title,
      description: banner.description || "",
      tag: banner.tag || "",
      location: banner.location || BannerLocation.HOME_MAIN_SLIDER,
      isActive: banner.isActive,
      order: banner.order,
    } : undefined,
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (data.tag) formData.append("tag", data.tag);
    formData.append("location", data.location);
    formData.append("isActive", String(data.isActive));
    formData.append("order", String(data.order || 0));

    if (data.imageUrl && data.imageUrl.length > 0 && typeof data.imageUrl[0] === 'object') {
      formData.append("image", data.imageUrl[0]);
    }

    if (isEditing && banner) {
      updateMutation.mutate({ id: banner.id, data: formData as any }, {
        onSuccess: () => {
          toast.success("Banner yeniləndi");
          navigate("/marketing/banners");
        }
      });
    } else {
      createMutation.mutate(formData as any, {
        onSuccess: () => {
          toast.success("Banner əlavə edildi");
          navigate("/marketing/banners");
        }
      });
    }
  };

  if (isEditing && isLoading) return <div>Yüklənir...</div>;

  return (
    <>
      <PageMeta title={`Banner ${isEditing ? "Yenilə" : "Əlavə Et"} | Memix Admin`} description="Banner haqqında məlumatlar" />
      <PageBreadcrumb pageTitle={`Banner ${isEditing ? "Yenilə" : "Əlavə Et"}`} />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/3 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-2xl">
          <div>
            <Label htmlFor="title">Başlıq</Label>
            <Input id="title" {...register("title")} error={!!errors.title} hint={errors.title?.message} />
          </div>
          <div>
            <Label htmlFor="description">Mətn (Köməkçi sözlər)</Label>
            <Input id="description" {...register("description")} />
          </div>
          <div>
            <Label htmlFor="tag">Taq (məs: Xüsusi Təklif)</Label>
            <Input id="tag" {...register("tag")} />
          </div>
          <div>
            <Label htmlFor="image">Fon Şəkli</Label>
            <Input type="file" id="image" accept="image/*" {...register("imageUrl")} />
          </div>
          <div>
            <Label htmlFor="location">Mövqe</Label>
            <select {...register("location")} className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-300">
              {Object.values(BannerLocation).map(loc => {
                const labels: Record<string, string> = {
                  [BannerLocation.HOME_MAIN_SLIDER]: "Ana Səhifə Əsas Slayder",
                  [BannerLocation.HOME_MIDDLE]: "Ana Səhifə Orta",
                  [BannerLocation.SIDEBAR]: "Yan Panel (Sidebar)",
                  [BannerLocation.CATEGORY_HEADER]: "Kateqoriya Başlığı",
                };
                return <option key={loc} value={loc}>{labels[loc] || loc}</option>;
              })}
            </select>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="isActive" className="w-5 h-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500" {...register("isActive")} />
            <Label htmlFor="isActive" className="mb-0">Aktivdir</Label>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Button className="w-full sm:w-auto" type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              Yadda saxla
            </Button>
            <Button variant="outline" type="button" onClick={() => navigate("/marketing/banners")} className="w-full sm:w-auto">
              Ləğv et
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
