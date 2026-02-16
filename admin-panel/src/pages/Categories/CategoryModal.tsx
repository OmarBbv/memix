import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../components/ui/modal";
import { categorySchema } from "../../validations/categorySchema";
import { Category } from "../../types/category";
import { useCreateCategory, useUpdateCategory, useCategories } from "../../hooks/useCategories";
import SearchableSelect from "../../components/ui/select/SearchableSelect";

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { data: allCategories } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      parentId: null,
      imageUrl: "",
      order: 0,
      isActive: true,
      showOnHome: false,
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
        showOnHome: category.showOnHome || false,
      });
      if (category.imageUrl) {
        setImagePreview(category.imageUrl.startsWith('http') ? category.imageUrl : `http://localhost:4444${category.imageUrl}`);
      } else {
        setImagePreview(null);
      }
    } else {
      reset({
        name: "",
        parentId: null,
        imageUrl: "",
        order: 0,
        isActive: true,
        showOnHome: false,
      });
      setImagePreview(null);
    }
    setImageFile(null);
  }, [category, reset, isOpen]);

  const onSubmit = (values: any) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("parentId", values.parentId ? values.parentId.toString() : "null");
    formData.append("order", values.order.toString());
    formData.append("isActive", values.isActive.toString());
    formData.append("showOnHome", values.showOnHome.toString());

    if (imageFile) {
      formData.append("image", imageFile);
    }

    if (category) {
      updateMutation.mutate(
        { id: category.id, data: formData as any },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createMutation.mutate(formData as any, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
            <Controller
              name="parentId"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  options={
                    allCategories
                      ?.filter((cat) => cat.id !== category?.id)
                      .map((cat) => ({
                        label: cat.name,
                        value: cat.id,
                      })) || []
                  }
                  value={field.value as any}
                  onChange={field.onChange}
                  error={!!errors.parentId}
                  placeholder="Əsas Kateqoriya (Kök)"
                />
              )}
            />
          </div>

          <div>
            <label className={labelClasses}>Kateqoriya Şəkli</label>
            <div className="mt-2 flex items-center gap-5">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-50 dark:bg-white/5">
                    <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="category-image"
                />
                <label
                  htmlFor="category-image"
                  className="inline-flex cursor-pointer items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  Şəkil Seç
                </label>
                <p className="mt-1.5 text-xs text-gray-500 italic">PNG, JPG və ya GIF (Maks. 10MB)</p>
              </div>
            </div>
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

              <label className="relative inline-flex items-center cursor-pointer py-3">
                <input
                  {...register("showOnHome")}
                  type="checkbox"
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-500/20 dark:peer-focus:ring-brand-500/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[14px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Ana Səhifə (Kəşf et)</span>
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
