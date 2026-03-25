'use client';

import { useState, useEffect } from 'react';
import { ContainerWapper } from '@/components/layouts/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Plus, Loader2, CheckCircle, AlertCircle, CreditCard } from 'lucide-react';
import Image from 'next/image';
import { clearCart } from '@/lib/redux/features/cartSlice';
import { Link, useRouter } from '@/i18n/routing';
import { orderService } from '@/services/order.service';
import { cartService } from '@/services/cart.service';
import { addressService } from '@/services/address.service';
import { cardsService } from '@/services/cards.service';
import { Address } from '@/types/address.types';
import { Card } from '@/types/card.types';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { items } = useAppSelector((state) => state.cart);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    surname: user?.surname || '',
    address: '',
    city: 'Bakı',
    phone: user?.phone || '',
  });

  const [error, setError] = useState<string | null>(null);

  const [addressTab, setAddressTab] = useState<'saved' | 'new'>('saved');
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  const [paymentTab, setPaymentTab] = useState<'saved' | 'new'>('saved');
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(true);

  const [cardData, setCardData] = useState({
    holderName: user?.name ? `${user.name} ${user.surname}` : '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvv: ''
  });

  // Fetch addresses and cards on load
  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          const [addressesData, cardsData] = await Promise.all([
            addressService.getAll(),
            cardsService.getAll()
          ]);
          setAddresses(addressesData);
          if (addressesData.length === 0) setAddressTab('new');

          setCards(cardsData);
          if (cardsData.length === 0) {
            setPaymentTab('new');
          } else {
            setSelectedCardId(cardsData[0].id);
          }
        } catch (error) {
          console.error("Failed to fetch checkout data:", error);
        } finally {
          setIsLoadingAddresses(false);
          setIsLoadingCards(false);
        }
      };
      fetchData();
    } else {
      setIsLoadingAddresses(false);
      setIsLoadingCards(false);
    }
  }, [isAuthenticated]);

  const handleSelectAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    setFormData({
      name: user?.name || '',
      surname: user?.surname || '',
      address: addr.addressLine1 + (addr.addressLine2 ? ', ' + addr.addressLine2 : ''),
      city: addr.city || 'Bakı',
      phone: addr.phone || '',
    });
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 5; // Example dynamic shipping
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirmOrder = async () => {
    if (!isAuthenticated) {
      toast.error("Zəhmət olmasa sifariş üçün daxil olun");
      router.push('/login?redirect=checkout');
      return;
    }
    if (addressTab === 'saved' && !selectedAddressId) {
      setError("Zəhmət olmasa yadda saxlanılan ünvanlardan birini seçin və ya yeni ünvan daxil edin.");
      return;
    }

    if (!formData.address || !formData.phone) {
      setError("Ünvan və telefon məlumatlarını doldurun");
      return;
    }

    if (paymentTab === 'saved' && !selectedCardId) {
      setError("Ödəniş etmək üçün yadda saxlanılan kart seçin və ya yenisini əlavə edin.");
      return;
    }

    if (paymentTab === 'new') {
      if (!cardData.cardNumber || !cardData.expMonth || !cardData.expYear || !cardData.cvv) {
        setError("Zəhmət olmasa yeni kart məlumatlarını tam doldurun.");
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1) Sync local cart to server before order
      try {
        await cartService.clearCart(); // Start clean
        for (const item of items) {
          const actualProductId = Number(item.productId || item.id);
          await cartService.addToCart(actualProductId, item.quantity, { size: item.size });
        }
      } catch (syncError) {
        console.warn("Silently ignoring cart sync warnings", syncError);
      }

      // 2) If New Card, Save it to Backend
      try {
        if (paymentTab === 'new') {
           await cardsService.create({
             holderName: cardData.holderName || "Müştəri",
             cardNumber: cardData.cardNumber.replace(/\s/g, ''),
             expMonth: Number(cardData.expMonth),
             expYear: Number(cardData.expYear),
             cvv: cardData.cvv,
             color: 'black'
           });
        }
      } catch (cardError) {
        console.warn("Yeni kart əlavə edilərkən xəta (order prossesi davam edir):", cardError);
      }

      // 3) API call to create order}

      await orderService.createOrder({
        address: `${formData.city}, ${formData.address}`,
        phone: formData.phone,
        branchId: 1,
      });

      dispatch(clearCart());
      try {
        await cartService.clearCart();
      } catch (e) {
        console.error("Failed to clear server cart", e);
      }

      setIsLoading(false);
      setIsSuccess(true);

      // Redirect after delay
      setTimeout(() => {
        router.push('/');
      }, 5000);
    } catch (err: any) {
      console.error("Order creation failed:", err);
      setIsLoading(false);
      setError(err?.response?.data?.message || "Sifariş zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
      toast.error("Sifariş təsdiqlənmədi");
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center animate-in fade-in zoom-in duration-300 px-4">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-2">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Sifarişiniz qəbul olundu!</h1>
          <p className="text-gray-500 text-lg">Təşəkkür edirik. Sizi 5 saniyə ərzində ana səhifəyə yönləndiririk...</p>
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
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-zinc-50/30">
      <h1 className="text-3xl font-bold mb-8 text-zinc-900">Sifarişin rəsmiləşdirilməsi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column - Form */}
        <div className="lg:col-span-8 space-y-8">

          {!isAuthenticated && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-amber-800">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">
                Sifariş vermək üçün <Link href="/login?redirect=checkout" className="underline font-bold">daxil olmalısınız</Link>.
              </p>
            </div>
          )}

          {/* Shipping Address */}
          <section className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 text-white text-sm">1</span>
                Çatdırılma ünvanı
              </h2>

              {/* Tabs */}
              <div className="flex bg-zinc-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setAddressTab('saved')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${addressTab === 'saved'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700'
                    }`}
                >
                  Yadda saxlanılanlar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddressTab('new');
                    setSelectedAddressId(null);
                    setFormData({
                      name: user?.name || '',
                      surname: user?.surname || '',
                      address: '',
                      city: 'Bakı',
                      phone: user?.phone || '',
                    });
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${addressTab === 'new'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700'
                    }`}
                >
                  Yeni ünvan
                </button>
              </div>
            </div>

            {addressTab === 'saved' ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isLoadingAddresses ? (
                    <div className="col-span-full flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-zinc-900" />
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-8 text-zinc-500 gap-2">
                      <p>Yadda saxlanılan ünvanınız yoxdur</p>
                    </div>
                  ) : (
                    addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectAddress(addr)}
                        className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 group flex flex-col justify-between min-h-[160px] ${selectedAddressId === addr.id
                          ? 'border-zinc-900 bg-zinc-50 shadow-sm'
                          : 'border-zinc-100 hover:border-zinc-300 bg-white'
                          }`}
                      >
                        {selectedAddressId === addr.id && (
                          <div className="absolute top-4 right-4 text-zinc-900">
                            <CheckCircle className="w-5 h-5" />
                          </div>
                        )}

                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="bg-zinc-900 text-white text-[11px] uppercase tracking-wider font-bold px-3 py-1 rounded-full">
                              {addr.title}
                            </span>
                          </div>
                          <p className="font-bold text-zinc-900 text-sm mb-1">{addr.city}</p>
                          <p className="text-zinc-600 text-sm line-clamp-2 mb-3">
                            {addr.addressLine1} {addr.addressLine2 && `, ${addr.addressLine2}`}
                          </p>
                        </div>

                        <p className="text-zinc-500 text-xs font-medium border-t border-zinc-200 pt-3 mt-auto">
                          {user?.name} {user?.surname} <span className="mx-1">•</span> <span className="text-zinc-700">{addr.phone}</span>
                        </p>
                      </div>
                    ))
                  )}

                  {/* Plus card for quickly adding new */}
                  <div
                    onClick={() => {
                      setAddressTab('new');
                      setSelectedAddressId(null);
                      setFormData({
                        name: user?.name || '',
                        surname: user?.surname || '',
                        address: '',
                        city: 'Bakı',
                        phone: user?.phone || '',
                      });
                    }}
                    className="relative p-5 rounded-2xl border-2 border-dashed border-zinc-200 hover:border-zinc-400 cursor-pointer transition-all duration-200 bg-zinc-50 hover:bg-zinc-100 flex flex-col items-center justify-center gap-3 min-h-[160px]"
                  >
                    <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center">
                      <Plus className="w-5 h-5 text-zinc-600" />
                    </div>
                    <span className="text-sm font-semibold text-zinc-600">Başqa ünvan əlavə et</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700 ml-1">Adınız</label>
                  <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Məsələn: Ömər" className="rounded-xl h-12 border-zinc-200 focus:border-zinc-900 shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700 ml-1">Soyadınız</label>
                  <Input name="surname" value={formData.surname} onChange={handleInputChange} placeholder="Məsələn: Məmmədov" className="rounded-xl h-12 border-zinc-200 focus:border-zinc-900 shadow-sm" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-zinc-700 ml-1">Tam Ünvan</label>
                  <Input name="address" value={formData.address} onChange={handleInputChange} placeholder="Nizami küçəsi 15, mənzil 12" className="rounded-xl h-12 border-zinc-200 focus:border-zinc-900 shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700 ml-1">Telefon Nömrəsi</label>
                  <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+994 50 000 00 00" className="rounded-xl h-12 border-zinc-200 focus:border-zinc-900 shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700 ml-1">Şəhər / Rayon</label>
                  <Input name="city" value={formData.city} onChange={handleInputChange} placeholder="Bakı" className="rounded-xl h-12 border-zinc-200 focus:border-zinc-900 shadow-sm" />
                </div>
              </div>
            )}
          </section>

          {/* Payment Method */}
          <section className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 text-white text-sm">2</span>
                Ödəniş üsulu
              </h2>

              <div className="flex bg-zinc-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPaymentTab('saved')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    paymentTab === 'saved'
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-700'
                  }`}
                >
                  Yaddaşdakı kartlar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentTab('new');
                    setSelectedCardId(null);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    paymentTab === 'new'
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-700'
                  }`}
                >
                  Yeni kart
                </button>
              </div>
            </div>

            {paymentTab === 'saved' ? (
              <div className="animate-in fade-in space-y-4">
                {isLoadingCards ? (
                  <div className="flex justify-center py-4">
                     <Loader2 className="w-6 h-6 animate-spin text-zinc-900" />
                  </div>
                ) : cards.length === 0 ? (
                  <p className="text-zinc-500 text-center py-6 font-medium">Yadda saxlanılan kartınız yoxdur.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cards.map(card => (
                       <div 
                         key={card.id}
                         onClick={() => setSelectedCardId(card.id)}
                         className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 group flex items-center gap-4 ${
                           selectedCardId === card.id 
                            ? 'border-zinc-900 bg-zinc-900 text-white shadow-xl'
                            : 'border-zinc-100 hover:border-zinc-300 bg-white text-zinc-900'
                         }`}
                       >
                         {selectedCardId === card.id && (
                           <div className="absolute top-4 right-4 text-white">
                             <CheckCircle className="w-5 h-5" />
                           </div>
                         )}
                         <div className={`w-14 h-10 rounded-lg flex items-center justify-center shrink-0 ${selectedCardId === card.id ? 'bg-white/10' : 'bg-zinc-100'}`}>
                            <CreditCard className={`w-6 h-6 ${selectedCardId === card.id ? 'text-white' : 'text-zinc-600'}`} />
                         </div>
                         <div>
                            <p className="font-black tracking-wider text-[15px]">{card.cardNumberMasked}</p>
                            <div className={`text-xs mt-1 font-medium ${selectedCardId === card.id ? 'text-zinc-300' : 'text-zinc-500'} flex gap-3`}>
                              <span>{card.expMonth.toString().padStart(2, '0')} / {card.expYear.toString().slice(-2)}</span>
                              <span className="uppercase">{card.brand}</span>
                            </div>
                         </div>
                       </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                   <div className="space-y-2 md:col-span-2">
                     <label className="text-sm font-semibold text-zinc-700 ml-1">Kartın nömrəsi</label>
                     <Input 
                        value={cardData.cardNumber} 
                        onChange={e => setCardData({...cardData, cardNumber: e.target.value})} 
                        placeholder="0000 0000 0000 0000" 
                        maxLength={19}
                        className="rounded-xl h-12 border-zinc-200 focus:border-zinc-900 shadow-sm font-medium tracking-wide" 
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-semibold text-zinc-700 ml-1">Kartın üzərindəki ad</label>
                     <Input 
                        value={cardData.holderName} 
                        onChange={e => setCardData({...cardData, holderName: e.target.value})} 
                        placeholder="ÖMƏR MƏMMƏDOV" 
                        className="rounded-xl h-12 border-zinc-200 focus:border-zinc-900 shadow-sm uppercase font-medium" 
                     />
                   </div>
                   <div className="grid grid-cols-3 gap-4">
                     <div className="space-y-2">
                       <label className="text-sm font-semibold text-zinc-700 ml-1">Ay</label>
                       <Input 
                          value={cardData.expMonth} 
                          onChange={e => setCardData({...cardData, expMonth: e.target.value})} 
                          placeholder="MM" 
                          maxLength={2}
                          className="rounded-xl h-12 border-zinc-200 focus:border-zinc-900 text-center shadow-sm font-medium" 
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-semibold text-zinc-700 ml-1">İl</label>
                       <Input 
                          value={cardData.expYear} 
                          onChange={e => setCardData({...cardData, expYear: e.target.value})} 
                          placeholder="YY" 
                          maxLength={2}
                          className="rounded-xl h-12 border-zinc-200 focus:border-zinc-900 text-center shadow-sm font-medium" 
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-semibold text-zinc-700 ml-1">CVV</label>
                       <Input 
                          value={cardData.cvv} 
                          onChange={e => setCardData({...cardData, cvv: e.target.value})} 
                          type="password"
                          placeholder="•••" 
                          maxLength={3}
                          className="rounded-xl h-12 border-zinc-200 focus:border-zinc-900 text-center shadow-sm tracking-widest" 
                       />
                     </div>
                   </div>
                 </div>
                 <div className="flex gap-2 p-4 bg-zinc-50 rounded-2xl items-center border border-zinc-100">
                   <div className="w-10 h-6 bg-white rounded border border-zinc-200 flex items-center justify-center">
                     <div className="w-4 h-4 bg-red-500 rounded-full -mr-1 mix-blend-multiply opacity-80"></div>
                     <div className="w-4 h-4 bg-yellow-500 rounded-full mix-blend-multiply opacity-80"></div>
                   </div>
                   <div className="w-10 h-6 bg-white rounded border border-zinc-200 flex flex-col items-center justify-center font-black text-[8px] text-blue-900 italic">VISA</div>
                   <span className="ml-2 text-xs font-semibold text-zinc-500">Bütün ödənişlər SSL protokolu ilə qorunur.</span>
                 </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-lg sticky top-28 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-50 rounded-bl-full -z-10 opacity-50"></div>

            <h2 className="text-xl font-bold mb-8 text-zinc-900">Sifarişin tərkibi</h2>

            <div className="space-y-5 max-h-[350px] overflow-y-auto pr-2 mb-8 scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-5 group">
                  <div className="relative w-16 h-20 shrink-0 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100 group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 line-clamp-1 group-hover:text-brand-500 transition-colors">{item.title}</h4>
                      <p className="text-[10px] text-zinc-400 font-medium mt-1 inline-block px-2 py-0.5 bg-zinc-50 rounded-full">Ölçü: {item.size}</p>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-500 font-medium">x {item.quantity}</span>
                      <span className="font-black text-zinc-900">{item.price} ₼</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-zinc-50 pt-6">
              <div className="flex justify-between text-zinc-500 font-medium">
                <span>Ara cəmi</span>
                <span>{subtotal.toFixed(2)} ₼</span>
              </div>
              <div className="flex justify-between text-zinc-500 font-medium">
                <span>Çatdırılma</span>
                <span className="text-green-600 font-bold">{shipping === 0 ? "Pulsuz" : `${shipping.toFixed(2)} ₼`}</span>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium flex gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex justify-between text-2xl font-black text-zinc-900 pt-4 border-t border-zinc-100 mt-2">
                <span>Cəmi</span>
                <span>{total.toFixed(2)} ₼</span>
              </div>
            </div>

            <Button
              onClick={handleConfirmOrder}
              disabled={isLoading || items.length === 0}
              className="w-full h-14 bg-zinc-900 hover:bg-black text-white font-bold text-lg rounded-2xl mt-8 shadow-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Gözləyin...
                </>
              ) : (
                "Sifarişi təsdiqlə"
              )}
            </Button>

            <p className="text-[10px] text-center text-zinc-400 mt-4 leading-relaxed px-4">
              "Sifarişi təsdiqlə" düyməsini sıxmaqla siz bizim <Link href="/terms" className="underline">xidmət şərtlərimizi</Link> qəbul edirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
