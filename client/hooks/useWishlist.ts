
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "@/services/wishlist.service";
import { toast } from "sonner";
import { useUser } from "./useUser";

export const useWishlist = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { data: wishlistItems = [], isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistService.getAll,
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: wishlistService.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Xəta baş verdi");
    }
  });

  const removeMutation = useMutation({
    mutationFn: wishlistService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Xəta baş verdi");
    }
  });

  const clearMutation = useMutation({
    mutationFn: wishlistService.clear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("İstək siyahısı təmizləndi");
    }
  });

  const isInWishlist = (productId: number) => {
    return wishlistItems.some((item) => item.product.id === productId);
  };

  const toggleWishlist = (productId: number) => {
    if (!user) {
      toast.error("İstək siyahısını istifadə etmək üçün daxil olun");
      return;
    }

    if (isInWishlist(productId)) {
      removeMutation.mutate(productId);
    } else {
      addMutation.mutate(productId);
    }
  };

  return {
    wishlistItems,
    isLoading,
    addToWishlist: addMutation.mutate,
    removeFromWishlist: removeMutation.mutate,
    clearWishlist: clearMutation.mutate,
    isInWishlist,
    toggleWishlist,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending
  };
};
