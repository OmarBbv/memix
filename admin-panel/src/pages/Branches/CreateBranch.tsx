import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { ChevronLeftIcon } from "../../icons";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { useCreateBranch } from "../../hooks/useBranches";

const branchSchema = z.object({
  name: z.string().min(1, "Filial adı mütləqdir"),
  address: z.string().optional(),
  phone: z.string().optional(),
});

type BranchFormValues = z.infer<typeof branchSchema>;

export default function CreateBranch() {
  const navigate = useNavigate();
  const createMutation = useCreateBranch();

  const { register, handleSubmit, formState: { errors } } = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
    },
  });

  const onSubmit = (values: BranchFormValues) => {
    createMutation.mutate(values as any, {
      onSuccess: () => {
        toast.success("Filial əlavə edildi");
        navigate("/branches");
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

      <PageBreadcrumb pageTitle="Yeni Filial" />

      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          <ComponentCard title="Filial Məlumatları">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <div>
                <Label htmlFor="name">Filial Adı</Label>
                <Input
                  id="name"
                  placeholder="Məs: Gənclik Filialı"
                  {...register("name")}
                  error={!!errors.name}
                  hint={errors.name?.message}
                />
              </div>

              <div>
                <Label htmlFor="address">Ünvan</Label>
                <Input
                  id="address"
                  placeholder="Filialın ünvanı"
                  {...register("address")}
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  placeholder="Əlaqə nömrəsi"
                  {...register("phone")}
                />
              </div>

              <div className="mt-6">
                <Button
                  className="w-full"
                  type="submit"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Əlavə edilir..." : "Əlavə et"}
                </Button>
              </div>
            </form>
          </ComponentCard>
        </div>
      </div>
    </>
  );
}
