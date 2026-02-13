import { useAppSelector } from "@/lib/redux/hooks";

export const useUser = () => {
  const { user, isAuthenticated, token } = useAppSelector((state) => state.auth);
  return { user, isAuthenticated, token };
};
