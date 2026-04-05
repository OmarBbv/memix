'use client';

import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Package, Truck, XCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useOrders } from "@/hooks/useOrders";
import { OrderStatus } from "@/types/order.types";
import { Loading } from "@/components/shared/Loading";
import { baseUrl } from "@/lib/httpClient";

const getStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.DELIVERED:
      return {
        label: "Çatdırıldı",
        color: "text-green-600",
        bgColor: "bg-green-50 border-green-100",
        icon: CheckCircle2
      };
    case OrderStatus.ON_WAY:
      return {
        label: "Yoldadır",
        color: "text-blue-600",
        bgColor: "bg-blue-50 border-blue-100",
        icon: Truck
      };
    case OrderStatus.READY:
      return {
        label: "Kuryerə Hazırdır",
        color: "text-purple-600",
        bgColor: "bg-purple-50 border-purple-100",
        icon: Package
      };
    case OrderStatus.PREPARING:
      return {
        label: "Hazırlanır",
        color: "text-amber-600",
        bgColor: "bg-amber-50 border-amber-100",
        icon: Clock
      };
    case OrderStatus.CANCELLED:
      return {
        label: "Ləğv edildi",
        color: "text-red-600",
        bgColor: "bg-red-50 border-red-100",
        icon: XCircle
      };
    default:
      return {
        label: "Gözləyir",
        color: "text-gray-600",
        bgColor: "bg-gray-50 border-gray-100",
        icon: Clock
      };
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('az-AZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const getImageUrl = (img?: string | null) => {
  const placeholder = "https://placehold.co/400x600?text=No+Image";
  if (!img || typeof img !== 'string') return placeholder;
  if (img.startsWith('http')) return img;
  const normalizedPath = img.startsWith('/') ? img : `/${img}`;
  return `${baseUrl}${normalizedPath}`;
};

export default function OrdersPage() {
  const { data: orders = [], isLoading, isError } = useOrders();

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <AlertCircle className="w-12 h-12 text-red-500 opacity-50" />
        <h3 className="text-lg font-medium">Sifarişləri yükləyərkən xəta baş verdi</h3>
        <p className="text-gray-500">Zəhmət olmasa bir az sonra yenidən cəhd edin</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <Package className="w-16 h-16 text-gray-300 mb-2" />
        <h3 className="text-lg font-medium">Hələ heç bir sifarişiniz yoxdur</h3>
        <p className="text-gray-500">Alış-verişə başlayın və ilk sifarişinizi verin!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 uppercase tracking-tighter">Sifarişlərim ({orders.length})</h1>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const config = getStatusConfig(order.status);
          const firstItem = order.items?.[0];
          const image = firstItem?.product?.banner;
          const itemsPreview = order.items.map(i => i.product.name).join(', ');

          return (
            <div key={order.id} className="group bg-white border border-zinc-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex flex-col md:flex-row gap-5">
                {/* Image */}
                <div className="relative w-20 h-28 md:w-24 md:h-24 shrink-0 rounded-xl overflow-hidden bg-zinc-50">
                  <Image
                    src={getImageUrl(image)}
                    alt="Order Thumbnail"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-2">
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-900">Sifariş №{order.id}</h3>
                        <p className="text-[11px] text-zinc-500 mt-0.5">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-medium ${config.bgColor} ${config.color}`}>
                        <config.icon className="w-3.5 h-3.5" />
                        {config.label}
                      </div>
                    </div>
                    <p className="text-zinc-600 text-xs mb-3 line-clamp-1">{itemsPreview}</p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-50">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Cəmi:</span>
                      <span className="text-base font-bold text-zinc-900">{Number(order.totalPrice).toFixed(2)} ₼</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" className="h-8 px-3 text-xs font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg">
                        Detallar
                      </Button>
                      <Button className="h-8 px-4 text-xs font-semibold bg-zinc-900 text-white hover:bg-black rounded-lg transition-colors">
                        Təkrar Sifariş
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
