import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { PlusIcon } from "../../icons";
import { useBranches, useUpdateBranch, useDeleteBranch } from "../../hooks/useBranches";
import BranchTable from "./BranchTable";
import { Branch } from "../../types/branch";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import toast from "react-hot-toast";

const branchSchema = z.object({
  name: z.string().min(1, "Filial adı mütləqdir"),
  address: z.string().optional(),
  phone: z.string().optional(),
});

type BranchFormValues = z.infer<typeof branchSchema>;

const Branches: React.FC = () => {
  const navigate = useNavigate();
  const { data: branches, isLoading } = useBranches();
  const updateMutation = useUpdateBranch();
  const deleteMutation = useDeleteBranch();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
    },
  });

  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch);
    reset({
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    navigate("/branches/create");
  };

  const openDeleteDialog = (id: number) => {
    setBranchToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (branchToDelete) {
      deleteMutation.mutate(branchToDelete, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          toast.success("Filial uğurla silindi");
        }
      });
    }
  };

  const onSubmit = (values: BranchFormValues) => {
    if (selectedBranch) {
      updateMutation.mutate({ id: selectedBranch.id, data: values }, {
        onSuccess: () => {
          setIsModalOpen(false);
          toast.success("Filial yeniləndi");
        }
      });
    }
  };

  return (
    <>
      <PageMeta
        title="Filiallar | Memix Admin"
        description="Filialların idarə edilməsi"
      />
      <PageBreadcrumb pageTitle="Filiallar" />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
            Filial Siyahısı
          </h2>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-600 active:scale-95"
          >
            <PlusIcon className="size-5" />
            <span>Yeni Filial</span>
          </button>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/3 md:p-8">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
            </div>
          ) : branches && branches.length > 0 ? (
            <BranchTable
              branches={branches}
              onEdit={handleEdit}
              onDelete={openDeleteDialog}
            />
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Sistemdə hələ heç bir filial yoxdur.
              </p>
              <button
                onClick={handleCreate}
                className="mt-4 text-brand-500 hover:underline text-sm font-medium"
              >
                İlk filialı indi əlavə edin
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Filialı Sil"
        description="Bu filialı silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz."
        confirmLabel="Bəli, Sil"
        cancelLabel="Ləğv et"
        isDanger={true}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="max-w-[500px] p-6"
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">
              Filialı Yenilə
            </h3>
            <p className="text-sm text-gray-500">
              Filial məlumatlarını daxil edin
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

            <div className="flex items-center gap-3 mt-4">
              <Button
                className="flex-1"
                type="submit"
                disabled={updateMutation.isPending}
              >
                Yadda saxla
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsModalOpen(false)}
              >
                Ləğv et
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default Branches;
