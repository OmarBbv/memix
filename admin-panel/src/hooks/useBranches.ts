import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import branchService from '../services/branchService';
import { CreateBranchDto, UpdateBranchDto } from '../types/branch';

export const useBranches = () => {
  return useQuery({
    queryKey: ['branches'],
    queryFn: () => branchService.getAll(),
  });
};

export const useBranch = (id: number) => {
  return useQuery({
    queryKey: ['branch', id],
    queryFn: () => branchService.getById(id),
    enabled: !!id,
  });
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBranchDto) => branchService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
  });
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBranchDto }) =>
      branchService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['branch', data.id] });
    },
  });
};

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => branchService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
  });
};
