'use client';

import { Button } from "@/components/ui/button";
import { Plus, MapPin, Pencil, Trash2, Loader2 } from "lucide-react";
import { useAddresses, useDeleteAddress } from "@/hooks/useAddress";
import { AddressDialog } from "@/components/profile/AddressDialog";
import { useState } from "react";
import { Address } from "@/types/address.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AddressesPage() {
  const { data: addresses, isLoading, isError } = useAddresses();
  const deleteAddress = useDeleteAddress();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingAddress(undefined);
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    if (addressToDelete) {
      deleteAddress.mutate(addressToDelete);
      setAddressToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Ünvanlar yüklənərkən xəta baş verdi.</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">Yenidən cəhd et</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Ünvanlarım</h1>
        <Button onClick={handleAddNew} className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl">
          <Plus className="w-4 h-4" />
          Yeni Ünvan Əlavə Et
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses?.map((address) => (
          <div key={address.id} className={`bg-white border rounded-2xl p-6 shadow-sm hover:border-zinc-400 transition-all group relative overflow-hidden ${address.isDefault ? 'border-zinc-900' : 'border-zinc-200'}`}>
            {address.isDefault && (
              <div className="absolute top-0 left-0 w-1 h-full bg-zinc-900"></div>
            )}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-zinc-600" />
                </div>
                <h3 className="font-bold text-zinc-900">{address.title}</h3>
                {address.isDefault && <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full ml-2">Varsayılan</span>}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(address)} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-600 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button onClick={() => setAddressToDelete(address.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Əminsiniz?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bu ünvanı silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Sil</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <div className="space-y-1 text-sm text-zinc-600 mb-4">
              <p><span className="text-zinc-400 font-medium">Ünvan:</span> {address.addressLine1}</p>
              {address.addressLine2 && <p><span className="text-zinc-400 font-medium">Mənzil:</span> {address.addressLine2}</p>}
              <p><span className="text-zinc-400 font-medium">Şəhər:</span> {address.city}{address.country ? `, ${address.country}` : ''}</p>
              {address.zipCode && <p><span className="text-zinc-400 font-medium">Poçt indeksi:</span> {address.zipCode}</p>}
              <p className="pt-2 font-medium text-zinc-800"><span className="text-zinc-400">Tel:</span> {address.phone}</p>
            </div>
          </div>
        ))}

        {/* Yeni Ekle Placeholder */}
        <button onClick={handleAddNew} className="h-full min-h-[200px] border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-all group">
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-white border border-zinc-200 group-hover:border-zinc-300 transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-medium">Yeni Ünvan Əlavə Et</span>
        </button>
      </div>

      <AddressDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        address={editingAddress}
      />
    </div>
  );
}
