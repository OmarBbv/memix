import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { Product } from "../../types/product";
import { PencilIcon, TrashBinIcon, DollarLineIcon } from "../../icons";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onDiscount: (product: Product) => void;
}

export default function ProductTable({ products, onEdit, onDelete, onDiscount }: ProductTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/5">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Məhsul
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Kateqoriya
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Brend
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Qiymət
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Stok
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Status
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                Əməliyyatlar
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {products.map((product) => (
              <TableRow key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-white/1">
                <TableCell className="px-5 py-4 text-start">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-100 dark:border-gray-800">
                      {product.banner ?
                        <img src={product.banner} alt={product.name} />
                        : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-50 text-xs font-bold text-gray-400 dark:bg-gray-800">
                            {product.name.charAt(0)}
                          </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {product.name}
                        </span>
                        {product.listingType && (
                          <Badge 
                            size="sm" 
                            color={product.listingType === 'new' ? 'success' : 'warning'}
                            variant="light"
                          >
                            {product.listingType === 'new' ? 'YENİ' : 'İKİNCİ ƏL'}
                          </Badge>
                        )}
                      </div>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        ID: #{product.id}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                  {product.category?.name || "Yoxdur"}
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                  {product.brand ? (
                    <Badge size="sm" color="light">
                      {product.brand.name}
                    </Badge>
                  ) : (
                    "Yoxdur"
                  )}
                </TableCell>
                <TableCell className="px-5 py-4 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  <div className="flex flex-col">
                    <span className={product.discount ? "text-xs text-gray-400 line-through" : ""}>
                      {product.price} AZN
                    </span>
                    {product.discount && (
                      <span className="text-brand-500">
                        {product.discount.type === 'percentage'
                          ? (product.price * (1 - product.discount.value / 100)).toFixed(2)
                          : (product.price - product.discount.value).toFixed(2)
                        } AZN
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                  {(() => {
                    const totalStock = product.stocks?.reduce((sum, s) => sum + (s.stock || 0), 0) || 0;
                    return (
                      <span className="font-medium text-gray-800 dark:text-white/90">{totalStock} ədəd</span>
                    );
                  })()}
                </TableCell>
                <TableCell className="px-5 py-4 text-start">
                  {(() => {
                    const totalStock = product.stocks?.reduce((sum, s) => sum + (s.stock || 0), 0) || 0;
                    return (
                      <Badge
                        size="sm"
                        color={totalStock > 0 ? "success" : "error"}
                      >
                        {totalStock > 0 ? "Stokda var" : "Bitib"}
                      </Badge>
                    );
                  })()}
                </TableCell>
                <TableCell className="px-5 py-4 text-end">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-500 transition-all hover:border-brand-500 hover:text-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-500"
                    >
                      <PencilIcon className="size-4" />
                    </button>
                    <button
                      onClick={() => onDiscount(product)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-500 transition-all hover:border-brand-500 hover:text-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-500 ${product.discount ? 'border-brand-200 text-brand-500 bg-brand-50/50' : ''}`}
                      title="Endirim"
                    >
                      <DollarLineIcon className="size-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-500 transition-all hover:border-red-500 hover:text-red-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-red-500"
                    >
                      <TrashBinIcon className="size-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
