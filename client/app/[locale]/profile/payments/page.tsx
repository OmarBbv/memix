'use client';

import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useCards, useDeleteCard } from "@/hooks/useCards";
import { AddCardDialog } from "@/components/profile/AddCardDialog";
import { useState } from "react";
import { ContentState } from "@/components/shared/ContentState";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PaymentsPage() {
  const { data: cards, isLoading, isError } = useCards();
  const deleteCard = useDeleteCard();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<number | null>(null);

  const handleDelete = () => {
    if (cardToDelete) {
      deleteCard.mutate(cardToDelete, {
        onSuccess: () => setCardToDelete(null)
      });
    }
  };

  return (
    <ContentState isLoading={isLoading} isError={isError} errorMessage="Kartlar yüklənmədi">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900">Qeydli Kartlarım</h1>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl"
          >
            <Plus className="w-4 h-4" />
            Yeni Kart Əlavə Et
          </Button>
        </div>

        {cards && cards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`
                  relative p-6 rounded-2xl shadow-sm border border-zinc-200 overflow-hidden text-white
                  ${card.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-700' : ''}
                  ${card.color === 'black' ? 'bg-gradient-to-br from-zinc-800 to-zinc-950' : ''}
                  ${card.color === 'purple' ? 'bg-gradient-to-br from-purple-500 to-purple-700' : ''}
                  ${card.color === 'pink' ? 'bg-gradient-to-br from-pink-500 to-pink-700' : ''}
                  ${!card.color ? 'bg-gradient-to-br from-zinc-500 to-zinc-700' : ''} 
                `}
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="text-lg font-bold uppercase tracking-wider">{card.brand}</div>
                  <button
                    onClick={() => setCardToDelete(card.id)}
                    disabled={deleteCard.isPending}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="text-2xl font-mono tracking-widest drop-shadow-md">{card.cardNumberMasked}</div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs opacity-75 uppercase mb-1">Card Holder</div>
                      <div className="font-medium uppercase tracking-wide">{card.holderName}</div>
                    </div>
                    <div>
                      <div className="text-xs opacity-75 uppercase mb-1">Expires</div>
                      <div className="font-medium tracking-wide">{String(card.expMonth).padStart(2, '0')}/{String(card.expYear).slice(-2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-zinc-300 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
              <CreditCardIcon className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-1">Hələ ki, qeydli kartınız yoxdur</h3>
            <p className="text-zinc-500 max-w-sm">
              Ödənişlərinizi daha sürətli həyata keçirmək üçün kartınızı təhlükəsiz şəkildə yadda saxlayın.
            </p>
          </div>
        )}

        <AddCardDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

        <AlertDialog open={!!cardToDelete} onOpenChange={(open) => !open && setCardToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Kartı silmək istədiyinizə əminsiniz?</AlertDialogTitle>
              <AlertDialogDescription>
                Bu əməliyyat geri qaytarıla bilməz. Kart məlumatlarınız tamamilə silinəcək.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Ləğv et</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                {deleteCard.isPending ? "Silinir..." : "Sil"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ContentState>
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
