import { Navigate, Outlet } from "react-router";
import { useMe } from "../../hooks/useAuth";
import { UserType } from "../../types/user";

interface RoleRouteProps {
  /** Route yalnız bu icazələrdən ən az birinə malik istifadəçilərə açıqdır.
   *  Admin bütün route-lara avtomatik girişə malikdir. */
  requiredPermissions?: string[];
  /** Alternativ olaraq yalnız müəyyən UserType-lara icazə vermək üçün */
  allowedRoles?: UserType[];
}

const RoleRoute = ({ requiredPermissions, allowedRoles }: RoleRouteProps) => {
  const { data: user, isLoading } = useMe();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Admin always has full access
  if (user.userType === UserType.ADMIN) {
    return <Outlet />;
  }

  // Check allowedRoles if provided
  if (allowedRoles && !allowedRoles.includes(user.userType as UserType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check permissions if provided
  if (requiredPermissions) {
    const userPermissions = user.role?.permissions ?? [];
    const hasPermission = requiredPermissions.some((p) => userPermissions.includes(p));
    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

export default RoleRoute;
