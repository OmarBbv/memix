'use client';

import { ContentState } from "@/components/shared/ContentState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMyProfile, useUpdateProfile } from "@/hooks/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { PhoneInput } from "@/components/ui/phone-input";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Ad ən az 2 simvol olmalıdır"),
  surname: z.string().optional(),
  email: z.string().email("Düzgün email formatı deyil"),
  phone: z.string().optional(),
  gender: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { isError, isLoading, profile } = useMyProfile();
  const updateProfile = useUpdateProfile();

  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      phone: "",
      gender: "",
    }
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        surname: profile.surname,
        email: profile.email,
        phone: profile.phone,
        gender: profile.gender,
      });

      if (profile.birthday) {
        const [d, m, y] = profile.birthday.split('.');
        if (d && m && y) {
          setDay(d);
          setMonth(m);
          setYear(y);
        }
      }
    }
  }, [profile, reset]);

  const handleUpdate = (data: ProfileFormValues) => {
    const payload: any = { ...data };

    if (day && month && year) {
      payload.birthday = `${day}.${month}.${year}`;
    }

    if (!payload.currentPassword) delete payload.currentPassword;
    if (!payload.newPassword) delete payload.newPassword;
    if (!payload.confirmPassword) delete payload.confirmPassword;

    if (!payload.surname) delete payload.surname;
    if (!payload.phone) delete payload.phone;

    updateProfile.mutate(payload);
  }

  return (
    <ContentState
      isLoading={isLoading}
      isError={isError}
      errorMessage="İstifadəçi məlumatları yüklənə bilmədi"
      onRetry={() => window.location.reload()}
    >
      <form onSubmit={handleSubmit(handleUpdate)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900">İstifadəçi Məlumatları</h1>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-600">Ad</Label>
              <Input
                id="name"
                {...register("name")}
                autoComplete="new-password"
                className="h-12 bg-zinc-50 border-zinc-200 focus:bg-white transition-all"
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="surname" className="text-zinc-600">Soyad</Label>
              <Input
                id="surname"
                {...register("surname")}
                autoComplete="new-password"
                className="h-12 bg-zinc-50 border-zinc-200 focus:bg-white transition-all"
              />
              {errors.surname && <p className="text-red-500 text-xs">{errors.surname.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-600">E-mail</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                disabled
                autoComplete="new-password"
                className="h-12 bg-zinc-50 border-zinc-200 focus:bg-white transition-all"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-zinc-600">Telefon</Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    id="phone"
                    placeholder="(050) 123 45 67"
                    {...field}
                    value={field.value || ''}
                  />
                )}
              />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthday" className="text-zinc-600">Doğum Tarixi</Label>
              <div className="flex items-center gap-2">
                <Select value={day} onValueChange={setDay}>
                  <SelectTrigger className="h-12 bg-zinc-50 border-zinc-200">
                    <SelectValue placeholder="Gün" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(31)].map((_, i) => (
                      <SelectItem key={i} value={String(i + 1).padStart(2, '0')}>{i + 1}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger className="h-12 bg-zinc-50 border-zinc-200">
                    <SelectValue placeholder="Ay" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'].map((m, i) => (
                      <SelectItem key={m} value={String(i + 1).padStart(2, '0')}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="h-12 bg-zinc-50 border-zinc-200">
                    <SelectValue placeholder="İl" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(100)].map((_, i) => (
                      <SelectItem key={i} value={String(new Date().getFullYear() - 10 - i)}>{new Date().getFullYear() - 10 - i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-600">Cinsiyyət</Label>
              <div className="flex gap-4">
                <label className="flex-1 h-12 flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 cursor-pointer hover:bg-zinc-100 has-[:checked]:bg-zinc-900 has-[:checked]:text-white has-[:checked]:border-zinc-900 transition-all">
                  <input type="radio" {...register("gender")} value="male" className="hidden" />
                  <span className="font-medium">Kişi</span>
                </label>
                <label className="flex-1 h-12 flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 cursor-pointer hover:bg-zinc-100 has-[:checked]:bg-zinc-900 has-[:checked]:text-white has-[:checked]:border-zinc-900 transition-all">
                  <input type="radio" {...register("gender")} value="female" className="hidden" />
                  <span className="font-medium">Qadın</span>
                </label>
              </div>
              {errors.gender && <p className="text-red-500 text-xs">{errors.gender.message}</p>}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-zinc-100">
            <h3 className="text-lg font-semibold mb-6">Şifrə Yeniləmə</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-zinc-600">Cari Şifrə</Label>
                <Input
                  id="current-password"
                  type="password"
                  {...register("currentPassword")}
                  autoComplete="new-password"
                  className="h-12 bg-zinc-50 border-zinc-200"
                />
                {errors.currentPassword && <p className="text-red-500 text-xs">{errors.currentPassword.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-zinc-600">Yeni Şifrə</Label>
                <Input
                  id="new-password"
                  type="password"
                  {...register("newPassword")}
                  autoComplete="new-password"
                  className="h-12 bg-zinc-50 border-zinc-200"
                />
                {errors.newPassword && <p className="text-red-500 text-xs">{errors.newPassword.message}</p>}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              disabled={updateProfile.isPending}
              className="w-full md:w-auto h-12 px-8 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-semibold transition-all relative"
            >
              {updateProfile.isPending ? (
                <>
                  <span className="opacity-0">Məlumatları Yenilə</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                </>
              ) : "Məlumatları Yenilə"}
            </Button>
          </div>
        </div>
      </form>
    </ContentState>
  );
}
