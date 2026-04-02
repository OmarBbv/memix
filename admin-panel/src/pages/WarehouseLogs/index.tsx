import React, { useState } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { PlusIcon } from "../../icons";
import { 
  useWarehouseLogs, 
  useDeleteWarehouseLog 
} from "../../hooks/useWarehouseLogs";
import WarehouseLogTable from "./WarehouseLogTable";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import toast from "react-hot-toast";

const WarehouseLogs: React.FC = () => {
  const navigate = useNavigate();
  const { data: logs, isLoading } = useWarehouseLogs();
  const deleteMutation = useDeleteWarehouseLog();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<number | null>(null);

  const openDeleteDialog = (id: number) => {
    setLogToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (logToDelete) {
      deleteMutation.mutate(logToDelete, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          toast.success("Qeyd silindi");
        }
      });
    }
  };

  return (
    <>
      <PageMeta
        title="Anbar Qeydləri | Memix Admin"
        description="Gündəlik anbar qeydlərinin idarə edilməsi"
      />
      <PageBreadcrumb pageTitle="Anbar Qeydləri" />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white/90">
            Gündəlik Hesabatlar
          </h1>
          <button
            onClick={() => navigate("/warehouse-logs/create")}
            className="flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-600 active:scale-95 shadow-sm"
          >
            <PlusIcon className="size-5" />
            <span>Yeni Qeyd</span>
          </button>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/3 md:p-8">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
            </div>
          ) : logs && logs.length > 0 ? (
            <WarehouseLogTable
              logs={logs}
              onDelete={openDeleteDialog}
            />
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Hələ heç bir qeyd yoxdur.
              </p>
              <button
                onClick={() => navigate("/warehouse-logs/create")}
                className="mt-4 text-brand-500 hover:underline text-sm font-medium"
              >
                İlk qeydi indi əlavə edin
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Qeydi Sil"
        description="Bu qeydi silmək istədiyinizə əminsiniz?"
        confirmLabel="Sil"
        cancelLabel="Ləğv et"
        isDanger={true}
      />
    </>
  );
};

export default WarehouseLogs;
