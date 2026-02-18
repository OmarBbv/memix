import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Branch } from "../../types/branch";
import { PencilIcon, TrashBinIcon } from "../../icons";

interface BranchTableProps {
  branches: Branch[];
  onEdit: (branch: Branch) => void;
  onDelete: (id: number) => void;
}

export default function BranchTable({ branches, onEdit, onDelete }: BranchTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/5">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Filial Adı
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Ünvan
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Telefon
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                Əməliyyatlar
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {branches.map((branch) => (
              <TableRow key={branch.id} className="hover:bg-gray-50/50 dark:hover:bg-white/1">
                <TableCell className="px-5 py-4 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {branch.name}
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                  {branch.address || "-"}
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                  {branch.phone || "-"}
                </TableCell>
                <TableCell className="px-5 py-4 text-end">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(branch)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-500 transition-all hover:border-brand-500 hover:text-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-500"
                    >
                      <PencilIcon className="size-4" />
                    </button>
                    <button
                      onClick={() => onDelete(branch.id)}
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
