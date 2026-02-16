import { useQuery } from "@tanstack/react-query";
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

export const useCategoryBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: () => categoryService.getBySlug(slug),
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
