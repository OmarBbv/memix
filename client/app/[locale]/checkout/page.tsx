'use client';

import { useState } from 'react';
import { ContainerWapper } from '@/components/layouts/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Minus, Plus, Trash2, Loader2, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { removeFromCart, updateQuantity, clearCart } from '@/lib/redux/features/cartSlice';
import { Link, useRouter } from '@/i18n/routing';

export default function CheckoutPage() {
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5;
  const total = subtotal + shipping;

  const handleConfirmOrder = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      dispatch(clearCart());

      setTimeout(() => {
        router.push('/');
      }, 3000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-2">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Sifarişiniz qəbul olundu!</h1>
          <p className="text-gray-500 text-lg">Təşəkkür edirik. Sizi ana səhifəyə yönləndiririk...</p>
        </div>
        <Button onClick={() => router.push('/')} variant="outline" className="mt-4">
          İndi ana səhifəyə qayıt
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Səbətiniz boşdur</h1>
        <p className="text-gray-500">Sifariş vermək üçün məhsul əlavə edin</p>
        <Link href="/">
          <Button>Alış-verişə davam et</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Sifarişin rəsmiləşdirilməsi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-8 space-y-8">
          {/* Shipping Address */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Çatdırılma ünvanı</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ad</label>
                <Input placeholder="Adınız" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Soyad</label>
                <Input placeholder="Soyadınız" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Ünvan</label>
                <Input placeholder="Küçə, bina, mənzil" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Telefon</label>
                <Input placeholder="+994 50 000 00 00" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Şəhər</label>
                <Input placeholder="Bakı" />
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Ödəniş üsulu</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:border-black transition-colors">
                <div className="w-4 h-4 rounded-full border border-gray-300 bg-black"></div>
                <span className="font-medium">Bank kartı ilə</span>
              </div>
              <div className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:border-black transition-colors opacity-50">
                <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                <span className="font-medium">Qapıda ödəmə (Tezliklə)</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-6">Sifarişin tərkibi</h2>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="relative w-16 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 border">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">Ölçü: {item.size}</p>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">x {item.quantity}</span>
                      <span className="font-bold">{item.price} ₼</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Məhsullar ({items.reduce((acc, i) => acc + i.quantity, 0)})</span>
                <span>{subtotal.toFixed(2)} ₼</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Çatdırılma</span>
                <span>{shipping.toFixed(2)} ₼</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2 border-t mt-2">
                <span>Cəmi</span>
                <span>{total.toFixed(2)} ₼</span>
              </div>
            </div>

            <Button
              onClick={handleConfirmOrder}
              disabled={isLoading}
              className="w-full h-12 bg-black hover:bg-gray-800 text-lg rounded-xl mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sifariş təsdiqlənir...
                </>
              ) : (
                "Sifarişi təsdiqlə"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
