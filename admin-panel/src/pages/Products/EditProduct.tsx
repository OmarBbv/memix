import { useState, useEffect } from "react";
import { useForm, Controller, Resolver, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import { useProduct, useUpdateProduct } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useBrands } from "../../hooks/useBrands";
import { productSchema, ProductFormValues } from "../../validations/productSchema";
import { ChevronLeftIcon, TrashBinIcon, PlusIcon } from "../../icons";
import { allowOnlyNumbers } from "../../utils/inputHelpers";
import SearchableSelect from "../../components/ui/select/SearchableSelect";
import { SIZE_OPTIONS } from "../../constants/sizes";
import { COLOR_OPTIONS } from "../../constants/colors";
import { SizeType } from "../../types/category";
import QuickCreateBrandModal from "../../components/brands/QuickCreateBrandModal";
import productService from "../../services/productService";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(Number(id));
  const { mutate: updateProduct, isPending } = useUpdateProduct();
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [existingBanner, setExistingBanner] = useState<string | null>(null);

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "colorVariants",
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description || "",
        price: Number(product.price) || 0 as any,
        stock: Number(product.stock) || 0 as any,
        sku: product.sku || "",
        barcode: product.barcode || "",
        gender: product.gender || "",
        weight: (product.weight !== null && product.weight !== undefined) ? Number(product.weight) : "" as any,
        categoryId: product.category?.id,
        brandId: product.brand?.id,
        listingType: product.listingType || "new",
        isFeatured: product.isFeatured,
        tags: product.tags || [],
        variants: product.variants || {},
        // Handle transformation from new colorVariants structure
        colorVariants: product.colorVariants?.map((cv: any) => ({
          color: cv.color || "",
          images: cv.images || [],
          imageFiles: [],
          stocks: cv.stocks?.map((s: any) => ({
            size: s.size || "",
            stock: s.stock || 0
          })) || [{ size: "", stock: "" as any }]
        })) || []
      });
      setExistingBanner(product.banner);
    }
  }, [product, reset]);


  const categoryId = watch("categoryId");

  const currentCategory = categories?.find(c => c.id === categoryId);
  const sizeType = currentCategory?.sizeType as SizeType;
  const availableSizes = sizeType ? SIZE_OPTIONS[sizeType] : null;

  useEffect(() => {
    if (currentCategory?.attributes) {
      const currentValue = watch("variants") || {};
      const newVariants = { ...currentValue };
      let hasChanges = false;
      currentCategory.attributes.forEach((attr) => {
        if (!newVariants[attr.name]) {
          newVariants[attr.name] = [];
          hasChanges = true;
        }
      });
      if (hasChanges) setValue("variants", newVariants);
    }
  }, [currentCategory, setValue, watch]);

  const listingType = watch("listingType");

  useEffect(() => {
    if (product && categoryId && listingType) {
      const isOriginalCategory = product.category?.id === categoryId;
      const isOriginalListingType = (product.listingType || "new") === listingType;

      if (!isOriginalCategory || !isOriginalListingType) {
        productService.generateSKU(categoryId, listingType).then(response => {
          if (response.error) {
            toast.error(response.error);
            setValue("sku", "");
          } else if (response.sku) {
            setValue("sku", response.sku);
          }
        }).catch(err => {
          console.error("SKU generation error:", err);
        });
      } else {
        setValue("sku", product.sku || "");
      }
    }
  }, [categoryId, listingType, product, setValue]);



  const onSubmit = (data: ProductFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.sku) formData.append("sku", data.sku);
    if (data.barcode) formData.append("barcode", data.barcode);
    if (data.gender) formData.append("gender", data.gender);
    if (data.weight !== undefined && data.weight !== null) formData.append("weight", String(data.weight));
    formData.append("price", String(data.price));
    if (data.categoryId) formData.append("categoryId", String(data.categoryId));
    if (data.brandId) formData.append("brandId", String(data.brandId));
    formData.append("isFeatured", String(data.isFeatured));
    if (data.listingType) formData.append("listingType", data.listingType);

    if (data.tags && data.tags.length > 0) {
      data.tags.filter(Boolean).forEach(tag => formData.append("tags", tag));
    }

    if (data.variants) {
      formData.append("variants", JSON.stringify(data.variants));
    }

    // Color Variants & Stocks
    if (data.colorVariants && data.colorVariants.length > 0) {
      const simplifiedColorVariants = data.colorVariants.map((cv, vIndex) => {
        if (cv.imageFiles && cv.imageFiles.length > 0) {
          cv.imageFiles.forEach((file: File) => {
            formData.append(`variantImages_${vIndex}`, file);
          });
        }
        return {
          color: cv.color,
          images: cv.images, // keep existing ones
          stocks: cv.stocks.map(s => ({
            size: s.size,
            stock: Number(s.stock) || 0
          }))
        };
      });
      formData.append("colorVariants", JSON.stringify(simplifiedColorVariants));

      const totalStock = data.colorVariants.reduce((acc, cv) =>
        acc + cv.stocks.reduce((sAcc, s) => sAcc + (Number(s.stock) || 0), 0)
        , 0);
      formData.append("stock", String(totalStock));
    }

    if (data.bannerFile && data.bannerFile.length > 0) {
      const file = (data.bannerFile as any)[0];
      formData.append("banner", file);
    } else if (existingBanner) {
      formData.append("existingBanner", existingBanner);
    }

    updateProduct({ id: Number(id), data: formData as any }, {
      onSuccess: () => {
        toast.success("Məhsul uğurla yeniləndi");
        navigate("/products");
      },
      onError: (error: any) => {
        const serverError = error.response?.data?.message || "Məhsul yenilənə bilmədi";
        const errorMsg = Array.isArray(serverError) ? serverError.join(" | ") : serverError;
        toast.error(`Xəta: ${errorMsg}`);
      },
    });
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
    </div>
  );

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
          <ComponentCard title="Məhsul Məlumatları - Redaktə">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div className="space-y-4">
                  {/* Basic Info */}
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                    <div className="w-full md:w-64">
                      <Label htmlFor="name" required className="mb-0!">Məhsulun Adı</Label>
                    </div>
                    <div className="flex-1">
                      <Input
                        type="text"
                        id="name"
                        {...register("name")}
                        error={!!errors.name}
                        hint={errors.name?.message}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                    <div className="w-full md:w-64">
                      <Label htmlFor="sku" optional className="mb-0!">Məhsul Kodu (SKU)</Label>
                    </div>
                    <div className="flex-1">
                      <Input
                        type="text"
                        id="sku"
                        {...register("sku")}
                        error={!!errors.sku}
                        hint={errors.sku?.message}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                    <div className="w-full md:w-64">
                      <Label htmlFor="barcode" optional className="mb-0!">Barkod (Avtomatik)</Label>
                    </div>
                    <div className="flex-1">
                      <Input
                        type="text"
                        id="barcode"
                        {...register("barcode")}
                        disabled={true}
                        className="bg-gray-50 cursor-not-allowed"
                        error={!!errors.barcode}
                        hint={errors.barcode?.message}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                    <div className="w-full md:w-64">
                      <Label htmlFor="price" required className="mb-0!">Qiymət</Label>
                    </div>
                    <div className="flex-1 max-w-sm">
                      <Input
                        type="text"
                        id="price"
                        {...register("price")}
                        onInput={(e: React.FormEvent<HTMLInputElement>) => allowOnlyNumbers(e, true)}
                        error={!!errors.price}
                        hint={errors.price?.message}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                    <div className="w-full md:w-64">
                      <Label className="mb-0!">Məhsulun Vəziyyəti</Label>
                    </div>
                    <div className="flex-1 max-w-sm">
                      <Controller
                        name="listingType"
                        control={control}
                        render={({ field }) => (
                          <SearchableSelect
                            options={[
                              { label: "YENİ (NEW)", value: "new" },
                              { label: "İKİNCİ ƏL (USED)", value: "used" },
                            ]}
                            placeholder="Vəziyyəti seçin"
                            onChange={field.onChange}
                            value={field.value}
                            error={!!errors.listingType}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                    <div className="w-full md:w-64">
                      <Label optional className="mb-0!">Cinsi</Label>
                    </div>
                    <div className="flex-1 max-w-sm">
                      <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                          <SearchableSelect
                            options={[
                              { label: "Qadın", value: "Qadın" },
                              { label: "Kişi", value: "Kişi" },
                              { label: "Uşaq", value: "Uşaq" },
                              { label: "Unisex", value: "Unisex" },
                            ]}
                            onChange={field.onChange}
                            value={field.value}
                            error={!!errors.gender}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                    <div className="w-full md:w-64">
                      <Label htmlFor="weight" optional className="mb-0!">Çəki (Qr)</Label>
                    </div>
                    <div className="flex-1 max-w-sm">
                      <Input
                        type="text"
                        id="weight"
                        {...register("weight")}
                        onInput={(e: React.FormEvent<HTMLInputElement>) => allowOnlyNumbers(e)}
                        error={!!errors.weight}
                        hint={errors.weight?.message}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                    <div className="w-full md:w-64">
                      <Label required className="mb-0!">Kateqoriya</Label>
                    </div>
                    <div className="flex-1">
                      <Controller
                        name="categoryId"
                        control={control}
                        render={({ field }) => (
                          <SearchableSelect
                            options={categories?.map((cat) => ({
                              label: cat.name,
                              value: cat.id,
                            })) || []}
                            placeholder="Kateqoriya seçin"
                            onChange={field.onChange}
                            value={field.value as any}
                            error={!!errors.categoryId}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                    <div className="w-full md:w-64 flex items-center justify-between pr-4">
                      <Label optional className="mb-0!">Brend (Marka)</Label>
                      <button
                        type="button"
                        onClick={() => setIsBrandModalOpen(true)}
                        className="text-[10px] font-semibold text-brand-500 hover:text-brand-600 transition-colors uppercase tracking-wider"
                      >
                        + Yeni
                      </button>
                    </div>
                    <div className="flex-1">
                      <Controller
                        name="brandId"
                        control={control}
                        render={({ field }) => (
                          <SearchableSelect
                            options={brands?.map((brand) => ({
                              label: brand.name,
                              value: brand.id,
                            })) || []}
                            placeholder="Brend seçin"
                            onChange={field.onChange}
                            value={field.value as any}
                            error={!!errors.brandId}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  {/* COLOR BASED VARIANTS */}
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">Məhsul Variantları (Rəng Bazlı)</h3>
                    <p className="text-xs text-gray-400 mt-1">Hər rəng üçün bir blok əlavə edin, şəkilləri və mövcut ölçüləri qeyd edin</p>
                  </div>

                  <div className="space-y-6">
                    {fields.map((item, index) => (
                      <div key={item.id} className="relative rounded-3xl border border-gray-200 bg-gray-50/10 p-5 dark:border-gray-800 dark:bg-gray-800/20 transition-all hover:bg-gray-50/40">
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 shadow-md border border-gray-100 transition-all hover:bg-red-50 hover:text-red-500 dark:bg-gray-900 dark:border-gray-800"
                        >
                          <TrashBinIcon className="size-4" />
                        </button>

                        <div className="space-y-8">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="w-full md:w-32">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] mb-0!">RƏNG</Label>
                            </div>
                            <div className="flex-1 max-w-sm">
                              <Controller
                                name={`colorVariants.${index}.color`}
                                control={control}
                                render={({ field }) => (
                                  <SearchableSelect
                                    options={COLOR_OPTIONS}
                                    placeholder="Rəng seçin"
                                    value={field.value}
                                    onChange={field.onChange}
                                    allowCustomValue={true}
                                    className="min-h-[44px]!"
                                  />
                                )}
                              />
                            </div>
                          </div>


                          <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] mb-0!">ÖLÇÜLƏR VƏ STOK</Label>
                              <button
                                type="button"
                                onClick={() => {
                                  const stocks = watch(`colorVariants.${index}.stocks`) || [];
                                  setValue(`colorVariants.${index}.stocks`, [...stocks, { size: "", stock: "" as any }]);
                                }}
                                className="text-[10px] font-bold text-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1 uppercase"
                              >
                                <PlusIcon className="size-3" /> Ölçü Əlavə Et
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {(watch(`colorVariants.${index}.stocks`) || []).map((_: any, sIdx: number) => (
                                <div key={sIdx} className="group relative flex items-center gap-2 p-2 bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm transition-all hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/5">
                                  <div className="flex-1 min-w-0">
                                    <Controller
                                      name={`colorVariants.${index}.stocks.${sIdx}.size`}
                                      control={control}
                                      render={({ field }) => (
                                        <SearchableSelect
                                          options={availableSizes ? availableSizes.map(sizeVal => ({ value: sizeVal, label: sizeVal })) : []}
                                          value={field.value}
                                          onChange={field.onChange}
                                          allowCustomValue={true}
                                          className="min-h-[40px]! h-10!"
                                          placeholder="Ölçü"
                                        />
                                      )}
                                    />
                                  </div>

                                  <div className="w-16">
                                    <Input
                                      type="text"
                                      placeholder="Stok"
                                      {...register(`colorVariants.${index}.stocks.${sIdx}.stock`)}
                                      onInput={(e: React.FormEvent<HTMLInputElement>) => allowOnlyNumbers(e)}
                                      className="h-10 text-xs font-bold text-center rounded-xl bg-gray-50 dark:bg-white/5 border-transparent! focus:bg-white dark:focus:bg-gray-800"
                                    />
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const stocks = [...watch(`colorVariants.${index}.stocks`)];
                                      if (stocks.length > 1) {
                                        stocks.splice(sIdx, 1);
                                        setValue(`colorVariants.${index}.stocks`, stocks);
                                      }
                                    }}
                                    className={`flex items-center justify-center p-2 transition-all rounded-xl ${(watch(`colorVariants.${index}.stocks`) || []).length > 1
                                      ? "text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                                      : "text-gray-200 cursor-not-allowed opacity-30"
                                      }`}
                                    disabled={(watch(`colorVariants.${index}.stocks`) || []).length <= 1}
                                  >
                                    <TrashBinIcon className="size-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] mb-0!">VARIANT ŞƏKİLLƏRİ</Label>
                                <p className="text-[10px] text-gray-400 mt-0.5">Hər rəng üçün öz şəkillərini yükləyin</p>
                              </div>
                              <div className="text-[10px] font-bold px-3 py-1 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10 uppercase">
                                <span className="">{(watch(`colorVariants.${index}.images`)?.length || 0) + (watch(`colorVariants.${index}.imageFiles`)?.length || 0)}</span> / 20 Şəkil
                              </div>
                            </div>

                            <div className="relative min-h-[160px] rounded-3xl border-2 border-dashed border-gray-100 bg-white/50 p-6 transition-all hover:border-brand-500/30 hover:bg-white dark:border-gray-800 dark:bg-gray-900/50">
                              <div className="flex flex-wrap gap-4">
                                {/* Existing Images */}
                                <Controller
                                  name={`colorVariants.${index}.images`}
                                  control={control}
                                  render={({ field }) => (
                                    <>
                                      {(field.value || []).map((img: string, imgIdx: number) => (
                                        <div key={imgIdx} className="group relative h-28 w-28 overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition-transform hover:scale-105">
                                          <img src={img} className="h-full w-full object-cover" alt="existing variant" />
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const newImages = [...field.value];
                                              newImages.splice(imgIdx, 1);
                                              field.onChange(newImages);
                                            }}
                                            className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                          >
                                            <TrashBinIcon className="size-6" />
                                          </button>
                                        </div>
                                      ))}
                                    </>
                                  )}
                                />

                                {/* New Image Files */}
                                <Controller
                                  name={`colorVariants.${index}.imageFiles`}
                                  control={control}
                                  render={({ field }) => (
                                    <>
                                      {(field.value || []).map((file: File, fileIdx: number) => (
                                        <div key={fileIdx} className="group relative h-28 w-28 overflow-hidden rounded-2xl border-2 border-brand-500/30 shadow-sm transition-transform hover:scale-105">
                                          <img src={URL.createObjectURL(file)} className="h-full w-full object-cover" alt="new variant" />
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const newFiles = [...field.value];
                                              newFiles.splice(fileIdx, 1);
                                              field.onChange(newFiles);
                                            }}
                                            className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                          >
                                            <TrashBinIcon className="size-6" />
                                          </button>
                                        </div>
                                      ))}

                                      {((watch(`colorVariants.${index}.images`)?.length || 0) + (field.value || []).length) < 20 && (
                                        <label className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50 text-gray-400 transition-all hover:border-brand-500 hover:bg-brand-50/10 hover:text-brand-500 dark:border-gray-800 dark:bg-gray-800/50">
                                          <PlusIcon className="size-8" />
                                          <span className="mt-2 text-[10px] font-black uppercase tracking-tighter">Şəkil Əlavə Et</span>
                                          <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                              const selectedFiles = Array.from(e.target.files || []);
                                              field.onChange([...(field.value || []), ...selectedFiles]);
                                              e.target.value = '';
                                            }}
                                          />
                                        </label>
                                      )}
                                    </>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => append({ color: "", images: [], imageFiles: [], stocks: [{ size: "", stock: "" as any }] })}
                      className="w-full max-w-sm rounded-2xl border-dashed border-2 border-brand-500/30 py-6 text-brand-500 hover:bg-brand-50 transition-all hover:border-brand-500 group"
                    >
                      <PlusIcon className="size-5 mr-3 group-hover:scale-125 transition-transform" />
                      <span className="font-bold">Yeni Rəng Bloqu Əlavə Et</span>
                    </Button>
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6 pt-10 border-t border-gray-100 dark:border-gray-800">
                  <div className="w-full md:w-64 pt-2">
                    <Label htmlFor="description" optional className="mb-0!">Təsvir</Label>
                  </div>
                  <div className="flex-1">
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <TextArea
                          {...field}
                          rows={6}
                          id="description"
                          error={!!errors.description}
                          hint={errors.description?.message}
                          className="rounded-2xl"
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Banner */}
                <div className="space-y-4 pt-10 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6">
                    <div className="w-full md:w-64 flex flex-col items-start">
                      <Label htmlFor="bannerFile" required className="mb-0!">Vitrin Şəkli</Label>
                      {existingBanner && (
                        <div className="mt-4 relative h-32 w-32 group rounded-2xl overflow-hidden border border-gray-200">
                          <img src={existingBanner} alt="Base" className="h-full w-full object-cover text-[10px]" />
                          <button
                            type="button"
                            onClick={() => setExistingBanner(null)}
                            className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100"
                          >
                            <TrashBinIcon className="size-5" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        id="bannerFile"
                        accept="image/*"
                        className="w-full cursor-pointer rounded-2xl border border-gray-300 bg-transparent text-sm file:mr-4 file:cursor-pointer file:border-0 file:bg-gray-50 file:px-6 file:py-4 file:font-bold dark:border-gray-700"
                        {...register("bannerFile")}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex justify-end">
                  <Button size="sm" className="w-full md:w-auto md:min-w-[240px] rounded-2xl h-12 text-sm font-bold shadow-lg shadow-brand-500/10" disabled={isPending}>
                    {isPending ? "Yenilənir..." : "Dəyişiklikləri Saxla"}
                  </Button>
                </div>
              </div>
            </form>
          </ComponentCard>
        </div>
      </div>
      <QuickCreateBrandModal isOpen={isBrandModalOpen} onClose={() => setIsBrandModalOpen(false)} />
    </>
  );
}
