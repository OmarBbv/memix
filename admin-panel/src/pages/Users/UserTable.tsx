import { User, UserType } from "../../types/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { useToggleUserStatus, useDeleteUser } from "../../hooks/useUsers";
import { LockIcon, TaskIcon, TrashBinIcon, PencilIcon } from "../../icons";
import { Link } from "react-router";
import { useState } from "react";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  const toggleStatus = useToggleUserStatus();
  const deleteUser = useDeleteUser();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const handleDeleteConfirm = () => {
    if (selectedUserId !== null) {
      deleteUser.mutate(selectedUserId);
      setIsDeleteDialogOpen(false);
      setSelectedUserId(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/5">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Ad/Soyad
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Email
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Telefon
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Cinsiyyət
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Rol
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Əməliyyatlar
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500 font-semibold overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {user.name} {user.surname || ""}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-5 py-4 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {user.email}
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                  {user.phone || "-"}
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                  {user.gender === "male" ? "Kişi" : user.gender === "female" ? "Qadın" : "-"}
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={user.userType === UserType.ADMIN ? "success" : user.userType === UserType.EMPLOYEE ? "warning" : "light"}
                  >
                    {user.userType === UserType.ADMIN ? "Admin" : user.userType === UserType.EMPLOYEE ? "İşçi" : "Müştəri"}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={user.isActive ? "success" : "error"}
                  >
                    {user.isActive ? "Aktiv" : "Bloklanıb"}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleStatus.mutate(user.id)}
                      disabled={toggleStatus.isPending}
                      className={`p-1.5 rounded-lg border transition-colors ${user.isActive
                        ? "text-red-500 border-red-100 hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
                        : "text-green-500 border-green-100 hover:bg-green-50 dark:border-green-500/20 dark:hover:bg-green-500/10"
                        }`}
                      title={user.isActive ? "Blokla" : "Blokdan çıxar"}
                    >
                      <LockIcon className="size-4" />
                    </button>
                    <Link
                      to={`/orders?userId=${user.id}`}
                      className="p-1.5 rounded-lg border border-gray-100 text-gray-500 hover:bg-gray-50 transition-colors dark:border-gray-800 dark:hover:bg-white/5"
                      title="Sifarişlər"
                    >
                      <TaskIcon className="size-4" />
                    </Link>
                    <Link
                      to={`/users/edit/${user.id}`}
                      className="p-1.5 rounded-lg border border-gray-100 text-brand-500 hover:bg-brand-50 hover:border-brand-100 transition-colors dark:border-gray-800 dark:hover:bg-brand-500/10"
                      title="Redaktə et"
                    >
                      <PencilIcon className="size-4" />
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setIsDeleteDialogOpen(true);
                      }}
                      disabled={deleteUser.isPending}
                      className="p-1.5 rounded-lg border border-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors dark:border-gray-800 dark:hover:bg-red-500/10"
                      title="İstifadəçini Sil"
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

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedUserId(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="İstifadəçini Sil"
        description="Bu istifadəçini silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz."
        confirmLabel="Bəli, Sil"
        cancelLabel="Ləğv et"
        isDanger={true}
      />
    </div>
  );
}

