import React, { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { PlusIcon } from "../../icons";
import { useCategoryTree } from "../../hooks/useCategories";
import CategoryItem from "./CategoryItem";
import CategoryModal from "./CategoryModal";
import { Category } from "../../types/category";

const Categories: React.FC = () => {
  const { data: categories, isLoading } = useCategoryTree();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <>
      <PageMeta
        title="Kateqoriyalar | Memix Admin"
        description="Kateqoriyaların idarə edilməsi"
      />
      <PageBreadcrumb pageTitle="Kateqoriyalar" />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
            Kateqoriya Ağacı
          </h2>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-600 active:scale-95"
          >
            <PlusIcon className="size-5" />
            <span>Yeni Kateqoriya</span>
          </button>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/3 md:p-8">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="flex flex-col gap-2">
              {categories.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Hələ heç bir kateqoriya yoxdur.
              </p>
            </div>
          )}
        </div>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={editingCategory}
      />
    </>
  );
};

export default Categories;
