import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { WarehouseLog } from "../../types/warehouse-log";
import { TrashBinIcon } from "../../icons";

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
                Məhsul Sayı
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Ümumi Məbləğ
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
                  {log.productCount} ədəd
                </TableCell>
                <TableCell className="px-5 py-4 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {log.totalAmount} AZN
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400 truncate max-w-[200px]">
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
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
