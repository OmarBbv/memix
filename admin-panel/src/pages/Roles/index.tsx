import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useRoles, useDeleteRole } from "../../hooks/useRoles";
import Button from "../../components/ui/button/Button";
import { PlusIcon, TrashBinIcon, PencilIcon } from "../../icons";
import Badge from "../../components/ui/badge/Badge";

export default function Roles() {
  const navigate = useNavigate();
  const { data: roles, isLoading: loading } = useRoles();
  const deleteRole = useDeleteRole();

  const handleOpenEdit = (id: number) => {
    navigate(`/roles/edit/${id}`);
  };

  const handleOpenCreate = () => {
    navigate("/roles/create");
  };

  const handleDelete = async (id: number) => {
    deleteRole.mutate(id);
  };

  return (
    <>
      <PageMeta
        title="Rollar | Memix Admin"
        description="Sistem üzrə rolların və icazələrin idarəedilməsi"
      />
      <PageBreadcrumb pageTitle="Rollar və İcazələr" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/3 xl:px-10 xl:py-12">
        <div className="flex w-full flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Rolların Siyahısı
            </h3>
            <Button variant="primary" size="sm" onClick={handleOpenCreate}>
              <PlusIcon className="mr-2 size-4" />
              Yeni Rol
            </Button>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
            </div>
          ) : roles && roles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role) => (
                <div key={role.id} className="rounded-xl border border-gray-200 p-5 dark:border-white/5 bg-white dark:bg-white/3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {role.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(role.id)}
                        className="text-gray-500 hover:text-brand-500 transition-colors p-1"
                        title="Redaktə et"
                      >
                        <PencilIcon className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(role.id)}
                        disabled={deleteRole.isPending}
                        className="text-gray-500 hover:text-red-500 transition-colors p-1"
                        title="Sil"
                      >
                        <TrashBinIcon className="size-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
                    {role.description || "Təsvir yoxdur"}
                  </p>
                  <div>
                    <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      İcazələr ({role.permissions?.length || 0})
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions?.slice(0, 5).map((p: string) => (
                        <Badge key={p} size="sm" color="light" className="text-xs font-normal px-2 py-0.5">
                          {p.split(':')[0]}
                        </Badge>
                      ))}
                      {role.permissions?.length > 5 && (
                        <Badge size="sm" color="light" className="text-xs font-normal px-2 py-0.5">
                          +{role.permissions.length - 5}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-500 dark:text-gray-400">Heç bir rol tapılmadı.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
