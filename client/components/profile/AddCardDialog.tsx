import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddCard } from "@/hooks/useCards";
import { CreateCardRequest } from "@/types/card.types";
import { Loader2 } from "lucide-react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const cardSchema = z.object({
  holderName: z.string().min(3, "Ad soyad ən az 3 simvol olmalıdır"),
  cardNumber: z.string().regex(/^\d{16}$/, "Kart nömrəsi 16 rəqəmdən ibarət olmalıdır"),
  cvv: z.string().regex(/^\d{3}$/, "CVV 3 rəqəm olmalıdır"),
  expMonth: z.number().min(1).max(12),
  expYear: z.number().min(new Date().getFullYear()),
  color: z.string().optional(),
});

type CardFormValues = z.infer<typeof cardSchema>;

export function AddCardDialog({ open, onOpenChange }: AddCardDialogProps) {
  const addCard = useAddCard();

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      holderName: "",
      cardNumber: "",
      cvv: "",
      expMonth: 1,
      expYear: new Date().getFullYear(),
      color: "blue"
    }
  });

  const onSubmit: SubmitHandler<CardFormValues> = (data) => {
    const payload: CreateCardRequest = {
      ...data,
      expMonth: data.expMonth,
      expYear: data.expYear,
      cvv: data.cvv,
      holderName: data.holderName,
      cardNumber: data.cardNumber,
    };

    addCard.mutate(payload, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Kart Əlavə Et</DialogTitle>
          <DialogDescription>
            Ödənişlərinizi sürətli etmək üçün kart məlumatlarını daxil edin.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">

          <div className="space-y-2">
            <Label htmlFor="holderName">Kart Sahibi</Label>
            <Input
              id="holderName"
              placeholder="AD SOYAD"
              className="uppercase"
              {...register("holderName", { required: "Ad soyad vacibdir" })}
            />
            {errors.holderName && <p className="text-red-500 text-xs">{errors.holderName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Kart Nömrəsi</Label>
            <Input
              id="cardNumber"
              placeholder="0000 0000 0000 0000"
              maxLength={16}
              {...register("cardNumber", {
                required: "Kart nömrəsi vacibdir",
                minLength: { value: 16, message: "16 rəqəm olmalıdır" },
                maxLength: { value: 16, message: "16 rəqəm olmalıdır" },
                pattern: { value: /^[0-9]+$/, message: "Yalnız rəqəm daxil edin" }
              })}
            />
            {errors.cardNumber && <p className="text-red-500 text-xs">{errors.cardNumber.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bitmə Tarixi</Label>
              <div className="flex gap-2">
                <Controller
                  name="expMonth"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={(v) => field.onChange(Number(v))} value={String(field.value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Ay" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                          <SelectItem key={m} value={String(m)}>{String(m).padStart(2, '0')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                <Controller
                  name="expYear"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={(v) => field.onChange(Number(v))} value={String(field.value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="İl" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((y) => (
                          <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                maxLength={3}
                type="password"
                {...register("cvv", {
                  required: "CVV vacibdir",
                  minLength: 3,
                  maxLength: 3
                })}
              />
              {errors.cvv && <p className="text-red-500 text-xs">{errors.cvv.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Kart Rəngi</Label>
            <div className="flex gap-3">
              {['blue', 'black', 'purple', 'pink'].map((color) => (
                <label key={color} className="cursor-pointer relative">
                  <input
                    type="radio"
                    value={color}
                    {...register("color")}
                    className="sr-only peer"
                  />
                  <div className={`w-8 h-8 rounded-full border-2 border-transparent peer-checked:border-zinc-900 peer-checked:scale-110 transition-all ${color === 'blue' ? 'bg-blue-500' :
                    color === 'black' ? 'bg-zinc-900' :
                      color === 'purple' ? 'bg-purple-500' :
                        'bg-pink-500'
                    }`} />
                </label>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Ləğv et
            </Button>
            <Button type="submit" disabled={addCard.isPending} className="bg-zinc-900 text-white hover:bg-zinc-800">
              {addCard.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Əlavə Et
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
