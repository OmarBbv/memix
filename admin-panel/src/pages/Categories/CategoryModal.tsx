import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../components/ui/modal";
import { categorySchema } from "../../validations/categorySchema";
import { Category } from "../../types/category";
import { useCreateCategory, useUpdateCategory, useCategories } from "../../hooks/useCategories";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category,
}) => {
  const { data: allCategories } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      parentId: null,
      imageUrl: "",
      order: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        parentId: (category.parentId as any) || null,
        imageUrl: category.imageUrl || "",
        order: (category.order as any) || 0,
        isActive: category.isActive,
      });
    } else {
      reset({
        name: "",
        parentId: null,
        imageUrl: "",
        order: 0,
        isActive: true,
      });
    }
  }, [category, reset, isOpen]);

  const onSubmit = (values: any) => {
    const data = {
      ...values,
      parentId: values.parentId ? Number(values.parentId) : null,
      order: Number(values.order),
    };

    if (category) {
      updateMutation.mutate(
        { id: category.id, data },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const inputClasses = (hasError: any) => `
    w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200
    ${hasError
      ? "border-red-500 bg-red-50/50 focus:ring-4 focus:ring-red-500/10 dark:bg-red-500/5"
      : "border-gray-200 bg-gray-50 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-brand-500 dark:focus:bg-transparent"
    }
  `;

  const labelClasses = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400";

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px]">
      <div className="p-1 border-b border-gray-100 dark:border-white/5 md:p-8">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {category ? "Kateqoriyaya Düzəliş" : "Yeni Kateqoriya"}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {category
              ? "Kateqoriya məlumatlarını aşağıdan yeniləyə bilərsiniz"
              : "Sisteme yeni bir kateqoriya əlavə edin"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className={labelClasses}>Kateqoriya Adı</label>
            <input
              {...register("name")}
              type="text"
              placeholder="Məs: Qadın geyimləri"
              className={inputClasses(errors.name)}
            />
            {errors.name && (
              <p className="mt-1 text-xs font-medium text-red-500">{(errors.name as any).message}</p>
            )}
          </div>

          <div>
            <label className={labelClasses}>Üst Kateqoriya</label>
            <div className="relative">
              <select
                {...register("parentId")}
                className={inputClasses(errors.parentId)}
              >
                <option value="">Əsas Kateqoriya (Kök)</option>
                {allCategories?.map((cat) => (
                  cat.id !== category?.id && (
                    <option key={cat.id} value={cat.id} className="dark:bg-gray-900">
                      {cat.name}
                    </option>
                  )
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClasses}>Şəkil / Ikon URL</label>
            <input
              {...register("imageUrl")}
              type="text"
              placeholder="https://example.com/icon.png"
              className={inputClasses(errors.imageUrl)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Sıralama</label>
              <input
                {...register("order")}
                type="number"
                className={inputClasses(errors.order)}
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="relative inline-flex items-center cursor-pointer py-3">
                <input
                  {...register("isActive")}
                  type="checkbox"
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-500/20 dark:peer-focus:ring-brand-500/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[14px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"></div>
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Aktiv Status</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-6 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
            >
              Ləğv et
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="rounded-xl bg-brand-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-600 hover:shadow-brand-500/40 active:scale-95 disabled:opacity-50 disabled:shadow-none"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Gözləyin..."
                : category
                  ? "Yenilə"
                  : "Yarat"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CategoryModal;
