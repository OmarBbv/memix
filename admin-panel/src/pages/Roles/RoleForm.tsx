import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { PERMISSION_LIST } from "../../types/role";
import { useRoles, useCreateRole, useUpdateRole } from "../../hooks/useRoles";

export default function RoleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const { data: roles, isLoading: rolesLoading } = useRoles();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();

  useEffect(() => {
    if (isEditing && roles) {
      const role = roles.find((r) => r.id === Number(id));
      if (role) {
        setName(role.name);
        setDescription(role.description || "");
        setSelectedPermissions(role.permissions || []);
      }
    }
  }, [id, roles, isEditing]);

  const togglePermission = (permId: string) => {
    if (selectedPermissions.includes(permId)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permId));
    } else {
      setSelectedPermissions([...selectedPermissions, permId]);
    }
  };

  const selectAll = () => {
    setSelectedPermissions(PERMISSION_LIST.map((p) => p.id));
  };

  const deselectAll = () => {
    setSelectedPermissions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Ad qeyd edilməlidir!");

    const payload = {
      name,
      description,
      permissions: selectedPermissions,
      isActive: true,
    };

    if (isEditing) {
      updateRole.mutate(
        { id: Number(id), roleData: payload },
        {
          onSuccess: () => navigate("/roles"),
        }
      );
    } else {
      createRole.mutate(payload, {
        onSuccess: () => navigate("/roles"),
      });
    }
  };

  const isPending = createRole.isPending || updateRole.isPending;

  return (
    <>
      <PageMeta
        title={isEditing ? "Rolu Redaktə Et | Memix Admin" : "Yeni Rol Yarat | Memix Admin"}
        description="Rol və icazə idarəetmə lövhəsi"
      />
      <PageBreadcrumb pageTitle={isEditing ? "Rolu Redaktə Et" : "Yeni Rol Yarat"} />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 xl:p-10">
        <h3 className="mb-6 text-xl font-bold text-gray-800 dark:text-white/90">
          {isEditing ? "Rol Məlumatlarını Yenilə" : "Yeni Rol Yarat"}
        </h3>
        {isEditing && rolesLoading ? (
          <div className="py-20 text-center">Yüklənir...</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="col-span-1 md:col-span-2">
                <Label>Rol Adı *</Label>
                <Input
                  type="text"
                  placeholder="Məsələn: Məhsul Meneceri"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <Label>Təsviri (Opsiyanal)</Label>
                <Input
                  type="text"
                  placeholder="Rol haqqında qısa məlumat"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="mb-0">İcazələr</Label>
                <div className="flex gap-3 text-sm">
                  <button type="button" onClick={selectAll} className="text-brand-500 hover:underline">
                    Hamısını Seç
                  </button>
                  <button type="button" onClick={deselectAll} className="text-gray-500 hover:underline">
                    Təmizlə
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {PERMISSION_LIST.map((permission) => (
                  <label
                    key={permission.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                      selectedPermissions.includes(permission.id)
                        ? "border-brand-500 bg-brand-50/50 dark:border-brand-500/50 dark:bg-brand-500/10"
                        : "border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center h-5 mt-0.5">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500 dark:focus:ring-brand-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        checked={selectedPermissions.includes(permission.id)}
                        onChange={() => togglePermission(permission.id)}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                        {permission.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono break-all">
                        {permission.id}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-gray-100 dark:border-white/5">
              <Button type="button" variant="outline" onClick={() => navigate("/roles")}>
                Ləğv et
              </Button>
              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending ? "Yadda saxlanılır..." : "Yadda Saxla"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
