import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Brand } from "../../../types/brand";
import { PencilIcon, TrashBinIcon } from "../../../icons";

interface BrandTableProps {
  brands: Brand[];
  onEdit: (brand: Brand) => void;
  onDelete: (id: number) => void;
}

export default function BrandTable({ brands, onEdit, onDelete }: BrandTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/5">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Loto
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Marka Adı
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Slug
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                Sıra
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                Əməliyyatlar
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {brands.map((brand) => (
              <TableRow key={brand.id} className="hover:bg-gray-50/50 dark:hover:bg-white/1">
                <TableCell className="px-5 py-4 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {brand.logoUrl ? (
                    <img className="h-10 w-10 rounded-full object-cover border border-gray-200" src={brand.logoUrl} alt={brand.name} />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      <span className="text-gray-500 text-xs">{brand.name.substring(0, 2).toUpperCase()}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="px-5 py-4 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {brand.name}
                  {brand.showOnHome && <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-600">Vitrin</span>}
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                  {brand.slug}
                </TableCell>
                <TableCell className="px-5 py-4 text-end text-gray-500 text-theme-sm dark:text-gray-400">
                  {brand.order}
                </TableCell>
                <TableCell className="px-5 py-4 text-end">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(brand)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-500 transition-all hover:border-brand-500 hover:text-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-500"
                    >
                      <PencilIcon className="size-4" />
                    </button>
                    <button
                      onClick={() => onDelete(brand.id)}
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
