'use client';

import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Package } from "lucide-react";
import Image from "next/image";

export default function OrdersPage() {
  const orders = [
    {
      id: "ORD-293812",
      date: "15 Yanvar 2026",
      status: "Teslim Edildi",
      statusColor: "text-green-600",
      statusIcon: CheckCircle2,
      total: "145.00 ₼",
      image: "https://images.unsplash.com/photo-1550614000-4b9519e09d43?w=500&auto=format&fit=crop&q=60",
      items: "Zara Jaket, H&M Şalvar..."
    },
    {
      id: "ORD-293755",
      date: "12 Yanvar 2026",
      status: "Kargoda",
      statusColor: "text-amber-600",
      statusIcon: Package,
      total: "45.00 ₼",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60",
      items: "Nike T-shirt"
    },
    {
      id: "ORD-291002",
      date: "28 Dekabr 2025",
      status: "Hazırlanır",
      statusColor: "text-blue-600",
      statusIcon: Clock,
      total: "210.00 ₼",
      image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&auto=format&fit=crop&q=60",
      items: "Bershka Palto"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Sifarişlərim</h1>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:border-zinc-300 transition-colors">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image */}
              <div className="relative w-24 h-32 md:w-32 md:h-32 shrink-0 rounded-xl overflow-hidden bg-zinc-100">
                <Image
                  src={order.image}
                  alt="Product"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-zinc-900">Sifariş #{order.id}</h3>
                      <p className="text-sm text-zinc-500">{order.date}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-100 text-sm font-medium ${order.statusColor}`}>
                      <order.statusIcon className="w-4 h-4" />
                      {order.status}
                    </div>
                  </div>
                  <p className="text-zinc-600 text-sm mb-4">{order.items}</p>
                </div>

                <div className="flex items-center justify-between mt-4 md:mt-0">
                  <p className="text-lg font-bold text-zinc-900">{order.total}</p>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="rounded-lg h-9 text-xs">
                      Detallar
                    </Button>
                    <Button size="sm" className="rounded-lg h-9 text-xs bg-zinc-900 text-white hover:bg-zinc-800">
                      Təkrar Sifariş
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
