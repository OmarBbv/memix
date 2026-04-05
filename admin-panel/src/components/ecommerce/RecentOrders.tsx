import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useOrders } from "../../hooks/useOrders";
import { OrderStatus } from "../../types/order";
import { Link } from "react-router";
import { formatNumber } from "../../utils/numberFormat";

export default function RecentOrders() {
  const { data: orders, isLoading } = useOrders();

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED: return "success";
      case OrderStatus.PENDING: return "warning";
      case OrderStatus.CANCELLED: return "error";
      case OrderStatus.PREPARING:
      case OrderStatus.READY:
      case OrderStatus.ON_WAY: return "brand";
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

  if (isLoading) {
    return (
      <div className="h-[400px] w-full animate-pulse rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3"></div>
    );
  }

  const recentOrders = orders?.slice(0, 7) || [];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/3 sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Son Sifarişlər
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/orders" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200">
            Hamısına bax
          </Link>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Sifariş ID
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Müştəri
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Məbləğ
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Status
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Tarix
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    #{order.id}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {order.user?.name || "Qonaq"}
                  </TableCell>
                  <TableCell className="py-3 font-bold text-gray-900 text-theme-sm dark:text-white/90">
                    {formatNumber(Number(order.totalPrice))} AZN
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge size="sm" color={getStatusColor(order.status) as any}>
                      {getStatusText(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-xs dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('az-AZ')}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-gray-500 italic">
                  Sifariş tapılmadı
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
