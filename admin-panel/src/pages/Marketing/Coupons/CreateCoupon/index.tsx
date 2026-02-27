import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../../components/common/PageMeta";
import { useCreateCoupon, useUpdateCoupon, useCoupons } from "../../../../hooks/useCoupons";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import toast from "react-hot-toast";
import { CreateCouponFormValues, createCouponSchema } from "../../../../validations/couponSchema";
import { DiscountType } from "../../../../types/coupon";
import { useParams } from "react-router";

export default function CreateCoupon() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { data: coupons, isLoading } = useCoupons();
  const coupon = coupons?.find((c: any) => c.id === Number(id));

  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateCouponFormValues>({
    resolver: zodResolver(createCouponSchema),
    defaultValues: {
      code: "",
      type: DiscountType.PERCENTAGE,
      value: 0,
      isActive: true,
    },
  });

  React.useEffect(() => {
    if (coupon && isEditing) {
      reset({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minOrderAmount: coupon.minOrderAmount,
        usageLimit: coupon.usageLimit,
        isActive: coupon.isActive,
      });
    }
  }, [coupon, isEditing, reset]);

  const onSubmit = (values: CreateCouponFormValues) => {
    const payload = {
      ...values,
      usageLimit: values.usageLimit ?? undefined,
      expiresAt: values.expiresAt ?? undefined,
    };

    if (isEditing && coupon) {
      updateMutation.mutate({ id: coupon.id, data: payload }, {
        onSuccess: () => {
          toast.success("Kupon yeniləndi");
          navigate("/marketing/coupons");
        }
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Kupon yaradıldı");
          navigate("/marketing/coupons");
        }
      });
    }
  };

  if (isEditing && isLoading) return <div>Yüklənir...</div>;

  return (
    <>
      <PageMeta title={`Kupon ${isEditing ? "Yenilə" : "Yarat"} | Memix Admin`} description="Kupon haqqında məlumatlar" />
      <PageBreadcrumb pageTitle={`Kupon ${isEditing ? "Yenilə" : "Yarat"}`} />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/3 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-2xl">
          <div>
            <Label htmlFor="code">Kupon Kodu</Label>
            <Input id="code" {...register("code")} error={!!errors.code} hint={errors.code?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Növ</Label>
              <select {...register("type")} className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 dark:border-gray-700 dark:bg-gray-900">
                <option value={DiscountType.PERCENTAGE}>Faiz (%)</option>
                <option value={DiscountType.FIXED}>Sabit (Məbləğ)</option>
              </select>
            </div>
            <div>
              <Label htmlFor="value">Endirim dərəcəsi/məbləği</Label>
              <Input type="number" step="any" id="value" {...register("value", { valueAsNumber: true })} error={!!errors.value} hint={errors.value?.message} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minOrderAmount">Min. Sifariş (opsional)</Label>
              <Input type="number" step="any" id="minOrderAmount" {...register("minOrderAmount", { valueAsNumber: true })} />
            </div>
            <div>
              <Label htmlFor="usageLimit">İstifadə Limiti (opsional)</Label>
              <Input type="number" id="usageLimit" {...register("usageLimit", { valueAsNumber: true })} />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="isActive" className="w-5 h-5 rounded border-gray-300 text-brand-500" {...register("isActive")} />
            <Label htmlFor="isActive" className="mb-0">Aktivdir</Label>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Button className="w-full md:w-auto" type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              Yadda saxla
            </Button>
            <Button variant="outline" type="button" onClick={() => navigate("/marketing/coupons")} className="w-full md:w-auto">
              Ləğv et
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
