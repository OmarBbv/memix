import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router";
import { categorySchema } from "../../validations/categorySchema";
import { useCreateCategory, useUpdateCategory, useCategories, useCategory } from "../../hooks/useCategories";
import { useSizeTypes, useCreateSizeType } from "../../hooks/useSizeTypes";
import SearchableSelect from "../../components/ui/select/SearchableSelect";
import toast from "react-hot-toast";
import { allowOnlyNumbers } from "../../utils/inputHelpers";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { ChevronLeftIcon } from "../../icons";

export default function CategoryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: allCategories } = useCategories();
  const { data: categoryData, isLoading: isCategoryLoading } = useCategory(Number(id));
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const { data: sizeTypes } = useSizeTypes();
  const createSizeTypeMutation = useCreateSizeType();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      parentId: null,
      imageUrl: "",
      order: 0,
      isActive: true,
      showOnHome: false,
      sizeType: "",
      skuPrefixUsed: "",
      skuPrefixNew: "",
    },
  });

  useEffect(() => {
    if (isEdit && categoryData) {
      reset({
        name: categoryData.name,
        parentId: (categoryData.parentId as any) || null,
        imageUrl: categoryData.imageUrl || "",
        order: (categoryData.order as any) || 0,
        isActive: categoryData.isActive,
        showOnHome: categoryData.showOnHome || false,
        sizeType: (categoryData as any).sizeType || "",
        skuPrefixUsed: (categoryData as any).skuPrefixUsed || "",
        skuPrefixNew: (categoryData as any).skuPrefixNew || "",
      });
      if (categoryData.imageUrl) {
        setImagePreview(categoryData.imageUrl.startsWith('http') ? categoryData.imageUrl : `${import.meta.env.VITE_APP_API_URL || 'http://localhost:4444'}${categoryData.imageUrl}`);
      }
    }
  }, [categoryData, reset, isEdit]);

  const onSubmit = (values: any) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("parentId", values.parentId ? values.parentId.toString() : "null");
    formData.append("order", values.order.toString());
    formData.append("isActive", values.isActive.toString());
    formData.append("showOnHome", values.showOnHome.toString());
    if (values.sizeType) {
      formData.append("sizeType", values.sizeType);
    }
    if (values.skuPrefixUsed) {
      formData.append("skuPrefixUsed", values.skuPrefixUsed);
    }
    if (values.skuPrefixNew) {
      formData.append("skuPrefixNew", values.skuPrefixNew);
    }

    if (imageFile) {
      formData.append("image", imageFile);
    }

    if (isEdit) {
      updateMutation.mutate(
        { id: Number(id), data: formData as any },
        {
          onSuccess: () => navigate("/categories"),
        }
      );
    } else {
      createMutation.mutate(formData as any, {
        onSuccess: () => navigate("/categories"),
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isEdit && isCategoryLoading) return <div>Yüklənir...</div>;

  return (
    <>
      <div className="mb-5">
        <button
          onClick={() => navigate("/categories")}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-brand-500 dark:text-gray-400"
        >
          <ChevronLeftIcon className="size-5" />
          <span>Geri</span>
        </button>
      </div>

      <PageBreadcrumb pageTitle={isEdit ? "Kateqoriyaya Düzəliş" : "Yeni Kateqoriya"} />

      <div className="grid grid-cols-1">
        <ComponentCard title={isEdit ? "Kateqoriya Məlumatlarını Yenilə" : "Məlumatları daxil edin"}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Name */}
              <div>
                <Label required>Kateqoriya Adı</Label>
                <Input
                  {...register("name")}
                  type="text"
                  placeholder="Məs: Qadın geyimləri"
                  error={!!errors.name}
                  hint={errors.name?.message as string}
                />
              </div>

              {/* Parent Category */}
              <div>
                <Label optional>Üst Kateqoriya</Label>
                <Controller
                  name="parentId"
                  control={control}
                  render={({ field }) => (
                    <SearchableSelect
                      options={
                        allCategories
                          ?.filter((cat) => cat.id !== Number(id))
                          .map((cat) => ({
                            label: cat.name,
                            value: cat.id,
                          })) || []
                      }
                      value={field.value as any}
                      onChange={field.onChange}
                      error={!!errors.parentId}
                      placeholder="Əsas Kateqoriya (Kök)"
                    />
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Size Type */}
              <div>
                <Label optional>Ölçü Tipi</Label>
                <Controller
                  name="sizeType"
                  control={control}
                  render={({ field }) => (
                    <SearchableSelect
                      options={[
                        { label: "Ölçü tipi yoxdur", value: "" },
                        ...(sizeTypes?.map(st => ({ label: st.name, value: st.slug })) || [])
                      ]}
                      value={field.value as any}
                      onChange={(val) => {
                        const strVal = val ? val.toString() : "";
                        const isExisting = sizeTypes?.some(st => st.slug === strVal) || strVal === "";
                        
                        if (!isExisting && strVal !== "") {
                           const loadingToast = toast.loading("Yeni ölçü tipi yaradılır...");
                           createSizeTypeMutation.mutate({ name: strVal }, {
                             onSuccess: (newSize) => {
                               toast.success("Ölçü tipi yaradıldı!", { id: loadingToast });
                               field.onChange(newSize.slug);
                             },
                             onError: () => {
                               toast.error("Ölçü tipi yaradılarkən xəta baş verdi", { id: loadingToast });
                               field.onChange("");
                             }
                           });
                        } else {
                           field.onChange(val);
                        }
                      }}
                      error={!!errors.sizeType}
                      placeholder="Ölçü sistemini seçin"
                      allowCustomValue={true}
                    />
                  )}
                />
                <p className="mt-1 text-xs text-gray-500 italic">Bu kateqoriyadakı məhsulların ölçü sistemi.</p>
              </div>

              {/* Order & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label optional>Sıralama</Label>
                  <Input
                    {...register("order")}
                    type="text"
                    onInput={(e: React.FormEvent<HTMLInputElement>) => allowOnlyNumbers(e)}
                    error={!!errors.order}
                  />
                </div>
                <div className="flex flex-row items-center gap-8 pt-7">
                  <label className="relative inline-flex items-center cursor-pointer group">
                    <input {...register("isActive")} type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:bg-brand-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all shadow-sm"></div>
                    <span className="ml-3 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-brand-500 transition-colors">Aktiv</span>
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer group">
                    <input {...register("showOnHome")} type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:bg-orange-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all shadow-sm"></div>
                    <span className="ml-3 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-orange-500 transition-colors">Ana Səhifə</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* SKU Prefixes */}
              <div>
                <Label optional>SKU Prefix (İşlənmiş)</Label>
                <Input
                  {...register("skuPrefixUsed")}
                  type="text"
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    e.currentTarget.value = e.currentTarget.value.toUpperCase();
                  }}
                  placeholder="Məs: IPH-15-XXX"
                  error={!!errors.skuPrefixUsed}
                  hint={errors.skuPrefixUsed?.message as string}
                />
                <p className="mt-1 text-xs text-gray-500 italic">İşlənmiş məhsullar üçün xüsusi SKU formatı (avtomatik generation üçün).</p>
              </div>
              <div>
                <Label optional>SKU Prefix (Yeni)</Label>
                <Input
                  {...register("skuPrefixNew")}
                  type="text"
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    e.currentTarget.value = e.currentTarget.value.toUpperCase();
                  }}
                  placeholder="Məs: IPH-15-NEW-XXX"
                  error={!!errors.skuPrefixNew}
                  hint={errors.skuPrefixNew?.message as string}
                />
                <p className="mt-1 text-xs text-gray-500 italic">Yeni məhsullar üçün xüsusi SKU formatı (avtomatik generation üçün).</p>
              </div>
            </div>

            {/* Image Upload */}
            <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
              <Label optional>Kateqoriya Şəkli</Label>
              <div className="mt-4 flex items-center gap-6">
                <div className="h-32 w-32 shrink-0 overflow-hidden rounded-xl border-2 border-dashed border-gray-300 dark:border-white/10 flex items-center justify-center bg-white dark:bg-gray-900">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="category-image"
                  />
                  <label
                    htmlFor="category-image"
                    className="inline-flex cursor-pointer items-center rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-600 active:scale-95"
                  >
                    Şəkil Seç
                  </label>
                  <p className="mt-2 text-xs text-gray-500 italic">PNG, JPG və ya GIF (Maks. 10MB)</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100 dark:border-white/5">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/categories")}
                className="px-8"
              >
                Ləğv et
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-10"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Gözləyin..."
                  : isEdit ? "Yenilə" : "Kateqoriya Yarat"}
              </Button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </>
  );
}
