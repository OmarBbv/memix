import { useAppSelector } from "@/lib/redux/hooks";
import { authService } from "@/services/auth.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateUser } from "@/lib/redux/features/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks";

const useUser = () => {
  const { user, isAuthenticated, token } = useAppSelector((state) => state.auth);
  return { user, isAuthenticated, token };
};

const useMyProfile = () => {
  const { token: reduxToken } = useUser();
  const token = reduxToken || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authService.getProfile(),
    enabled: !!token,
    retry: false
  });

  return {
    profile,
    isLoading,
    isError
  }
}

const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: any) => authService.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      dispatch(updateUser(updatedUser));
      toast.success("Məlumatlar uğurla yeniləndi");
    },
    onError: (error: any) => {
      toast.error(error.message || "Xəta baş verdi");
    }
  });
}

export { useUser, useMyProfile, useUpdateProfile };
