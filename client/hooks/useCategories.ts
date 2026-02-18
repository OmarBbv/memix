import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";

export const useCategoryTree = () => {
  return useQuery({
    queryKey: ["categoryTree"],
    queryFn: () => categoryService.getTree(),
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
  });
};

export const useCategoryBySlug = (slug: string, filters?: Record<string, string>) => {
  return useQuery({
    queryKey: ["category", slug, filters],
    queryFn: () => categoryService.getBySlug(slug, filters),
    enabled: !!slug,
    placeholderData: keepPreviousData,
  });
};

export const useCategoryFilters = (id: number) => {
  return useQuery({
    queryKey: ["categoryFilters", id],
    queryFn: () => categoryService.getFilters(id),
    enabled: !!id,
  });
};
