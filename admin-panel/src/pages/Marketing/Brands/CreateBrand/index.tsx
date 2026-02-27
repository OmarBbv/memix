import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../../components/common/PageMeta";
import { useCreateBrand, useUpdateBrand, useBrand } from "../../../../hooks/useBrands";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import toast from "react-hot-toast";
import { CreateBrandFormValues, createBrandSchema } from "../../../../validations/brandSchema";
import { useParams } from "react-router";

export default function CreateBrand() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { data: brand, isLoading } = useBrand(Number(id));
  const createMutation = useCreateBrand();
  const updateMutation = useUpdateBrand();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateBrandFormValues>({
    resolver: zodResolver(createBrandSchema),
    defaultValues: {
      name: "",
      slug: "",
      logoUrl: "",
      isActive: true,
      showOnHome: true,
      order: 0,
    },
  });

  React.useEffect(() => {
    if (brand && isEditing) {
      reset({
        name: brand.name,
        slug: brand.slug,
        logoUrl: brand.logoUrl || "",
        isActive: brand.isActive,
        showOnHome: brand.showOnHome,
        order: brand.order,
      });
    }
  }, [brand, isEditing, reset]);

  const onSubmit = (values: CreateBrandFormValues) => {
    if (isEditing) {
      updateMutation.mutate({ id: Number(id), data: values }, {
        onSuccess: () => {
          toast.success("Marka yeniləndi");
          navigate("/marketing/brands");
        }
      });
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          toast.success("Marka əlavə edildi");
          navigate("/marketing/brands");
        }
      });
    }
  };

  if (isEditing && isLoading) return <div>Yüklənir...</div>;

  return (
    <>
      <PageMeta title={`Marka ${isEditing ? "Yenilə" : "Əlavə Et"} | Memix Admin`} description="Marka haqqında məlumatlar" />
      <PageBreadcrumb pageTitle={`Marka ${isEditing ? "Yenilə" : "Əlavə Et"}`} />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/3 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-2xl">
          <div>
            <Label htmlFor="name">Marka Adı</Label>
            <Input id="name" {...register("name")} error={!!errors.name} hint={errors.name?.message} />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" {...register("slug")} error={!!errors.slug} hint={errors.slug?.message} />
          </div>
          <div>
            <Label htmlFor="logoUrl">Logo URL (opsional)</Label>
            <Input id="logoUrl" {...register("logoUrl")} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="showOnHome" className="w-5 h-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500" {...register("showOnHome")} />
            <Label htmlFor="showOnHome" className="mb-0">Ana səhifədə göstər</Label>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="isActive" className="w-5 h-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500" {...register("isActive")} />
            <Label htmlFor="isActive" className="mb-0">Aktivdir</Label>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <Button className="w-full sm:w-auto" type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              Yadda saxla
            </Button>
            <Button variant="outline" type="button" onClick={() => navigate("/marketing/brands")} className="w-full sm:w-auto">
              Ləğv et
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
