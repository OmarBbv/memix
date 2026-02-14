import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateAddress, useUpdateAddress } from "@/hooks/useAddress";
import { Address, CreateAddressDto } from "@/types/address.types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddressDialogProps {
  address?: Address;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddressDialog({ address, open, onOpenChange }: AddressDialogProps) {
  const isEditing = !!address;
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<CreateAddressDto>({
    defaultValues: {
      title: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      country: "Azərbaycan",
      zipCode: "",
      isDefault: false,
    }
  });

  useEffect(() => {
    if (address) {
      reset({
        title: address.title,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || "",
        city: address.city,
        country: address.country || "Azərbaycan",
        zipCode: address.zipCode || "",
        isDefault: address.isDefault,
      });
    } else {
      reset({
        title: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        country: "Azərbaycan",
        zipCode: "",
        isDefault: false,
      });
    }
  }, [address, reset]);

  const onSubmit = (data: CreateAddressDto) => {
    if (isEditing && address) {
      updateAddress.mutate({ id: address.id, data }, {
        onSuccess: () => onOpenChange(false)
      });
    } else {
      createAddress.mutate(data, {
        onSuccess: () => onOpenChange(false)
      });
    }
  };

  const isPending = createAddress.isPending || updateAddress.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Ünvanı Düzəlt" : "Yeni Ünvan Əlavə Et"}</DialogTitle>
          <DialogDescription>
            Çatdırılma üçün düzgün ünvan məlumatlarını daxil edin.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Ünvan Başlığı</Label>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Başlıq vacibdir" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full h-12 bg-zinc-50 border-zinc-200">
                      <SelectValue placeholder="Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ev">Ev</SelectItem>
                      <SelectItem value="İş">İş</SelectItem>
                      <SelectItem value="Bağ evi">Bağ evi</SelectItem>
                      <SelectItem value="Digər">Digər</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Əlaqə Nömrəsi</Label>
              <Controller
                name="phone"
                control={control}
                rules={{ required: "Telefon vacibdir" }}
                render={({ field }) => (
                  <PhoneInput
                    id="phone"
                    placeholder="(050) 000 00 00"
                    {...field}
                    value={field.value || ''}
                  />
                )}
              />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Şəhər / Rayon</Label>
              <Input id="city" placeholder="Məs: Bakı, Sumqayıt" className="h-12 bg-zinc-50 border-zinc-200" {...register("city", { required: "Şəhər vacibdir" })} />
              {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine1">Küçə və Bina</Label>
            <Input id="addressLine1" placeholder="Məs: Qara Qarayev pr. 55" className="h-12 bg-zinc-50 border-zinc-200" {...register("addressLine1", { required: "Ünvan vacibdir" })} />
            {errors.addressLine1 && <p className="text-red-500 text-xs">{errors.addressLine1.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="addressLine2">Mənzil, Blok, Mərtəbə</Label>
              <Input id="addressLine2" placeholder="Məs: Mənzil 24, Blok 3" className="h-12 bg-zinc-50 border-zinc-200" {...register("addressLine2")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Poçt İndeksi</Label>
              <Input id="zipCode" placeholder="Məs: AZ1000" className="h-12 bg-zinc-50 border-zinc-200" {...register("zipCode")} />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="isDefault"
              {...register("isDefault")}
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <Label htmlFor="isDefault" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Bu ünvanı varsayılan et
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Ləğv et
            </Button>
            <Button type="submit" disabled={isPending} className="bg-zinc-900 text-white hover:bg-zinc-800">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Yadda Saxla" : "Əlavə Et"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
