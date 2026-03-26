import { Modal } from "../../components/ui/modal";
import { Order, OrderStatus } from "../../types/order";
import { useUpdateOrderStatus } from "../../hooks/useOrders";
import Badge from "../../components/ui/badge/Badge";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import Button from "../../components/ui/button/Button";
import toast from "react-hot-toast";

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailModal({ order, isOpen, onClose }: OrderDetailModalProps) {
  const updateStatus = useUpdateOrderStatus();

  if (!order) return null;

  const handleStatusChange = (newStatus: string) => {
    updateStatus.mutate(
      { id: order.id, status: newStatus as OrderStatus },
      {
        onSuccess: () => {
          toast.success("Sifariş statusu yeniləndi");
          onClose();
        },
        onError: () => {
          toast.error("Status yenilənərkən xəta baş verdi");
        }
      }
    );
  };

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
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] p-6 lg:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b pb-4 dark:border-gray-800">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
              Sifariş #{order.id}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleString('az-AZ')}
            </p>
          </div>
          <Badge color={getStatusColor(order.status) as any} size="md">
            {getStatusText(order.status)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Müştəri Məlumatları</h4>
            <div className="space-y-3">
              <div>
                <Label className="text-gray-400 mb-0.5">Adı:</Label>
                <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">{order.user?.name || "Qonaq"}</p>
              </div>
              <div>
                <Label className="text-gray-400 mb-0.5">Telefon:</Label>
                <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">{order.contactPhone || "Qeyd olunmayıb"}</p>
              </div>
              <div>
                <Label className="text-gray-400 mb-0.5">Ünvan:</Label>
                <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90 leading-relaxed">{order.address || "Qeyd olunmayıb"}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Statusu Dəyiş</h4>
            <div className="space-y-4">
              <div>
                <Label>Yeni Status</Label>
                <Select
                  options={[
                    { label: "Gözləyir", value: OrderStatus.PENDING },
                    { label: "Hazırlanır", value: OrderStatus.PREPARING },
                    { label: "Hazırdır", value: OrderStatus.READY },
                    { label: "Yoldadır", value: OrderStatus.ON_WAY },
                    { label: "Çatdırıldı", value: OrderStatus.DELIVERED },
                    { label: "Ləğv edildi", value: OrderStatus.CANCELLED },
                  ]}
                  value={order.status}
                  onChange={handleStatusChange}
                />
              </div>
              <p className="text-xs text-gray-400 italic">
                Statusu dəyişdikdə müştəriyə avtomatik bildiriş göndərilir (e-poçt və ya tətbiq daxili).
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Sifarişin Tərkibi</h4>
          <div className="rounded-xl border border-gray-100 overflow-hidden dark:border-gray-800">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Məhsul</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase text-center">Say</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase text-right">Qiymət</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {order.items?.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gray-50 border overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                          {item.product?.banner && (
                            <img src={item.product.banner} alt={item.product.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-theme-sm font-medium text-gray-800 dark:text-white/90">{item.product?.name}</span>
                          {item.variants && (
                            <span className="text-[10px] text-gray-400">
                              {Object.entries(item.variants).map(([k, v]) => `${k}: ${v}`).join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-theme-sm text-gray-500 font-medium">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-theme-sm font-bold text-gray-900 dark:text-white/90">{Number(item.price).toFixed(2)} AZN</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-right font-bold text-gray-500">Cəmi:</td>
                  <td className="px-4 py-3 text-right font-black text-lg text-brand-500">{Number(order.totalPrice).toFixed(2)} AZN</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t dark:border-gray-800">
          <Button variant="outline" onClick={onClose}>Bağla</Button>
        </div>
      </div>
    </Modal>
  );
}
