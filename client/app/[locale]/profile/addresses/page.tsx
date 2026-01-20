'use client';

import { Button } from "@/components/ui/button";
import { Plus, MapPin, Pencil, Trash2 } from "lucide-react";

export default function AddressesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Ünvanlarım</h1>
        <Button className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl">
          <Plus className="w-4 h-4" />
          Yeni Ünvan Əlavə Et
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Adres Kartı 1 */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:border-zinc-400 transition-all group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-zinc-900"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-zinc-600" />
              </div>
              <h3 className="font-bold text-zinc-900">Ev</h3>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-600 transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-1 text-sm text-zinc-600 mb-4">
            <p className="font-medium text-zinc-900">Nadir Həbibov</p>
            <p>Nizami ray., Qara Qarayev pr. 55</p>
            <p>Mənzil 24, Blok 3</p>
            <p>Bakı, Azərbaycan</p>
            <p className="pt-2">+994 50 123 45 67</p>
          </div>
        </div>

        {/* Adres Kartı 2 */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:border-zinc-400 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-zinc-600" />
              </div>
              <h3 className="font-bold text-zinc-900">İş</h3>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-600 transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-1 text-sm text-zinc-600 mb-4">
            <p className="font-medium text-zinc-900">Nadir Həbibov</p>
            <p>Səbail ray., Nizami küç. 10</p>
            <p>Ofis 305</p>
            <p>Bakı, Azərbaycan</p>
            <p className="pt-2">+994 55 987 65 43</p>
          </div>
        </div>

        {/* Yeni Ekle Placeholder */}
        <button className="h-full min-h-[200px] border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-all group">
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-white border border-zinc-200 group-hover:border-zinc-300 transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-medium">Yeni Ünvan Əlavə Et</span>
        </button>
      </div>
    </div>
  );
}
