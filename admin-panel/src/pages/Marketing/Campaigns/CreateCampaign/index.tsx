import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../../components/common/PageMeta";
import { useCreateCampaign, useUpdateCampaign, useCampaign } from "../../../../hooks/useCampaigns";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import toast from "react-hot-toast";
import { CreateCampaignFormValues, createCampaignSchema } from "../../../../validations/campaignSchema";
import { CampaignType } from "../../../../types/campaign";
import { useCoupons } from "../../../../hooks/useCoupons";

export default function CreateCampaign() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { data: campaign, isLoading } = useCampaign(Number(id));
  const { data: coupons } = useCoupons();
  const createMutation = useCreateCampaign();
  const updateMutation = useUpdateCampaign();

  const { register, handleSubmit, formState: { errors } } = useForm<CreateCampaignFormValues>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      title: "",
      description: "",
      type: CampaignType.DISCOUNT,
      imageUrl: "",
      badgeText: "",
      badgeColor: "",
      backgroundColor: "",
      link: "",
      isActive: true,
      order: 0,
    },
    values: campaign ? {
      title: campaign.title,
      description: campaign.description || "",
      type: campaign.type,
      imageUrl: campaign.imageUrl || "",
      badgeText: campaign.badgeText || "",
      badgeColor: campaign.badgeColor || "",
      backgroundColor: campaign.backgroundColor || "",
      link: campaign.link || "",
      couponId: campaign.couponId,
      startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().slice(0, 16) : undefined,
      endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().slice(0, 16) : undefined,
      isActive: campaign.isActive,
      order: campaign.order,
    } : undefined,
  });

  const onSubmit = (values: CreateCampaignFormValues) => {
    if (isEditing) {
      updateMutation.mutate({ id: Number(id), data: values }, {
        onSuccess: () => {
          toast.success("Kampaniya yeniləndi");
          navigate("/marketing/campaigns");
        }
      });
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          toast.success("Kampaniya əlavə edildi");
          navigate("/marketing/campaigns");
        }
      });
    }
  };

  if (isEditing && isLoading) return <div>Yüklənir...</div>;

  return (
    <>
      <PageMeta title={`Kampaniya ${isEditing ? "Yenilə" : "Əlavə Et"} | Memix Admin`} description="Kampaniya detalları" />
      <PageBreadcrumb pageTitle={`Kampaniya ${isEditing ? "Yenilə" : "Əlavə Et"}`} />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/3 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <div className="col-span-1 md:col-span-2">
            <Label htmlFor="title">Kampaniya Başlığı</Label>
            <Input id="title" {...register("title")} error={!!errors.title} hint={errors.title?.message} />
          </div>

          <div className="col-span-1 md:col-span-2">
            <Label htmlFor="description">Açıqlama</Label>
            <Input id="description" {...register("description")} />
          </div>

          <div>
            <Label htmlFor="type">Kampaniya Tipi</Label>
            <select
              id="type"
              {...register("type")}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-500"
            >
              <option value="discount">Endirim (Discount)</option>
              <option value="buy_x_get_y">X al Y qazan</option>
              <option value="free_shipping">Ödənişsiz Çatdırılma</option>
              <option value="bundle">Paket (Bundle)</option>
            </select>
          </div>

          <div>
            <Label htmlFor="couponId">Bağlı Kupon (Opsional)</Label>
            <select
              id="couponId"
              {...register("couponId")}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-500"
            >
              <option value="">Heç biri</option>
              {coupons?.map((c: any) => (
                <option key={c.id} value={c.id}>{c.code}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="imageUrl">Şəkil URL</Label>
            <Input id="imageUrl" {...register("imageUrl")} />
          </div>

          <div>
            <Label htmlFor="link">Keçid Linki (URL)</Label>
            <Input id="link" {...register("link")} />
          </div>

          <div>
            <Label htmlFor="badgeText">Nişan Mətni (Badge)</Label>
            <Input id="badgeText" {...register("badgeText")} placeholder="Məs: 50%, VIP" />
          </div>

          <div>
            <Label htmlFor="badgeColor">Nişan Rəngi (Hex)</Label>
            <Input id="badgeColor" {...register("badgeColor")} placeholder="Məs: #ef4444" />
          </div>

          <div>
            <Label htmlFor="startDate">Başlama Tarixi</Label>
            <Input type="datetime-local" id="startDate" {...register("startDate")} />
          </div>

          <div>
            <Label htmlFor="endDate">Bitmə Tarixi</Label>
            <Input type="datetime-local" id="endDate" {...register("endDate")} />
          </div>

          <div className="col-span-1 md:col-span-2 flex items-center gap-2 mt-2">
            <input type="checkbox" id="isActive" className="w-5 h-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500" {...register("isActive")} />
            <Label htmlFor="isActive" className="mb-0">Aktivdir</Label>
          </div>

          <div className="col-span-1 md:col-span-2 flex items-center gap-3 mt-4">
            <Button className="w-full sm:w-auto" type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              Yadda saxla
            </Button>
            <Button variant="outline" type="button" onClick={() => navigate("/marketing/campaigns")} className="w-full sm:w-auto">
              Ləğv et
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
