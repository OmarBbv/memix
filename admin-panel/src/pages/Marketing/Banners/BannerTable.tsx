import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Banner } from "../../../types/banner";
import { PencilIcon, TrashBinIcon } from "../../../icons";

interface BannerTableProps {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onDelete: (id: number) => void;
}

export default function BannerTable({ banners, onEdit, onDelete }: BannerTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/5">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                Fon Şəkli
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                Başlıq
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                Mövqe
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs">
                Əməliyyatlar
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {banners.map((banner) => (
              <TableRow key={banner.id} className="hover:bg-gray-50/50 dark:hover:bg-white/1">
                <TableCell className="px-5 py-4 text-start font-medium text-gray-800 text-theme-sm">
                  {banner.imageUrl ? (
                    <img className="h-10 w-24 rounded-lg object-cover border border-gray-200" src={banner.imageUrl} alt={banner.title} />
                  ) : (
                    <div className="flex h-10 w-24 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                      <span className="text-gray-500 text-xs text-center">Şəkil yoxdur</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="px-5 py-4 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {banner.title}
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm">
                  {banner.location}
                </TableCell>
                <TableCell className="px-5 py-4 text-end">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onEdit(banner)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 text-gray-500 hover:text-brand-500">
                      <PencilIcon className="size-4" />
                    </button>
                    <button onClick={() => onDelete(banner.id)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 text-gray-500 hover:text-red-500">
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
