import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cardsService } from "@/services/cards.service";
import { CreateCardRequest } from "@/types/card.types";
import { toast } from "sonner";

export const useCards = () => {
  return useQuery({
    queryKey: ['cards'],
    queryFn: () => cardsService.getAll(),
  });
};

export const useAddCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCardRequest) => cardsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      toast.success("Kart uğurla əlavə edildi");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Xəta baş verdi");
    }
  });
};

export const useDeleteCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cardsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      toast.success("Kart silindi");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Xəta baş verdi");
    }
  });
};
