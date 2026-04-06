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
import {
  BoxIconLine,
  DollarLineIcon,
  GroupIcon,
} from "../../icons";

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

  const statsTotals = stats?.reduce((acc, curr) => ({
    logTotalAmount: acc.logTotalAmount + curr.logTotalAmount,
    logTotalCount: acc.logTotalCount + curr.logTotalCount,
    productTotalValue: acc.productTotalValue + curr.productTotalValue,
    productTotalCount: acc.productTotalCount + curr.productTotalCount,
    balance: acc.balance + curr.balance
  }), {
    logTotalAmount: 0,
    logTotalCount: 0,
    productTotalValue: 0,
    productTotalCount: 0,
    balance: 0
  }) || {
    logTotalAmount: 0,
    logTotalCount: 0,
    productTotalValue: 0,
    productTotalCount: 0,
    balance: 0
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

        {/* Statistika Kartları */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <DollarLineIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="mt-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">Ümumi Büdcə</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {isStatsLoading ? "..." : `${formatNumber(statsTotals.logTotalAmount)} AZN`}
              </h4>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-brand-50 rounded-xl dark:bg-brand-500/10">
              <DollarLineIcon className="text-brand-500 size-6" />
            </div>
            <div className="mt-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">Faktiki Xərc</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {isStatsLoading ? "..." : `${formatNumber(statsTotals.productTotalValue)} AZN`}
              </h4>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-50 rounded-xl dark:bg-orange-500/10">
              <BoxIconLine className="text-orange-500 size-6" />
            </div>
            <div className="mt-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">Ümumi Məhsul Sayı</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {isStatsLoading ? "..." : `${formatNumber(statsTotals.productTotalCount, 0)} ədəd`}
              </h4>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${statsTotals.balance >= 0 ? "bg-green-50 dark:bg-green-500/10" : "bg-red-50 dark:bg-red-500/10"}`}>
              <GroupIcon className={`size-6 ${statsTotals.balance >= 0 ? "text-green-500" : "text-red-500"}`} />
            </div>
            <div className="mt-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">Ümumi Balans</span>
              <h4 className={`mt-2 font-bold text-title-sm ${statsTotals.balance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {isStatsLoading ? "..." : `${formatNumber(statsTotals.balance)} AZN`}
              </h4>
            </div>
          </div>
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
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Büdcə (Say)</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Faktiki (Say)</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Büdcə (Məbləğ)</TableCell>
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
                        {formatNumber(s.logTotalCount, 0)} ədəd
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                        {formatNumber(s.productTotalCount, 0)} ədəd
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
                  {/* Total Row */}
                  <TableRow className="bg-gray-50/50 dark:bg-white/1 font-bold">
                    <TableCell className="px-5 py-4 text-start text-gray-800 text-theme-sm dark:text-white/90">
                      CƏMİ
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-800 text-theme-sm dark:text-white/90">
                      {formatNumber(statsTotals.logTotalCount, 0)} ədəd
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-800 text-theme-sm dark:text-white/90">
                      {formatNumber(statsTotals.productTotalCount, 0)} ədəd
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-800 text-theme-sm dark:text-white/90">
                      {formatNumber(statsTotals.logTotalAmount)} AZN
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-800 text-theme-sm dark:text-white/90">
                      {formatNumber(statsTotals.productTotalValue)} AZN
                    </TableCell>
                    <TableCell className={`px-5 py-4 text-end text-theme-sm ${statsTotals.balance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      {formatNumber(statsTotals.balance)} AZN
                    </TableCell>
                  </TableRow>
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
