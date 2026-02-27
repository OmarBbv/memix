import { useState } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import { PlusIcon } from "../../../icons";
import { useBrands, useDeleteBrand } from "../../../hooks/useBrands";
import BrandTable from "./BrandTable";
import { Brand } from "../../../types/brand";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import toast from "react-hot-toast";

const Brands: React.FC = () => {
  const { data: brands, isLoading } = useBrands();
  const deleteMutation = useDeleteBrand();

  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<number | null>(null);

  const handleEdit = (brand: Brand) => {
    navigate(`/marketing/brands/edit/${brand.id}`);
  };

  const handleCreate = () => {
    navigate("/marketing/brands/create");
  };

  const openDeleteDialog = (id: number) => {
    setBrandToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (brandToDelete) {
      deleteMutation.mutate(brandToDelete, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          toast.success("Marka uğurla silindi");
        }
      });
    }
  };

  return (
    <>
      <PageMeta title="Markalar | Memix Admin" description="Markaların idarə edilməsi" />
      <PageBreadcrumb pageTitle="Markalar" />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-end">
          <button onClick={handleCreate} className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-600 active:scale-95">
            <PlusIcon className="size-5" />
            <span>Yeni Marka</span>
          </button>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/3 md:p-8">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
            </div>
          ) : brands && brands.length > 0 ? (
            <BrandTable brands={brands} onEdit={handleEdit} onDelete={openDeleteDialog} />
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-500 dark:text-gray-400">Heç bir marka tapılmadı.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Markanı Sil"
        description="Bu markanı silmək istədiyinizə əminsiniz?"
        confirmLabel="Sil"
        cancelLabel="Ləğv et"
        isDanger={true}
      />
    </>
  );
};

export default Brands;
