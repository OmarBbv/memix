import React, { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { PlusIcon } from "../../icons";
import { useProducts, useDeleteProduct } from "../../hooks/useProducts";
import ProductTable from "./ProductTable";
import { Product } from "../../types/product";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { useNavigate } from "react-router";

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { data: products, isLoading } = useProducts();
  const deleteMutation = useDeleteProduct();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const handleEdit = (product: Product) => {
    navigate(`/products/edit/${product.id}`);
  };

  const handleAdd = () => {
    navigate("/products/create");
  };

  const openDeleteDialog = (id: number) => {
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete);
    }
  };

  return (
    <>
      <PageMeta
        title="Məhsullar | Memix Admin"
        description="Məhsulların idarə edilməsi"
      />
      <PageBreadcrumb pageTitle="Məhsullar" />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
            Məhsul Siyahısı
          </h2>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-600 active:scale-95"
          >
            <PlusIcon className="size-5" />
            <span>Yeni Məhsul</span>
          </button>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/3 md:p-8">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
            </div>
          ) : products && products.length > 0 ? (
            <ProductTable
              products={products}
              onEdit={handleEdit}
              onDelete={openDeleteDialog}
            />
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Sistemdə hələ heç bir məhsul yoxdur.
              </p>
              <button
                onClick={handleAdd}
                className="mt-4 text-brand-500 hover:underline text-sm font-medium"
              >
                İlk məhsulu indi əlavə edin
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Məhsulu Sil"
        description="Bu məhsulu silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz."
        confirmLabel="Bəli, Sil"
        cancelLabel="Ləğv et"
        isDanger={true}
      />
    </>
  );
};

export default Products;
