import { useMutation, useQuery } from "@tanstack/react-query";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setCredentials } from "@/lib/redux/features/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { authService } from "@/services/auth.service";

const useLogin = () => {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: (data: any) => authService.login(data),
    onSuccess: (response: any, variables: any) => {
      dispatch(setCredentials({
        user: { id: 1, email: variables.email, role: 'user', name: 'User' },
        token: response.access_token
      }))
    }
  });
};

const useRegister = () => {
  return useMutation({
    mutationFn: (data: any) => authService.register(data),
  });
};

const useAuthCallback = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token]);

  const { data: user, isSuccess, isError, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authService.getProfile(),
    enabled: !!token,
    retry: false
  });

  useEffect(() => {
    if (isSuccess && user && token) {
      dispatch(setCredentials({ user, token }));
      router.push('/');
    }
    if (isError && token) {
      // router.push('/');
    }
  }, [isSuccess, user, token, isError, dispatch, router]);

  return { isLoading: isLoading && !!token };
};

export { useLogin, useRegister, useAuthCallback };
