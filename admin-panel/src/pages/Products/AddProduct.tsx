import { useState } from "react";
import { useForm, Controller, Resolver, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import Checkbox from "../../components/form/input/Checkbox";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import { useCreateProduct } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useBranches } from "../../hooks/useBranches";
import { productSchema, ProductFormValues } from "../../validations/productSchema";
import { ChevronLeftIcon, TrashBinIcon } from "../../icons";
import { allowOnlyNumbers } from "../../utils/inputHelpers";

export default function AddProduct() {
  const navigate = useNavigate();
  const { mutate: createProduct, isPending } = useCreateProduct();
  const { data: categories } = useCategories();
  const { data: branches } = useBranches();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
    defaultValues: {
      name: "",
      description: "",
      price: "" as any,
      stock: "" as any,
      categoryId: undefined,
      isFeatured: false,
      images: [],
      tags: [],
      variants: {},
      branchStocks: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "branchStocks",
  });

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

  const onSubmit = (data: ProductFormValues) => {
    const formData = new FormData();

    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    formData.append("price", String(data.price));
    formData.append("stock", String(data.stock));
    if (data.categoryId) formData.append("categoryId", String(data.categoryId));
    formData.append("isFeatured", String(data.isFeatured));

    // Tags
    if (data.tags && data.tags.length > 0) {
      data.tags.filter(Boolean).forEach(tag => formData.append("tags", tag));
    }

    // Variants
    if (data.variants) {
      formData.append("variants", JSON.stringify(data.variants));
    }

    // Branch Stocks
    if (data.branchStocks && data.branchStocks.length > 0) {
      // Filter out invalid entries where branchId is 0 or falsy
      const validStocks = data.branchStocks.filter(bs => bs.branchId && Number(bs.branchId) > 0);
      console.log("Branch Stocks (raw):", data.branchStocks);
      console.log("Branch Stocks (valid):", validStocks);
      if (validStocks.length > 0) {
        formData.append("branchStocks", JSON.stringify(validStocks));
      }
    }

    // Vitrin Şəkli (Tek)
    if (data.bannerFile && data.bannerFile.length > 0) {
      const file = (data.bannerFile as FileList)[0];
      formData.append("banner", file);
    }

    // Digər Şəkillər (Çoxlu)
    if (data.additionalFiles && data.additionalFiles.length > 0) {
      const files = data.additionalFiles as FileList;
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }
    }

    createProduct(formData as any, {
      onSuccess: () => {
        navigate("/products");
      },
      onError: (error) => {
        console.error("Failed to create product", error);
        alert("Xəta baş verdi: Məhsul yaradıla bilmədi.");
      },
    });
  };

  const categoryOptions = categories?.map((cat) => ({
    value: String(cat.id),
    label: cat.name,
  })) || [];

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
      <PageBreadcrumb pageTitle="Yeni Məhsul" />
      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          <ComponentCard title="Məhsul Məlumatları">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                {/* Product Name */}
                <div>
                  <Label htmlFor="name">Məhsulun Adı</Label>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Məhsulun adını daxil edin"
                    {...register("name")}
                    error={!(!errors.name)}
                    hint={errors.name?.message}
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Təsvir</Label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextArea
                        {...field}
                        rows={6}
                        placeholder="Məhsul haqqında ətraflı məlumat"
                        error={!!errors.description}
                        hint={errors.description?.message}
                      />
                    )}
                  />
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="price">Qiymət</Label>
                    <Input
                      type="text"
                      id="price"
                      placeholder="0.00"
                      {...register("price")}
                      onInput={(e: React.FormEvent<HTMLInputElement>) => allowOnlyNumbers(e, true)}
                      error={!!errors.price}
                      hint={errors.price?.message}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Ümumi Stok Sayı (Məcburi deyil)</Label>
                    <Input
                      type="text"
                      id="stock"
                      placeholder="0"
                      {...register("stock")}
                      onInput={(e: React.FormEvent<HTMLInputElement>) => allowOnlyNumbers(e)}
                      error={!!errors.stock}
                      hint={errors.stock?.message}
                    />
                  </div>
                </div>

                {/* Branch-specific Stocks */}
                <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Filial Üzrə Stok</h3>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => append({ branchId: 0, stock: "" as any })}
                    >
                      Filial Əlavə Et
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {fields.map((item, index) => (
                      <div key={item.id} className="flex items-end gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                        <div className="flex-1">
                          <Label>Filial</Label>
                          <Controller
                            name={`branchStocks.${index}.branchId`}
                            control={control}
                            render={({ field }) => (
                              <Select
                                options={branches?.map(b => ({ value: String(b.id), label: b.name })) || []}
                                placeholder="Filial seçin"
                                onChange={(val) => field.onChange(Number(val))}
                                value={String(field.value)}
                              />
                            )}
                          />
                        </div>
                        <div className="w-32">
                          <Label>Stok</Label>
                          <Input
                            type="text"
                            placeholder="0"
                            {...register(`branchStocks.${index}.stock` as const)}
                            onInput={(e: React.FormEvent<HTMLInputElement>) => allowOnlyNumbers(e)}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="mb-2.5 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-700"
                        >
                          <TrashBinIcon className="size-5" />
                        </button>
                      </div>
                    ))}
                    {fields.length === 0 && (
                      <p className="text-center text-sm text-gray-500 py-4">
                        Heç bir filial seçilməyib.
                      </p>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <Label>Kateqoriya</Label>
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={categoryOptions}
                        placeholder="Kateqoriya seçin"
                        onChange={field.onChange}
                        value={field.value !== undefined ? String(field.value) : ""}
                      />
                    )}
                  />
                  {errors.categoryId?.message && (
                    <p className="mt-1 text-sm text-error-500">
                      {errors.categoryId.message}
                    </p>
                  )}
                </div>

                {/* Banner Image (Single) */}
                <div>
                  <Label htmlFor="bannerFile">Vitrin Şəkli (Əsas Şəkil)</Label>
                  <div className="relative">
                    <input
                      type="file"
                      id="bannerFile"
                      accept="image/*"
                      className="w-full cursor-pointer rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 file:mr-4 file:cursor-pointer file:border-0 file:bg-gray-50 file:px-4 file:py-3 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:file:bg-white/3 dark:file:text-gray-300"
                      {...register("bannerFile")}
                    />
                  </div>
                  {errors.bannerFile?.message && (
                    <p className="mt-1 text-sm text-error-500">
                      {errors.bannerFile.message as string}
                    </p>
                  )}
                </div>

                {/* Additional Images (Multiple) */}
                <div>
                  <Label htmlFor="additionalFiles">Digər Şəkillər (Çoxlu Seçim)</Label>
                  <div className="relative">
                    <input
                      type="file"
                      id="additionalFiles"
                      accept="image/*"
                      multiple
                      className="w-full cursor-pointer rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 file:mr-4 file:cursor-pointer file:border-0 file:bg-gray-50 file:px-4 file:py-3 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:file:bg-white/3 dark:file:text-gray-300"
                      {...register("additionalFiles")}
                    />
                  </div>
                  {errors.additionalFiles?.message && (
                    <p className="mt-1 text-sm text-error-500">
                      {errors.additionalFiles.message as string}
                    </p>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <Label htmlFor="tags">teqlər (Vergüllə ayırın)</Label>
                  <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="text"
                        id="tags"
                        placeholder="Yeni, Endirim, Qış, Yay"
                        value={field.value?.join(", ") || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          const args = val.split(",").map(t => t.trim());
                          field.onChange(args);
                        }}
                        onBlur={field.onBlur}
                      />
                    )}
                  />
                  <p className="mt-1 text-xs text-gray-500">Məsələn: Elektronika, Telefon, Smartfon</p>
                </div>

                {/* Variants */}
                <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
                  <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-100">Məhsul Variantları</h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
                    <div>
                      <Label>Variant Adı (məs: Rəng)</Label>
                      <Input
                        value={variantName}
                        onChange={(e) => setVariantName(e.target.value)}
                        placeholder="Rəng"
                      />
                    </div>
                    <div>
                      <Label>Dəyərlər (Vergüllə ayırın)</Label>
                      <Input
                        value={variantValues}
                        onChange={(e) => setVariantValues(e.target.value)}
                        placeholder="Qırmızı, Yaşıl, Mavi"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddVariant}
                    disabled={!variantName || !variantValues}
                    className="mb-4"
                  >
                    Variant Əlavə Et
                  </Button>

                  {/* Variants List */}
                  <div className="space-y-2">
                    {Object.entries(variants).map(([key, values]) => (
                      <div key={key} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">{key}:</span>
                          <span className="ml-2 text-gray-500 dark:text-gray-400">
                            {Array.isArray(values) ? values.join(", ") : String(values)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(key)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Sil
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Is Featured */}
                <div>
                  <Controller
                    name="isFeatured"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        className="select-none"
                        label="Bu məhsulu vitrində (Öne Çıxan) göstər"
                        checked={field.value || false}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div className="mt-6">
                  <Button size="md" className="w-full" disabled={isPending}>
                    {isPending ? "Yaradılır..." : "Məhsul Yarat"}
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
