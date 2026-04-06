import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import { ChevronLeftIcon } from "../../icons";
import { useCreateWarehouseLog, useCategoryValuation } from "../../hooks/useWarehouseLogs";
import { useCategories } from "../../hooks/useCategories";
import { allowOnlyNumbers } from "../../utils/inputHelpers";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import SearchableSelect from "../../components/ui/select/SearchableSelect";
import DatePicker from "../../components/form/date-picker";
import TextArea from "../../components/form/input/TextArea";
import { getCategoryPath } from "../../utils/categoryHelpers";
import Button from "../../components/ui/button/Button";
import toast from "react-hot-toast";
import { useEffect } from "react";

const logSchema = z.object({
  recordDate: z.string().min(1, "Tarix seçilməlidir"),
  productCount: z.coerce.number().min(0, "Sayı mənfi ola bilməz"),
  totalAmount: z.coerce.number().min(0, "Məbləğ mənfi ola bilməz"),
  categoryId: z.coerce.number().optional(),
  note: z.string().optional(),
});

type LogFormValues = z.infer<typeof logSchema>;

const CreateWarehouseLog: React.FC = () => {
  const { data: categories } = useCategories();
  const navigate = useNavigate();
  const createMutation = useCreateWarehouseLog();

  const { control, register, handleSubmit, watch, setValue, formState: { errors } } = useForm<LogFormValues>({
    resolver: zodResolver(logSchema) as any,
    defaultValues: {
      recordDate: new Date().toISOString().split('T')[0],
      productCount: "" as any,
      totalAmount: "" as any,
      categoryId: undefined,
      note: "",
    },
  });

  const selectedCategoryId = watch("categoryId");
  const productCount = watch("productCount");

  const { data: valuation } = useCategoryValuation(selectedCategoryId);

  useEffect(() => {
    if (valuation && productCount) {
      const calculatedAmount = valuation * Number(productCount);
      setValue("totalAmount", calculatedAmount);
    }
  }, [valuation, productCount, setValue]);

  const handleCreate = (values: LogFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Qeyd uğurla əlavə edildi");
        navigate("/warehouse-logs");
      },
      onError: () => {
        toast.error("Xəta baş verdi");
      }
    });
  };

  return (
    <>
      <PageMeta
        title="Yeni Anbar Qeydi | Memix Admin"
        description="Yeni anbar qeydi əlavə edin"
      />
      <div className="mb-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-brand-500 dark:text-gray-400"
        >
          <ChevronLeftIcon className="size-5" />
          <span>Geri</span>
        </button>
      </div>
      <PageBreadcrumb pageTitle="Yeni Anbar Qeydi" />

      <div className="flex flex-col gap-6">
        <div className="max-w-xl">
          <ComponentCard title="Yeni Qeyd Forması" desc="Gündəlik hesabat məlumatlarını aşağıdakı xanalara daxil edin">
            <form onSubmit={handleSubmit(handleCreate)} className="flex flex-col gap-6">
              <div>
                <Label>Tarix</Label>
                <Controller
                  name="recordDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      id="recordDate"
                      placeholder="YYYY-MM-DD"
                      defaultDate={field.value}
                      onChange={(_, dateStr) => field.onChange(dateStr)}
                    />
                  )}
                />
                {errors.recordDate && <p className="mt-1 text-xs text-red-500">{errors.recordDate.message}</p>}
              </div>

              <div>
                <Label>Kateqoriya</Label>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => {
                    const leafCategories = categories?.filter(cat =>
                      !categories.some(child => (child.parentId === cat.id || child.parent?.id === cat.id))
                    ) || [];

                    return (
                      <SearchableSelect
                        options={leafCategories.map((cat: any) => ({
                          label: getCategoryPath(cat, categories || []),
                          value: cat.id,
                        }))}
                        placeholder="Kateqoriya seçin"
                        onChange={(val) => field.onChange(val)}
                        value={field.value}
                        error={!!errors.categoryId}
                      />
                    );
                  }}
                />
                {errors.categoryId && <p className="mt-1 text-xs text-red-500">{errors.categoryId.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Məhsul Sayı</Label>
                  <Input
                    type="text"
                    {...register("productCount")}
                    onInput={(e) => allowOnlyNumbers(e)}
                    placeholder="Məs: 1000"
                    autoComplete="off"
                  />
                  {errors.productCount && <p className="mt-1 text-xs text-red-500">{errors.productCount.message}</p>}
                </div>

                <div>
                  <Label>Ümumi Məbləğ (AZN)</Label>
                  <Input
                    type="text"
                    {...register("totalAmount")}
                    onInput={(e) => allowOnlyNumbers(e, true)}
                    placeholder="Məs: 1000.00"
                    autoComplete="off"
                  />
                  {errors.totalAmount && <p className="mt-1 text-xs text-red-500">{errors.totalAmount.message}</p>}
                </div>
              </div>

              <div>
                <Label>Məlumat (Qeyd)</Label>
                <Controller
                  name="note"
                  control={control}
                  render={({ field }) => (
                    <TextArea
                      {...field}
                      onChange={(val) => field.onChange(val)}
                      rows={4}
                      placeholder="Əlavə məlumat qeyd edin..."
                    />
                  )}
                />
              </div>

              <div className="flex items-center gap-4 mt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Yadda saxlanılır..." : "Yadda saxla"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="flex-1"
                  onClick={() => navigate("/warehouse-logs")}
                >
                  Ləğv et
                </Button>
              </div>
            </form>
          </ComponentCard>
        </div>
      </div>
    </>
  );
};

export default CreateWarehouseLog;
