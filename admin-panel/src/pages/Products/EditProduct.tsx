import { useState, useEffect } from "react";
import { useForm, Controller, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import Checkbox from "../../components/form/input/Checkbox";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import { useProduct, useUpdateProduct } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { productSchema, ProductFormValues } from "../../validations/productSchema";
import { ChevronLeftIcon, TrashBinIcon } from "../../icons";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(Number(id));
  const { mutate: updateProduct, isPending } = useUpdateProduct();
  const { data: categories } = useCategories();

  // Şəkillərin idarə olunması üçün local state
  const [existingBanner, setExistingBanner] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
  });

  // Məhsul gələndə formu doldur
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description || "",
        price: product.price,
        stock: product.stock,
        categoryId: product.category?.id,
        isFeatured: product.isFeatured,
        tags: product.tags || [],
        variants: product.variants || {},
      });
      setExistingBanner(product.banner);
      setExistingImages(product.images || []);
    }
  }, [product, reset]);

  const [variantName, setVariantName] = useState("");
  const [variantValues, setVariantValues] = useState("");
  const variants = (watch("variants") || {}) as Record<string, string[]>;

  const handleAddVariant = () => {
    if (!variantName || !variantValues) return;
    const valuesArray = variantValues.split(",").map(v => v.trim()).filter(Boolean);
    const newVariants = { ...variants, [variantName]: valuesArray };
    setValue("variants", newVariants);
    setVariantName("");
    setVariantValues("");
  };

  const handleRemoveVariant = (key: string) => {
    const newVariants = { ...variants };
    delete newVariants[key];
    setValue("variants", newVariants);
  };

  const removeExistingImage = (imgUrl: string) => {
    setExistingImages(existingImages.filter(img => img !== imgUrl));
    setDeletedImages([...deletedImages, imgUrl]);
  };

  const removeExistingBanner = () => {
    setExistingBanner(null);
  };

  const onSubmit = (data: ProductFormValues) => {
    const formData = new FormData();

    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    formData.append("price", String(data.price));
    formData.append("stock", String(data.stock));
    if (data.categoryId) formData.append("categoryId", String(data.categoryId));
    formData.append("isFeatured", String(data.isFeatured));

    if (data.tags && data.tags.length > 0) {
      data.tags.filter(Boolean).forEach(tag => formData.append("tags", tag));
    }

    if (data.variants) {
      formData.append("variants", JSON.stringify(data.variants));
    }

    if (data.bannerFile && data.bannerFile.length > 0) {
      const file = (data.bannerFile as FileList)[0];
      formData.append("banner", file);
    } else if (existingBanner) {
      formData.append("existingBanner", existingBanner);
    }

    existingImages.forEach(img => formData.append("existingImages", img));

    if (data.additionalFiles && data.additionalFiles.length > 0) {
      const files = data.additionalFiles as FileList;
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }
    }

    updateProduct({ id: Number(id), data: formData as any }, {
      onSuccess: () => {
        navigate("/products");
      },
      onError: (error) => {
        console.error("Failed to update product", error);
        alert("Xəta baş verdi: Məhsul yenilənə bilmədi.");
      },
    });
  };

  const categoryOptions = categories?.map((cat) => ({
    value: String(cat.id),
    label: cat.name,
  })) || [];

  if (isLoading) return <div>Yüklənir...</div>;

  return (
    <>
      <div className="mb-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-brand-500 dark:text-gray-400"
        >
          <ChevronLeftIcon className="size-5" />
          <span>Geri</span>
        </button>
      </div>
      <PageBreadcrumb pageTitle="Məhsulu Redaktə Et" />
      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          <ComponentCard title="Məhsul Məlumatları">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name">Məhsulun Adı</Label>
                  <Input type="text" id="name" {...register("name")} error={!!errors.name} hint={errors.name?.message} />
                </div>

                <div>
                  <Label htmlFor="description">Təsvir</Label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextArea {...field} rows={6} error={!!errors.description} hint={errors.description?.message} />
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="price">Qiymət</Label>
                    <Input type="number" id="price" step="0.01" {...register("price")} error={!!errors.price} hint={errors.price?.message} />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stok Sayı</Label>
                    <Input type="number" id="stock" {...register("stock")} error={!!errors.stock} hint={errors.stock?.message} />
                  </div>
                </div>

                <div>
                  <Label>Kateqoriya</Label>
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={categoryOptions}
                        onChange={field.onChange}
                        value={field.value !== undefined ? String(field.value) : ""}
                      />
                    )}
                  />
                </div>

                {/* current Banner */}
                <div>
                  <Label>Mövcud Vitrin Şəkli</Label>
                  {existingBanner ? (
                    <div className="relative mb-4 h-40 w-40 overflow-hidden rounded-lg border border-gray-200">
                      <img src={existingBanner} className="h-full w-full object-cover" alt="Banner" />
                      <button
                        type="button"
                        onClick={removeExistingBanner}
                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600 shadow-lg"
                      >
                        <TrashBinIcon className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="mb-4 text-sm text-gray-500 italic">Vitrin şəkli yoxdur</p>
                  )}
                  <Label htmlFor="bannerFile">Yeni Vitrin Şəkli Seç (Dəyişmək üçün)</Label>
                  <input
                    type="file"
                    id="bannerFile"
                    accept="image/*"
                    className="w-full cursor-pointer rounded-lg border border-gray-300 bg-transparent text-sm file:mr-4 file:cursor-pointer file:border-0 file:bg-gray-50 file:px-4 file:py-3 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                    {...register("bannerFile")}
                  />
                </div>

                <div>
                  <Label>Mövcud Digər Şəkillər</Label>
                  {existingImages.length > 0 ? (
                    <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {existingImages.map((img, idx) => (
                        <div key={idx} className="relative h-full overflow-hidden rounded-lg border border-gray-200">
                          <img src={img} className="h-full w-full object-cover" alt={`Product ${idx}`} />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(img)}
                            className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 shadow-lg"
                          >
                            <TrashBinIcon className="size-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mb-4 text-sm text-gray-500 italic">Əlavə şəkil yoxdur</p>
                  )}
                  <Label htmlFor="additionalFiles">Yeni Şəkillər Əlavə Et</Label>
                  <input
                    type="file"
                    id="additionalFiles"
                    accept="image/*"
                    multiple
                    className="w-full cursor-pointer rounded-lg border border-gray-300 bg-transparent text-sm file:mr-4 file:cursor-pointer file:border-0 file:bg-gray-50 file:px-4 file:py-3 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-100 dark:border-gray-700"
                    {...register("additionalFiles")}
                  />
                </div>

                {/* Variants & Tags (eyni AddProduct məntiqi) */}
                <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
                  <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-100">Variantlar</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
                    <Input value={variantName} onChange={(e) => setVariantName(e.target.value)} placeholder="Variant Adı" />
                    <Input value={variantValues} onChange={(e) => setVariantValues(e.target.value)} placeholder="Dəyərlər (vergüllə)" />
                  </div>
                  <Button type="button" size="sm" onClick={handleAddVariant} disabled={!variantName || !variantValues}>Əlavə et</Button>
                  <div className="mt-4 space-y-2">
                    {Object.entries(variants).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                        <span>{k}: {Array.isArray(v) ? v.join(", ") : String(v)}</span>
                        <button type="button" onClick={() => handleRemoveVariant(k)} className="text-red-500">Sil</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">teqlər (Vergüllə ayırın)</Label>
                  <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="text"
                        value={field.value?.join(", ") || ""}
                        onChange={(e) => field.onChange(e.target.value.split(",").map(t => t.trim()))}
                      />
                    )}
                  />
                </div>

                <div>
                  <Controller
                    name="isFeatured"
                    control={control}
                    render={({ field }) => (
                      <Checkbox label="Bu məhsulu vitrində göstər" checked={field.value || false} onChange={field.onChange} />
                    )}
                  />
                </div>

                <div className="mt-6">
                  <Button size="md" className="w-full" disabled={isPending}>
                    {isPending ? "Yenilənir..." : "Məhsulu Yenilə"}
                  </Button>
                </div>
              </div>
            </form>
          </ComponentCard>
        </div>
      </div>
    </>
  );
}
