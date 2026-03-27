import { useState } from "react";
import { useForm, Controller, Resolver, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Checkbox from "../../components/form/input/Checkbox";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import { useCreateProduct } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useBrands } from "../../hooks/useBrands";
import { useBranches } from "../../hooks/useBranches";
import { productSchema, ProductFormValues } from "../../validations/productSchema";
import { ChevronLeftIcon, PlusIcon, TrashBinIcon } from "../../icons";
import { allowOnlyNumbers } from "../../utils/inputHelpers";
import SearchableSelect from "../../components/ui/select/SearchableSelect";
import { SIZE_OPTIONS } from "../../constants/sizes";
import { COLOR_OPTIONS } from "../../constants/colors";
import { SizeType } from "../../types/category";
import QuickCreateBrandModal from "../../components/brands/QuickCreateBrandModal";

export default function AddProduct() {
  const navigate = useNavigate();
  const { mutate: createProduct, isPending } = useCreateProduct();
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const { data: branches } = useBranches();
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

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
      sku: "",
      barcode: "",
      gender: "",
      weight: "" as any,
      categoryId: undefined,
      brandId: undefined,
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
  const categoryId = watch("categoryId");

  const currentCategory = categories?.find(c => c.id === categoryId);
  const sizeType = currentCategory?.sizeType as SizeType;
  const availableSizes = sizeType ? SIZE_OPTIONS[sizeType] : null;



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
    if (data.sku) formData.append("sku", data.sku);
    if (data.barcode) formData.append("barcode", data.barcode);
    if (data.gender) formData.append("gender", data.gender);
    if (data.weight) formData.append("weight", String(data.weight));
    formData.append("price", String(data.price));
    formData.append("stock", String(data.stock));
    if (data.categoryId) formData.append("categoryId", String(data.categoryId));
    if (data.brandId) formData.append("brandId", String(data.brandId));
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
        toast.success("Məhsul uğurla yaradıldı");
        navigate("/products");
      },
      onError: (error: any) => {
        console.error("Failed to create product", error);
        const serverError = error.response?.data?.message || "Məhsul yaradıla bilmədi (Network/Server xətası)";
        const errorMsg = Array.isArray(serverError) ? serverError.join(" | ") : serverError;
        toast.error(`Xəta: ${errorMsg}`);
      },
    });
  };

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
                {/* Product Multi-Fields Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {/* Name */}
                  <div className="md:col-span-1">
                    <Label htmlFor="name" required>Məhsulun Adı</Label>
                    <Input
                      type="text"
                      id="name"
                      placeholder="Məhsulun adını daxil edin"
                      {...register("name")}
                      error={!(!errors.name)}
                      hint={errors.name?.message}
                    />
                  </div>
                  {/* SKU */}
                  <div>
                    <Label htmlFor="sku" optional>Məhsul Kodu (SKU)</Label>
                    <Input
                      type="text"
                      id="sku"
                      placeholder="Məs: 1801292"
                      {...register("sku")}
                      error={!!errors.sku}
                      hint={errors.sku?.message}
                    />
                  </div>
                  {/* Barcode */}
                  <div>
                    <Label htmlFor="barcode" optional>Barkod</Label>
                    <Input
                      type="text"
                      id="barcode"
                      placeholder="Barkodu daxil edin və ya skan edin"
                      {...register("barcode")}
                      error={!!errors.barcode}
                      hint={errors.barcode?.message}
                    />
                  </div>
                </div>

                {/* Price, Stock, Gender, Weight Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                  {/* Price */}
                  <div>
                    <Label htmlFor="price" required>Qiymət</Label>
                    <Input
                      type="text"
                      id="price"
                      placeholder="0.00"
                      {...register("price")}
                      onInput={(e: React.FormEvent<HTMLInputElement>) => allowOnlyNumbers(e, true)}
                      error={!!errors.price}
                      hint={errors.price?.message}
                      autoComplete="off"
                    />
                  </div>
                  {/* Stock */}
                  <div>
                    <Label htmlFor="stock" optional>Ümumi Stok</Label>
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
                  {/* Gender */}
                  <div>
                    <Label optional>Cinsi</Label>
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
                          placeholder="Cins seçin"
                          onChange={field.onChange}
                          value={field.value}
                          error={!!errors.gender}
                        />
                      )}
                    />
                  </div>
                  {/* Weight */}
                  <div>
                    <Label htmlFor="weight" optional>Çəki (Qr)</Label>
                    <Input
                      type="text"
                      id="weight"
                      placeholder="Məs: 284"
                      {...register("weight")}
                      onInput={(e: React.FormEvent<HTMLInputElement>) => allowOnlyNumbers(e)}
                      error={!!errors.weight}
                      hint={errors.weight?.message}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description" optional>Təsvir</Label>
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


                {/* Category & Brand */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <Label required>Kateqoriya</Label>
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
                    {errors.categoryId?.message && (
                      <p className="mt-1 text-sm text-error-500">
                        {errors.categoryId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <Label optional>Brend (Marka)</Label>
                      <button
                        type="button"
                        onClick={() => setIsBrandModalOpen(true)}
                        className="text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors"
                      >
                        + Yeni Brend
                      </button>
                    </div>
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

                <div className="">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Filial & Ölçü Üzrə Stok</h3>
                      <p className="text-xs text-gray-500 mt-1">Hər filialda, hər ölçüdəki stok sayını ayrıca əlavə edin</p>
                    </div>
                    <Button
                      type="button"
                      size="xs"
                      variant="outline"
                      onClick={() => append({ branchId: 0, stock: "" as any, size: "", color: "" })}
                    >
                      <PlusIcon />
                      <span>Stok Sətri</span>
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {fields.map((item, index) => (
                      <div key={item.id} className="flex items-end gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                        <div className="flex-1">
                          <Label>Filial</Label>
                          <Controller
                            name={`branchStocks.${index}.branchId`}
                            control={control}
                            render={({ field }) => (
                              <SearchableSelect
                                options={branches?.map(b => ({ value: b.id, label: b.name })) || []}
                                placeholder="Filial seçin"
                                onChange={(val) => field.onChange(Number(val))}
                                value={field.value}
                              />
                            )}
                          />
                        </div>
                        <div className="w-64">
                          <Label>Rəng</Label>
                          <Controller
                            name={`branchStocks.${index}.color`}
                            control={control}
                            render={({ field }) => (
                              <SearchableSelect
                                options={COLOR_OPTIONS}
                                placeholder="Rəng seçin"
                                value={field.value}
                                onChange={field.onChange}
                                allowCustomValue={true}
                              />
                            )}
                          />
                        </div>
                        <div className="w-48">
                          <Label>Ölçü</Label>
                          <Controller
                            name={`branchStocks.${index}.size`}
                            control={control}
                            render={({ field }) => (
                              <SearchableSelect
                                options={availableSizes ? availableSizes.map(s => ({ value: s, label: s })) : []}
                                placeholder="Ölçü"
                                value={field.value}
                                onChange={field.onChange}
                                allowCustomValue={true}
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
                        Heç bir stok sətri əlavə edilməyib. Hər rəng+ölçü kombinasiyası üçün ayrıca sətir əlavə edin.
                      </p>
                    )}
                  </div>
                </div>

                {/* Banner Image (Single) */}
                <div>
                  <Label htmlFor="bannerFile" required>Vitrin Şəkli (Əsas Şəkil)</Label>
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
                  <Label htmlFor="additionalFiles" optional>Digər Şəkillər (Çoxlu Seçim)</Label>
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
                  <Label htmlFor="tags" optional>teqlər (Vergüllə ayırın)</Label>
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
                <div className="">
                  <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-100">Məhsul Variantları</h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
                    <div>
                      <Label>Variant Adı (məs: Material)</Label>
                      <Input
                        value={variantName}
                        onChange={(e) => setVariantName(e.target.value)}
                        placeholder="Material"
                      />
                    </div>
                    <div>
                      <Label>Dəyərlər (Vergüllə ayırın)</Label>
                      <Input
                        value={variantValues}
                        onChange={(e) => setVariantValues(e.target.value)}
                        placeholder="Pambıq, Poliester, Dəri"
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
                <div className="select-none!">
                  <Controller
                    name="isFeatured"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
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

      <QuickCreateBrandModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        onSuccess={(brandId) => {
          setValue("brandId", brandId);
        }}
      />
    </>
  );
}
