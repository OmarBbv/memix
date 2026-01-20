'use client';

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Qeydli Kartlarım</h1>
        <Button className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl">
          <Plus className="w-4 h-4" />
          Yeni Kart Əlavə Et
        </Button>
      </div>

      <div className="bg-white border border-dashed border-zinc-300 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
          <CreditCardIcon className="w-8 h-8 text-zinc-400" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 mb-1">Hələ ki, qeydli kartınız yoxdur</h3>
        <p className="text-zinc-500 max-w-sm">
          Ödənişlərinizi daha sürətli həyata keçirmək üçün kartınızı təhlükəsiz şəkildə yadda saxlayın.
        </p>
      </div>
    </div>
  );
}

function CreditCardIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}
