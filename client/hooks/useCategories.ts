import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";

export const useCategoryTree = () => {
  return useQuery({
    queryKey: ["categoryTree"],
    queryFn: () => categoryService.getTree(),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
  });
};

export const useHomeCategories = () => {
  return useQuery({
    queryKey: ["homeCategories"],
    queryFn: () => categoryService.getHomeCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useCategoryBySlug = (slug: string, filters?: Record<string, string>) => {
  return useInfiniteQuery({
    queryKey: ["category", slug, filters],
    queryFn: ({ pageParam = 1 }) =>
      categoryService.getBySlug(slug, { ...filters, page: pageParam.toString() }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      return lastPage?.pagination?.hasNextPage ? lastPage.pagination.page + 1 : undefined;
    },
    enabled: !!slug,
  });
};

export const useCategoryFilters = (id: number) => {
  return useQuery({
    queryKey: ["categoryFilters", id],
    queryFn: () => categoryService.getFilters(id),
    enabled: !!id,
  });
};
