import React, { useState } from "react";
import { Category } from "../../types/category";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  TrashBinIcon,
} from "../../icons";
import { useDeleteCategory } from "../../hooks/useCategories";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";

interface CategoryItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  depth?: number;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  onEdit,
  depth = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteMutation = useDeleteCategory();

  const hasChildren = category.children && category.children.length > 0;

  const handleDelete = () => {
    deleteMutation.mutate(category.id);
  };

  return (
    <div className="flex flex-col">
      <div
        className={`group relative flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all hover:border-brand-200 hover:bg-brand-50/30 dark:border-gray-800 dark:bg-white/2 dark:hover:border-brand-500/30 dark:hover:bg-brand-500/5 ${depth > 0 ? "mt-1" : "mt-2"
          }`}
      >
        <div className="flex items-center gap-3">
          {hasChildren ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-400 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-500/50"
            >
              {isExpanded ? (
                <ChevronDownIcon className="size-3.5" />
              ) : (
                <ChevronUpIcon className="size-3.5" />
              )}
            </button>
          ) : (
            <div className="flex h-6 w-6 items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
            </div>
          )}

          {category.imageUrl ? (
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-100 dark:border-gray-700">
              <img
                src={category.imageUrl.startsWith('http') ? category.imageUrl : `http://localhost:4444${category.imageUrl}`}
                alt={category.name}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-xs font-bold text-gray-400 dark:border-gray-700 dark:bg-gray-800">
              {category.name.charAt(0)}
            </div>
          )}

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="flex h-5 items-center justify-center rounded-md bg-gray-100 px-1.5 text-[10px] font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                #{category.order}
              </span>
              <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
                {category.name}
              </span>
            </div>
            <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
              /{category.slug}
            </span>
          </div>

          {!category.isActive && (
            <span className="ml-2 rounded-full border border-red-100 bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              Passiv
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEdit(category)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-500 shadow-xs transition-all hover:border-brand-500 hover:text-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-500"
            title="Düzəliş et"
          >
            <PencilIcon className="size-4" />
          </button>
          <button
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-500 shadow-xs transition-all hover:border-red-500 hover:text-red-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-red-500"
            title="Sil"
          >
            <TrashBinIcon className="size-4" />
          </button>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="relative ml-8 mt-1 space-y-1 border-l-2 border-gray-100 pl-4 dark:border-gray-800/50">
          {category.children!.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              onEdit={onEdit}
              depth={depth + 1}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Kateqoriyanı Sil"
        description={`"${category.name}" kateqoriyasını silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.`}
        confirmLabel="Bəli, Sil"
        cancelLabel="Ləğv et"
        isDanger={true}
      />
    </div>
  );
};

export default CategoryItem;
