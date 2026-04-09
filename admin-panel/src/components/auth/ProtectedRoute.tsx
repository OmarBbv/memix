import { Navigate, Outlet } from "react-router";
import { useMe } from "../../hooks/useAuth";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const { data: user, isLoading, isError } = useMe();

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-gray-50">
        <h1 className="text-2xl font-bold text-red-600">Sistem xətası</h1>
        <p className="text-gray-500">Məlumatlarınızı yükləmək mümkün olmadı. Serverlə əlaqə yoxdur və ya icazəniz ləğv edilib.</p>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/admin/signin";
          }}
          className="rounded-lg bg-brand-500 px-5 py-2.5 text-white hover:bg-brand-600 mt-2"
        >
          Yenidən daxil ol
        </button>
      </div>
    );
  }

  if (user && user.userType === "customer") {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800">Sizin bu səhifəyə giriş icazəniz yoxdur</h1>
        <p className="text-gray-500">Bu sistem yalnız İdarəçilər (Admin/İşçi) üçündür.</p>
        <p className="text-gray-400 font-mono">Daxil olunan hesab: {user?.email} (Tip: {user?.userType})</p>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/admin/signin";
          }}
          className="rounded-lg bg-brand-500 px-5 py-2.5 text-white hover:bg-brand-600 mt-2"
        >
          Çıxış et
        </button>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
