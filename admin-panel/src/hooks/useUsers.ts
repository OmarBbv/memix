import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../services/userService';

export const useUsers = (page: number = 1, limit: number = 10, search: string = '') => {
  return useQuery({
    queryKey: ['users', page, limit, search],
    queryFn: () => userService.getAll(page, limit, search),
  });
};

export const useUser = (id: number) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useClearUserCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.clearUserCart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
