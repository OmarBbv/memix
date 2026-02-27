import { useState } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import { PlusIcon } from "../../../icons";
import { useBanners, useDeleteBanner } from "../../../hooks/useBanners";
import BannerTable from "./BannerTable";
import { Banner } from "../../../types/banner";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import toast from "react-hot-toast";

const Banners: React.FC = () => {
  const { data: banners, isLoading } = useBanners();
  const deleteMutation = useDeleteBanner();

  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<number | null>(null);

  const handleEdit = (banner: Banner) => {
    navigate(`/marketing/banners/edit/${banner.id}`);
  };

  const handleCreate = () => {
    navigate("/marketing/banners/create");
  };

  const openDeleteDialog = (id: number) => {
    setBannerToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (bannerToDelete) {
      deleteMutation.mutate(bannerToDelete, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          toast.success("Banner uğurla silindi");
        }
      });
    }
  };

  return (
    <>
      <PageMeta title="Bannerlər | Memix Admin" description="Bannerlərin idarə edilməsi" />
      <PageBreadcrumb pageTitle="Bannerlər" />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-end">
          <button onClick={handleCreate} className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-600 active:scale-95">
            <PlusIcon className="size-5" />
            <span>Yeni Banner</span>
          </button>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/3 md:p-8">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
            </div>
          ) : banners && banners.length > 0 ? (
            <BannerTable banners={banners} onEdit={handleEdit} onDelete={openDeleteDialog} />
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-500">Heç bir banner tapılmadı.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Banneri Sil"
        description="Bu banneri silmək istədiyinizə əminsiniz?"
        confirmLabel="Sil"
        cancelLabel="Ləğv et"
        isDanger={true}
      />
    </>
  );
};

export default Banners;
