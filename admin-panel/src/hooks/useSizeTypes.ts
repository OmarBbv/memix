import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sizeTypeService } from '../services/sizeTypeService';
import { CreateSizeTypeDto } from '../types/sizeType';

export const useSizeTypes = () => {
  return useQuery({
    queryKey: ['sizeTypes'],
    queryFn: () => sizeTypeService.getAll(),
  });
};

export const useCreateSizeType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSizeTypeDto) => sizeTypeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sizeTypes'] });
    },
  });
};
