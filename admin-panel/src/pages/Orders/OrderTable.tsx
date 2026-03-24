import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { Order, OrderStatus } from "../../types/order";
import { EyeIcon, TrashBinIcon } from "../../icons";

interface OrderTableProps {
  orders: Order[];
  onView: (order: Order) => void;
  onDelete: (id: number) => void;
}

export default function OrderTable({ orders, onView, onDelete }: OrderTableProps) {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return "warning";
      case OrderStatus.PREPARING: return "info";
      case OrderStatus.READY: return "info";
      case OrderStatus.ON_WAY: return "brand";
      case OrderStatus.DELIVERED: return "success";
      case OrderStatus.CANCELLED: return "error";
      default: return "light";
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return "Gözləyir";
      case OrderStatus.PREPARING: return "Hazırlanır";
      case OrderStatus.READY: return "Hazırdır";
      case OrderStatus.ON_WAY: return "Yoldadır";
      case OrderStatus.DELIVERED: return "Çatdırıldı";
      case OrderStatus.CANCELLED: return "Ləğv edildi";
      default: return status;
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/5">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Sifariş ID
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Müştəri
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Məbləğ
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Tarix
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Status
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                Əməliyyatlar
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-white/1">
                <TableCell className="px-5 py-4 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  #{order.id}
                </TableCell>
                <TableCell className="px-5 py-4 text-start">
                  <div className="flex flex-col">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {order.user?.name || "Qonaq"}
                    </span>
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      {order.contactPhone || "Telefon qeyd olunmayıb"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-5 py-4 text-start font-bold text-gray-900 text-theme-sm dark:text-white/90">
                  {Number(order.totalPrice).toFixed(2)} AZN
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString('az-AZ', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell className="px-5 py-4 text-start">
                  <Badge
                    size="sm"
                    color={getStatusColor(order.status) as any}
                  >
                    {getStatusText(order.status)}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 py-4 text-end">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView(order)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-500 transition-all hover:border-brand-500 hover:text-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-500"
                      title="Detallar"
                    >
                      <EyeIcon className="size-4" />
                    </button>
                    <button
                      onClick={() => onDelete(order.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-500 transition-all hover:border-red-500 hover:text-red-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-red-500"
                      title="Sil"
                    >
                      <TrashBinIcon className="size-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
