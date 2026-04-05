'use client';

import { ContentState } from "@/components/shared/ContentState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useMyProfile, useUpdateProfile } from "@/hooks/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { PhoneInput } from "@/components/ui/phone-input";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  });

  useEffect(() => {
    if (!profile) return;

    reset({
      name: profile.name || "",
      surname: profile.surname || "",
      email: profile.email || "",
      phone: profile.phone || "",
      gender: profile.gender || "",
    });

    if (profile.birthday) {
      const parts = profile.birthday.split('.');
      if (parts.length === 3) {
        const [d, m, y] = parts;
        setDay(d.trim().padStart(2, '0'));
        setMonth(m.trim().padStart(2, '0'));
        setYear(y.trim());
      }
    } else {
      setDay("");
      setMonth("");
      setYear("");
    }
  }, [profile, reset]);

  const handleUpdate = (data: ProfileFormValues) => {
    const payload: any = { ...data };

    // Doğum tarixi yoxlaması
    const hasDay = day !== "";
    const hasMonth = month !== "";
    const hasYear = year !== "";
    const hasAnyDate = hasDay || hasMonth || hasYear;
    const hasAllDate = hasDay && hasMonth && hasYear;

    if (hasAnyDate && !hasAllDate) {
      toast.error("Doğum tarixini tam daxil edin (Gün, Ay, İl)");
      return;
    }

    if (hasAllDate) {
      payload.birthday = `${day}.${month}.${year}`;
    }

    // Boş field-ləri sil
    if (!payload.currentPassword) delete payload.currentPassword;
    if (!payload.newPassword) delete payload.newPassword;
    if (!payload.confirmPassword) delete payload.confirmPassword;
    if (!payload.surname) delete payload.surname;
    if (!payload.phone) delete payload.phone;

    updateProfile.mutate(payload);
  }

  // useEffect(() => {
  //   console.log('day:', day)
  //   console.log('month:', month)
  //   console.log('year:', year)
  //   console.log('profile: ', profile)
  // }, [day, month, year])

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
            {/* Ad */}
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

            {/* Soyad */}
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

            {/* E-mail */}
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

            {/* Telefon */}
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

            {/* Doğum Tarixi */}
            <div className="space-y-2">
              <Label className="text-zinc-600">Doğum Tarixi</Label>
              <div className="flex items-center gap-2">
                {/* Gün */}
                <Input
                  id="birthday-day"
                  placeholder="GG"
                  value={day}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                    setDay(val);
                  }}
                  maxLength={2}
                  inputMode="numeric"
                  className="h-12 bg-zinc-50 border-zinc-200 focus:bg-white transition-all text-center w-20"
                />
                <span className="text-zinc-400 font-medium">/</span>
                {/* Ay */}
                <Input
                  id="birthday-month"
                  placeholder="AA"
                  value={month}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                    setMonth(val);
                  }}
                  maxLength={2}
                  inputMode="numeric"
                  className="h-12 bg-zinc-50 border-zinc-200 focus:bg-white transition-all text-center w-20"
                />
                <span className="text-zinc-400 font-medium">/</span>
                {/* İl */}
                <Input
                  id="birthday-year"
                  placeholder="İİİİ"
                  value={year}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setYear(val);
                  }}
                  maxLength={4}
                  inputMode="numeric"
                  className="h-12 bg-zinc-50 border-zinc-200 focus:bg-white transition-all text-center w-28"
                />
              </div>
            </div>

            {/* Cinsiyyət */}
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

          {/* Şifrə Yeniləmə */}
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
                {errors.currentPassword && (
                  <p className="text-red-500 text-xs">{errors.currentPassword.message}</p>
                )}
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
                {errors.newPassword && (
                  <p className="text-red-500 text-xs">{errors.newPassword.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Yenilə Buttonu */}
          <div className="mt-8 flex justify-end">
            <Button
              type="submit"
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
              ) : (
                "Məlumatları Yenilə"
              )}
            </Button>
          </div>
        </div>
      </form>
    </ContentState>
  );
}