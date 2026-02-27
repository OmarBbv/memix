import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Coupon } from "../../../types/coupon";
import { PencilIcon, TrashBinIcon } from "../../../icons";

interface CouponTableProps {
  coupons: Coupon[];
  onEdit: (coupon: Coupon) => void;
  onDelete: (id: number) => void;
}

export default function CouponTable({ coupons, onEdit, onDelete }: CouponTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/5">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Kod</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Növ</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Dəyər</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Sayı / Limit</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end">Əməliyyatlar</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100">
            {coupons.map((coupon) => (
              <TableRow key={coupon.id} className="hover:bg-gray-50/50">
                <TableCell className="px-5 py-4 text-start font-medium text-gray-800">
                  <span className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">{coupon.code}</span>
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-500">
                  {coupon.type === 'percentage' ? 'Faiz' : 'Sabit'}
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-500">
                  {coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value} AZN`}
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-500">
                  {coupon.usedCount} / {coupon.usageLimit || 'Sonsuz'}
                </TableCell>
                <TableCell className="px-5 py-4 text-end">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onEdit(coupon)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 text-gray-500 hover:text-brand-500"><PencilIcon className="size-4" /></button>
                    <button onClick={() => onDelete(coupon.id)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 text-gray-500 hover:text-red-500"><TrashBinIcon className="size-4" /></button>
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
