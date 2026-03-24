import React, { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useOrders, useDeleteOrder } from "../../hooks/useOrders";
import OrderTable from "./OrderTable";
import OrderDetailModal from "./OrderDetailModal";
import { Order } from "../../types/order";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import toast from "react-hot-toast";

const Orders: React.FC = () => {
  const { data: orders, isLoading } = useOrders();
  const deleteMutation = useDeleteOrder();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const openDeleteDialog = (id: number) => {
    setOrderToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (orderToDelete) {
      deleteMutation.mutate(orderToDelete, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          toast.success("Sifariş uğurla silindi");
        },
        onError: () => {
          toast.error("Sifarişi silərkən xəta baş verdi");
        }
      });
    }
  };

  const openDetailModal = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  return (
    <>
      <PageMeta
        title="Sifarişlər | Memix Admin"
        description="Sifarişlərin idarə edilməsi"
      />
      <PageBreadcrumb pageTitle="Sifarişlər" />

      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/3 md:p-8">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
            </div>
          ) : orders && orders.length > 0 ? (
            <OrderTable
              orders={orders}
              onView={openDetailModal}
              onDelete={openDeleteDialog}
            />
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Sistemdə hələ heç bir sifariş yoxdur.
              </p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Sifarişi Sil"
        description="Bu sifarişi silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz."
        confirmLabel="Bəli, Sil"
        cancelLabel="Ləğv et"
        isDanger={true}
      />

      <OrderDetailModal
        order={selectedOrder}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </>
  );
};

export default Orders;
