import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesService } from '../services/rolesService';
import { Role } from '../types/role';

export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => rolesService.getAll(),
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleData: Partial<Role>) => rolesService.create(roleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error) => {
      console.error(error);
      alert('Rol yaradıla bilmədi');
    }
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, roleData }: { id: number; roleData: Partial<Role> }) => 
      rolesService.update(id, roleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error) => {
      console.error(error);
      alert('Rol yenilənə bilmədi');
    }
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => {
      if (!window.confirm('Rolu silmək istədiyinizə əminsiniz?')) {
        return Promise.reject(new Error('İstifadəçi tərəfindən rədd edildi'));
      }
      return rolesService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error: any) => {
      if (error.message !== 'İstifadəçi tərəfindən rədd edildi') {
        console.error(error);
        alert('Rol silinə bilmədi');
      }
    }
  });
};
