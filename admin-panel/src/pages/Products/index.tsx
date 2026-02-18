import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { PlusIcon } from "../../icons";
import { useProducts, useDeleteProduct } from "../../hooks/useProducts";
import ProductTable from "./ProductTable";
import { Product } from "../../types/product";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { useNavigate } from "react-router";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import DatePicker from "../../components/form/date-picker";
import Button from "../../components/ui/button/Button";
import { useCreateDiscount, useUpdateDiscount, useDeleteDiscount } from "../../hooks/useDiscounts";
import { DiscountType } from "../../services/discountService";
import toast from "react-hot-toast";

const discountSchema = z.object({
  type: z.nativeEnum(DiscountType),
  value: z.number().min(0, "Dəyər mənfi ola bilməz"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type DiscountFormValues = z.infer<typeof discountSchema>;

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { data: products, isLoading } = useProducts();
  const deleteMutation = useDeleteProduct();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { control, register, handleSubmit, reset } = useForm<DiscountFormValues>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      type: DiscountType.PERCENTAGE,
      value: 0,
      startDate: "",
      endDate: "",
    },
  });

  const createDiscount = useCreateDiscount();
  const updateDiscount = useUpdateDiscount();
  const deleteDiscount = useDeleteDiscount();

  const handleEdit = (product: Product) => navigate(`/products/edit/${product.id}`);

  const handleAdd = () => navigate("/products/create");

  const openDeleteDialog = (id: number) => {
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          toast.success("Məhsul uğurla silindi");
        }
      });
    }
  };

  const openDiscountModal = (product: Product) => {
    setSelectedProduct(product);
    if (product.discount) {
      reset({
        type: product.discount.type as DiscountType,
        value: Number(product.discount.value),
        startDate: product.discount.startDate ? product.discount.startDate.split('T')[0] : '',
        endDate: product.discount.endDate ? product.discount.endDate.split('T')[0] : '',
      });
    } else {
      reset({
        type: DiscountType.PERCENTAGE,
        value: 0,
        startDate: '',
        endDate: '',
      });
    }
    setIsDiscountModalOpen(true);
  };

  const handleSaveDiscount = (values: DiscountFormValues) => {
    if (!selectedProduct) return;

    const data = {
      productId: selectedProduct.id,
      type: values.type,
      value: Number(values.value),
      startDate: values.startDate ? new Date(values.startDate).toISOString() : undefined,
      endDate: values.endDate ? new Date(values.endDate).toISOString() : undefined,
      isActive: true,
    };

    if (selectedProduct.discount) {
      updateDiscount.mutate({ id: selectedProduct.discount.id, data: data as any }, {
        onSuccess: () => {
          setIsDiscountModalOpen(false);
          toast.success("Endirim yeniləndi");
        }
      });
    } else {
      createDiscount.mutate(data as any, {
        onSuccess: () => {
          setIsDiscountModalOpen(false);
          toast.success("Endirim əlavə edildi");
        }
      });
    }
  };

  const handleDeleteDiscount = () => {
    if (selectedProduct?.discount) {
      deleteDiscount.mutate(selectedProduct.discount.id, {
        onSuccess: () => {
          setIsDiscountModalOpen(false);
          toast.success("Endirim silindi");
        }
      });
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
              onDiscount={openDiscountModal}
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

      <Modal
        isOpen={isDiscountModalOpen}
        onClose={() => setIsDiscountModalOpen(false)}
        className="max-w-[500px] p-6"
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">
              Endirim İdarəetməsi
            </h3>
            <p className="text-sm text-gray-500">
              {selectedProduct?.name} üçün endirim təyin edin
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <Label>Endirim Növü</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    options={[
                      { label: "Faiz (%)", value: "percentage" },
                      { label: "Sabit (AZN)", value: "fixed" },
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            <div>
              <Label>Dəyər</Label>
              <Input
                type="number"
                {...register("value", { valueAsNumber: true })}
                placeholder="Endirim miqdarı"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Başlama Tarixi</Label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      id="startDate"
                      placeholder="YYYY-MM-DD"
                      defaultDate={field.value}
                      onChange={(_, dateStr) => field.onChange(dateStr)}
                    />
                  )}
                />
              </div>
              <div>
                <Label>Bitmə Tarixi</Label>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      id="endDate"
                      placeholder="YYYY-MM-DD"
                      defaultDate={field.value}
                      onChange={(_, dateStr) => field.onChange(dateStr)}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              className="flex-1"
              onClick={handleSubmit(handleSaveDiscount)}
              disabled={createDiscount.isPending || updateDiscount.isPending}
            >
              Yadda saxla
            </Button>
            {selectedProduct?.discount && (
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50"
                onClick={handleDeleteDiscount}
                disabled={deleteDiscount.isPending}
              >
                Sil
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setIsDiscountModalOpen(false)}
            >
              Ləğv et
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Products;
