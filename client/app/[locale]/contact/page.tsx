'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-white md:py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">Bizimlə Əlaqə</h1>
          <p className="text-zinc-600 max-w-2xl mx-auto text-lg">
            Suallarınız var? Bizə yazın və ya zəng edin. Komandamız sizə kömək etməkdən məmnunluq duyacaq.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-zinc-900">Əlaqə Məlumatları</h2>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-zinc-900" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 mb-1">Ünvan</h3>
                  <p className="text-zinc-600">Nizami küçəsi 14, Bakı, Azərbaycan</p>
                  <p className="text-zinc-600">AZ1000</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-zinc-900" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 mb-1">E-mail</h3>
                  <p className="text-zinc-600">support@memix.az</p>
                  <p className="text-zinc-600">info@memix.az</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-zinc-900" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 mb-1">Telefon</h3>
                  <p className="text-zinc-600">+994 50 123 45 67</p>
                  <p className="text-zinc-600 text-sm mt-1">(Bazar ertəsi - Cümə, 09:00 - 18:00)</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="h-64 rounded-2xl bg-zinc-100 w-full overflow-hidden relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24305.618648175718!2d49.83296068270557!3d40.377501309322384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d924f7ec31d%3A0x6bce26a45b630b1!2sBaku%2C%20Azerbaijan!5e0!3m2!1sen!2saz!4v1705698000000!5m2!1sen!2saz"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-xl shadow-zinc-900/5">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6">Mesaj Göndər</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ad</Label>
                  <Input id="name" placeholder="Adınız" className="h-12 bg-zinc-50 border-zinc-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surname">Soyad</Label>
                  <Input id="surname" placeholder="Soyadınız" className="h-12 bg-zinc-50 border-zinc-200" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="nadir@example.com" className="h-12 bg-zinc-50 border-zinc-200" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mesajınız</Label>
                <Textarea
                  id="message"
                  placeholder="Bizə nə demək istəyirsiniz?"
                  className="min-h-[150px] bg-zinc-50 border-zinc-200 resize-none"
                />
              </div>

              <Button className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-lg mt-4">
                Göndər
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
