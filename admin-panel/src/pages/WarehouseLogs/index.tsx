import React, { useState } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { PlusIcon } from "../../icons";
import {
  useWarehouseLogs,
  useDeleteWarehouseLog,
  useWarehouseStats
} from "../../hooks/useWarehouseLogs";
import { WarehouseStats } from "../../types/warehouse-log";
import WarehouseLogTable from "./WarehouseLogTable";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { formatNumber } from "../../utils/numberFormat";
import toast from "react-hot-toast";

const WarehouseLogs: React.FC = () => {
  const navigate = useNavigate();
  const { data: logs, isLoading } = useWarehouseLogs();
  const { data: stats, isLoading: isStatsLoading } = useWarehouseStats();
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
            Anbar Hesabatları
          </h1>
          <button
            onClick={() => navigate("/warehouse-logs/create")}
            className="flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-600 active:scale-95 shadow-sm"
          >
            <PlusIcon className="size-5" />
            <span>Yeni Qeyd</span>
          </button>
        </div>

        {/* Gündəlik Balans Xülasəsi (1500 - 65 sistemi) */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/3 md:p-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            Gündəlik Balans Hesabatı (Anbar - Məhsul)
          </h2>
          {isStatsLoading ? (
            <div className="flex h-20 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
            </div>
          ) : stats && stats.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/5">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Tarix</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Büdcə (Anbar)</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Xərc (Məhsul)</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">Qalıq (Balans)</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                  {stats.map((s: WarehouseStats) => (
                    <TableRow key={s.date} className="hover:bg-gray-50/50 dark:hover:bg-white/1">
                      <TableCell className="px-5 py-4 text-start text-gray-800 text-theme-sm dark:text-white/90">
                        {new Date(s.date).toLocaleDateString('az-AZ')}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                        {formatNumber(s.logTotalAmount)} AZN
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                        {formatNumber(s.productTotalValue)} AZN
                      </TableCell>
                      <TableCell className={`px-5 py-4 text-end text-theme-sm font-bold ${s.balance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                        {formatNumber(s.balance)} AZN
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-4 text-center text-gray-500 dark:text-gray-400">
              Məlumat tapılmadı.
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/3 md:p-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            Qeyd Siyahısı
          </h2>
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
