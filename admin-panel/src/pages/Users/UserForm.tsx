import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import SearchableSelect from "../../components/ui/select/SearchableSelect";
import { useRoles } from "../../hooks/useRoles";
import { useCreateEmployee, useAdminUpdateUser, useUser } from "../../hooks/useUsers";
import { EyeIcon, EyeCloseIcon, ChevronLeftIcon } from "../../icons";
import { useEffect } from "react";
import toast from "react-hot-toast";

const userSchema = z.object({
  name: z.string().min(2, "Ad ən azı 2 simvol olmalıdır"),
  surname: z.string().optional().or(z.literal("")),
  email: z.string().email("Düzgün e-poçt ünvanı daxil edin"),
  password: z.string().optional(), // Şifrə redaktə zamanı məcburi deyil
  roleId: z.number({
    message: "Zəhmət olmasa rol seçin",
  }).optional(), // Müştərilərin rolu olmaya bilər
});

type UserFormValues = z.infer<typeof userSchema>;

export default function UserForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { data: roles } = useRoles();
  const createEmployee = useCreateEmployee();
  const updateUser = useAdminUpdateUser();
  const { data: userToEdit, isLoading: isLoadingUser } = useUser(Number(id));

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      roleId: undefined as unknown as number,
    },
  });

  useEffect(() => {
    if (isEditing && userToEdit) {
      reset({
        name: userToEdit.name,
        surname: userToEdit.surname || "",
        email: userToEdit.email,
        password: "", // Şifrəni göstərmirik
        roleId: userToEdit.role?.id,
      });
    }
  }, [isEditing, userToEdit, reset]);

  const onSubmit = (data: UserFormValues) => {
    if (isEditing) {
      const payload: any = {
        name: data.name,
        surname: data.surname,
        email: data.email,
        roleId: data.roleId,
      };
      
      // Şifrə boş deyilsə və admin tərəfindən dəstəklənirsə əlavə edə bilərik (hazırda adminUpdate şifrə qəbul etmir)
      // Əgər API şifrəni də adminUpdate-də qəbul edirsə bura əlavə etmək olar.
      
      updateUser.mutate(
        { id: Number(id), data: payload },
        {
          onSuccess: () => {
            toast.success("İstifadəçi uğurla yeniləndi!");
            navigate("/users");
          },
        }
      );
    } else {
      if (!data.password || data.password.length < 6) {
        toast.error("Yeni işçi yaradarkən şifrə ən azı 6 simvol olmalıdır");
        return;
      }
      createEmployee.mutate(data, {
        onSuccess: () => {
          toast.success("İşçi uğurla yaradıldı!");
          navigate("/users");
        },
      });
    }
  };

  const isSubmitting = createEmployee.isPending || updateUser.isPending;

  if (isEditing && isLoadingUser) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <PageMeta 
        title={isEditing ? "İstifadəçini Redaktə Et | Memix Admin" : "Yeni İşçi Yarat | Memix Admin"} 
        description={isEditing ? "İstifadəçi məlumatlarının redaktə səhifəsi" : "Yeni işçi yaradılması səhifəsi"} 
      />
      
      <div className="mb-5">
        <button
          onClick={() => navigate("/users")}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-brand-500 dark:text-gray-400"
        >
          <ChevronLeftIcon className="size-5" />
          <span>Geri</span>
        </button>
      </div>

      <PageBreadcrumb pageTitle={isEditing ? "İstifadəçini Redaktə Et" : "Yeni İşçi Yarat"} />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 xl:p-10">
        <h3 className="mb-6 text-xl font-bold text-gray-800 dark:text-white/90">
          {isEditing ? "İstifadəçi Məlumatlarını Yenilə" : "Yeni İşçi Yarat"}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="col-span-1">
              <Label required>Ad</Label>
              <Input
                {...register("name")}
                type="text"
                placeholder="Əli"
                error={!!errors.name}
                hint={errors.name?.message}
              />
            </div>
            <div className="col-span-1">
              <Label>Soyad</Label>
              <Input
                {...register("surname")}
                type="text"
                placeholder="Əliyev"
                error={!!errors.surname}
                hint={errors.surname?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="col-span-1">
              <Label required>E-poçt</Label>
              <Input
                {...register("email")}
                type="email"
                placeholder="ali@memix.com"
                error={!!errors.email}
                hint={errors.email?.message}
              />
            </div>
            {!isEditing && (
              <div className="col-span-1">
                <Label required={!isEditing}>Şifrə</Label>
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="******"
                  error={!!errors.password}
                  hint={errors.password?.message}
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 dark:text-gray-400 hover:text-brand-500 transition-colors"
                    >
                      {showPassword ? (
                        <EyeIcon className="size-5" />
                      ) : (
                        <EyeCloseIcon className="size-5" />
                      )}
                    </button>
                  }
                />
              </div>
            )}
          </div>

          <div>
            <Label required>İşçinin Rolu</Label>
            <Controller
              name="roleId"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  options={
                    roles?.map((role: any) => ({
                      label: role.name,
                      value: role.id,
                    })) || []
                  }
                  value={field.value as any}
                  onChange={field.onChange}
                  error={!!errors.roleId}
                  placeholder="Rol seçin"
                />
              )}
            />
            {errors.roleId && (
              <p className="mt-1 text-sm text-error-500">{errors.roleId.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 mt-4 pt-5 border-t border-gray-100 dark:border-white/5">
            <Button type="button" variant="outline" onClick={() => navigate("/users")}>
              Ləğv et
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Yadda saxlanılır..." : isEditing ? "Yenilə" : "Yarat"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
