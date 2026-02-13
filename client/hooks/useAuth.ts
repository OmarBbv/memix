import { useMutation, useQuery } from "@tanstack/react-query";
import { AuthService } from "../services/auth.service";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setCredentials } from "@/lib/redux/features/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const useLogin = () => {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: (data: any) => AuthService.login(data),
    onSuccess: (response: any, variables: any) => {
      dispatch(setCredentials({
        user: { id: 1, email: variables.email, role: 'user', name: 'User' },
        token: response.access_token
      }))
    }
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: any) => AuthService.register(data),
  });
};

export const useAuthCallback = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = searchParams.get('token');

  const { data: user, isSuccess, isError, isLoading } = useQuery({
    queryKey: ['profile', token],
    queryFn: () => AuthService.getProfile(token!),
    enabled: !!token,
    retry: false
  });

  useEffect(() => {
    if (isSuccess && user && token) {
      dispatch(setCredentials({ user, token }));
      router.push('/');
    }
    if (isError && token) {
      router.push('/');
    }
    if (!token) {
      // No token, maybe redirect immediately or let component handle
      // router.push('/'); // Handled in component or here
    }
  }, [isSuccess, user, token, isError, dispatch, router]);

  return { isLoading: isLoading && !!token };
};
