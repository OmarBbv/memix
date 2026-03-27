import React, { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useOrders, useDeleteOrder } from "../../hooks/useOrders";
import OrderTable from "./OrderTable";
import OrderDetailModal from "./OrderDetailModal";
import { Order } from "../../types/order";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import toast from "react-hot-toast";

import SearchInput from "../../components/common/SearchInput";
import Select from "../../components/form/Select";
import { OrderStatus } from "../../types/order";

const Orders: React.FC = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | undefined>(undefined);

  const { data: orders, isLoading } = useOrders(search, status);
  const deleteMutation = useDeleteOrder();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value === "all" ? undefined : (value as OrderStatus));
  };

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="w-full md:max-w-sm">
            <SearchInput
              placeholder="Sifariş ID və ya Müştəri axtar..."
              onSearch={handleSearch}
            />
          </div>
          <div className="w-full md:w-64">
            <Select
              options={[
                { label: "Bütün statuslar", value: "all" },
                { label: "Gözləyir", value: OrderStatus.PENDING },
                { label: "Hazırlanır", value: OrderStatus.PREPARING },
                { label: "Hazırdır", value: OrderStatus.READY },
                { label: "Yoldadır", value: OrderStatus.ON_WAY },
                { label: "Çatdırıldı", value: OrderStatus.DELIVERED },
                { label: "Ləğv edildi", value: OrderStatus.CANCELLED },
              ]}
              value={status || "all"}
              onChange={handleStatusChange}
            />
          </div>
        </div>

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
