'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProfilePage() {
  // const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">İstifadəçi Məlumatları</h1>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-600">Ad</Label>
            <Input
              id="name"
              defaultValue="Nadir"
              className="h-12 bg-zinc-50 border-zinc-200 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="surname" className="text-zinc-600">Soyad</Label>
            <Input
              id="surname"
              defaultValue="Həbibov"
              className="h-12 bg-zinc-50 border-zinc-200 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-600">E-mail</Label>
            <Input
              id="email"
              type="email"
              defaultValue="nadir@example.com"
              className="h-12 bg-zinc-50 border-zinc-200 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-zinc-600">Telefon</Label>
            <Input
              id="phone"
              type="tel"
              defaultValue="+994 50 123 45 67"
              className="h-12 bg-zinc-50 border-zinc-200 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthday" className="text-zinc-600">Doğum Tarixi</Label>
            <div className="flex items-center gap-2">
              <Select>
                <SelectTrigger className="h-12 bg-zinc-50 border-zinc-200">
                  <SelectValue placeholder="Gün" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(31)].map((_, i) => (
                    <SelectItem key={i} value={String(i + 1)}>{i + 1}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="h-12 bg-zinc-50 border-zinc-200">
                  <SelectValue placeholder="Ay" />
                </SelectTrigger>
                <SelectContent>
                  {['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'].map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="h-12 bg-zinc-50 border-zinc-200">
                  <SelectValue placeholder="İl" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(100)].map((_, i) => (
                    <SelectItem key={i} value={String(2026 - i)}>{2026 - i}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-600">Cinsiyyət</Label>
            <div className="flex gap-4">
              <label className="flex-1 h-12 flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 cursor-pointer hover:bg-zinc-100 has-[:checked]:bg-zinc-900 has-[:checked]:text-white has-[:checked]:border-zinc-900 transition-all">
                <input type="radio" name="gender" className="hidden" defaultChecked />
                <span className="font-medium">Kişi</span>
              </label>
              <label className="flex-1 h-12 flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 cursor-pointer hover:bg-zinc-100 has-[:checked]:bg-zinc-900 has-[:checked]:text-white has-[:checked]:border-zinc-900 transition-all">
                <input type="radio" name="gender" className="hidden" />
                <span className="font-medium">Qadın</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-100">
          <h3 className="text-lg font-semibold mb-6">Şifrə Yeniləmə</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-zinc-600">Cari Şifrə</Label>
              <Input id="current-password" type="password" className="h-12 bg-zinc-50 border-zinc-200" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-zinc-600">Yeni Şifrə</Label>
              <Input id="new-password" type="password" className="h-12 bg-zinc-50 border-zinc-200" />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            className="w-full md:w-auto h-12 px-8 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-semibold transition-all"
          >
            Məlumatları Yenilə
          </Button>
        </div>
      </div>
    </div>
  );
}
