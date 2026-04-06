import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { WarehouseLog } from "../../types/warehouse-log";
import { TrashBinIcon } from "../../icons";
import { formatNumber } from "../../utils/numberFormat";

interface WarehouseLogTableProps {
  logs: WarehouseLog[];
  onDelete: (id: number) => void;
}

export default function WarehouseLogTable({ logs, onDelete }: WarehouseLogTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/5">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Tarix
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Büdcə (Say)
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Qalıq Say
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Büdcə (Məbləğ)
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Qalıq Məbləğ
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Məlumat
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                Əməliyyatlar
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {logs.map((log) => (
              <TableRow key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-white/1">
                <TableCell className="px-5 py-4 text-start text-gray-800 text-theme-sm dark:text-white/90">
                  {new Date(log.recordDate).toLocaleDateString('az-AZ')}
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                  {formatNumber(log.productCount, 0)} ədəd
                </TableCell>
                <TableCell className={`px-5 py-4 text-start font-medium text-theme-sm ${(log.balanceCount ?? 0) >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {formatNumber(log.balanceCount ?? log.productCount, 0)} ədəd
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                  {formatNumber(log.totalAmount)} AZN
                </TableCell>
                <TableCell className={`px-5 py-4 text-start font-bold text-theme-sm ${(log.balanceAmount ?? 0) >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {formatNumber(log.balanceAmount ?? log.totalAmount)} AZN
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400 truncate max-w-[150px]">
                  {log.note || "-"}
                </TableCell>
                <TableCell className="px-5 py-4 text-end">
                  <button
                    onClick={() => onDelete(log.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-500 transition-all hover:border-red-500 hover:text-red-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-red-500 ml-auto"
                  >
                    <TrashBinIcon className="size-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {/* Total Row */}
            {(() => {
              const totals = logs.reduce((acc, log) => ({
                productCount: acc.productCount + log.productCount,
                balanceCount: acc.balanceCount + (log.balanceCount ?? log.productCount),
                totalAmount: acc.totalAmount + log.totalAmount,
                balanceAmount: acc.balanceAmount + (log.balanceAmount ?? log.totalAmount)
              }), { productCount: 0, balanceCount: 0, totalAmount: 0, balanceAmount: 0 });

              return (
                <TableRow className="bg-gray-50/50 dark:bg-white/1 font-bold">
                  <TableCell className="px-5 py-4 text-start text-gray-800 text-theme-sm dark:text-white/90 uppercase">
                    CƏMİ
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-gray-800 text-theme-sm dark:text-white/90">
                    {formatNumber(totals.productCount, 0)} ədəd
                  </TableCell>
                  <TableCell className={`px-5 py-4 text-start text-theme-sm ${totals.balanceCount >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {formatNumber(totals.balanceCount, 0)} ədəd
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-gray-800 text-theme-sm dark:text-white/90">
                    {formatNumber(totals.totalAmount)} AZN
                  </TableCell>
                  <TableCell className={`px-5 py-4 text-start text-theme-sm ${totals.balanceAmount >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {formatNumber(totals.balanceAmount)} AZN
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-gray-800 text-theme-sm dark:text-white/90">
                    -
                  </TableCell>
                  <TableCell className="px-5 py-4 text-end">
                    -
                  </TableCell>
                </TableRow>
              );
            })()}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
