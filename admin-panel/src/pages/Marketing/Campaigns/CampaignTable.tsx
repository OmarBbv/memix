import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Campaign } from "../../../types/campaign";
import { PencilIcon, TrashBinIcon } from "../../../icons";

interface CampaignTableProps {
  campaigns: Campaign[];
  onEdit: (campaign: Campaign) => void;
  onDelete: (id: number) => void;
}

export default function CampaignTable({ campaigns, onEdit, onDelete }: CampaignTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/5">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Şəkil
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Başlıq
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Tip
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                Status
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                Əməliyyatlar
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id} className="hover:bg-gray-50/50 dark:hover:bg-white/1">
                <TableCell className="px-5 py-4 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {campaign.imageUrl ? (
                    <img className="h-10 w-16 rounded object-cover border border-gray-200" src={campaign.imageUrl} alt={campaign.title} />
                  ) : (
                    <div className="flex h-10 w-16 items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
                      <span className="text-gray-500 text-xs">Yoxdur</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="px-5 py-4 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {campaign.title}
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                  <span className="rounded bg-blue-100 px-2.5 py-0.5 text-xs text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    {campaign.type}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 text-end text-gray-500 text-theme-sm dark:text-gray-400">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${campaign.isActive
                      ? "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400"
                      : "bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-400"
                      }`}
                  >
                    {campaign.isActive ? "Aktiv" : "Deaktiv"}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 text-end">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(campaign)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-500 transition-all hover:border-brand-500 hover:text-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-500"
                    >
                      <PencilIcon className="size-4" />
                    </button>
                    <button
                      onClick={() => onDelete(campaign.id)}
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
