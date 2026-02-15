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
