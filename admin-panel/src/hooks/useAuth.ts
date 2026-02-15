import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService, LoginDto } from "../services/authService";
import { useNavigate } from "react-router";

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginDto) => authService.login(data),
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      navigate("/");
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = () => {
    localStorage.removeItem("token");
    queryClient.setQueryData(["me"], null);
    navigate("/signin");
  };

  return { logout };
};

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => authService.getProfile(),
    enabled: !!localStorage.getItem("token"),
  });
};
