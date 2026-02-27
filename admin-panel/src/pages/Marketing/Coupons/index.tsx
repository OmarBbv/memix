import { useState } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import { PlusIcon } from "../../../icons";
import { useCoupons, useDeleteCoupon } from "../../../hooks/useCoupons";
import CouponTable from "./CouponTable";
import { Coupon } from "../../../types/coupon";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import toast from "react-hot-toast";

const Coupons: React.FC = () => {
  const { data: coupons, isLoading } = useCoupons();
  const deleteMutation = useDeleteCoupon();

  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<number | null>(null);

  const handleEdit = (coupon: Coupon) => {
    navigate(`/marketing/coupons/edit/${coupon.id}`);
  };

  const handleCreate = () => {
    navigate("/marketing/coupons/create");
  };

  const openDeleteDialog = (id: number) => {
    setCouponToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (couponToDelete) {
      deleteMutation.mutate(couponToDelete, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          toast.success("Kupon uğurla silindi");
        }
      });
    }
  };

  return (
    <>
      <PageMeta title="Kuponlar | Memix Admin" description="Kuponların idarə edilməsi" />
      <PageBreadcrumb pageTitle="Kuponlar" />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-end">
          <button onClick={handleCreate} className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-600 active:scale-95">
            <PlusIcon className="size-5" />
            <span>Yeni Kupon</span>
          </button>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/3 md:p-8">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
            </div>
          ) : coupons && coupons.length > 0 ? (
            <CouponTable coupons={coupons} onEdit={handleEdit} onDelete={openDeleteDialog} />
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-500">Heç bir kupon tapılmadı.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Kuponu Sil"
        description="Bu kuponu silmək istədiyinizə əminsiniz?"
        confirmLabel="Sil"
        cancelLabel="Ləğv et"
        isDanger={true}
      />
    </>
  );
};

export default Coupons;
