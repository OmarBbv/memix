'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeCart, removeFromCart, updateQuantity, incrementQuantityAsync } from '@/lib/redux/features/cartSlice';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useRouter } from '@/i18n/routing';

export const CartDrawer = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector((state) => state.cart);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    dispatch(closeCart());
    router.push('/checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && dispatch(closeCart())}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 h-full">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Səbət ({items.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 text-gray-500">
              <ShoppingBag className="w-12 h-12 opacity-20" />
              <p>Səbətiniz boşdur</p>
              <Button variant="outline" onClick={() => dispatch(closeCart())}>
                Alış-verişə başla
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="relative w-20 h-28 shrink-0 rounded-lg overflow-hidden bg-gray-100 border">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <Link href={`/product/${item.id}`} onClick={() => dispatch(closeCart())}>
                          <h4 className="font-medium text-sm line-clamp-2 hover:underline cursor-pointer">
                            {item.title}
                          </h4>
                        </Link>
                        <button
                          onClick={() => dispatch(removeFromCart({ id: item.id, size: item.size }))}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">Ölçü: {item.size}</p>
                      {item.seller && (
                        <p className="text-xs text-gray-400">Satıcı: {item.seller.name}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 border rounded-lg p-1">
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, size: item.size, quantity: item.quantity - 1 }))}
                          className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => dispatch(incrementQuantityAsync(item))}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-bold text-sm">{(item.price * item.quantity).toFixed(2)} ₼</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-6 bg-gray-50 mt-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 font-medium">Cəmi:</span>
              <span className="text-xl font-bold">{total.toFixed(2)} ₼</span>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full h-12 bg-black hover:bg-gray-800 text-lg rounded-xl"
            >
              Sifarişi tamamla
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
