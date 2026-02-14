import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addressService } from "@/services/address.service";
import { toast } from "sonner";
import { CreateAddressDto, UpdateAddressDto } from "@/types/address.types";

export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: () => addressService.getAll(),
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAddressDto) => addressService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success("Ünvan uğurla əlavə edildi");
    },
    onError: (error: any) => {
      toast.error(error.message || "Xəta baş verdi");
    }
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAddressDto }) => addressService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success("Ünvan uğurla yeniləndi");
    },
    onError: (error: any) => {
      toast.error(error.message || "Xəta baş verdi");
    }
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => addressService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success("Ünvan uğurla silindi");
    },
    onError: (error: any) => {
      toast.error(error.message || "Xəta baş verdi");
    }
  });
};
