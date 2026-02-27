import React, { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useUsers } from "../../hooks/useUsers";
import { useDebounce } from "../../hooks/useDebounce";
import UserTable from "./UserTable";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

export default function Users() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const limit = 10;

  const { data, isLoading } = useUsers(page, limit, debouncedSearch);

  const users = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset page on search
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <>
      <PageMeta
        title="İstifadəçilər | Memix Admin"
        description="Bütün istifadəçilərin siyahısı"
      />
      <PageBreadcrumb pageTitle="İstifadəçilər" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/3 xl:px-10 xl:py-12">
        <div className="flex w-full flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="w-full max-w-sm">
              <Input
                type="text"
                placeholder="İstifadəçi axtar (ad, email, id)..."
                value={search}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
            </div>
          ) : users && users.length > 0 ? (
            <>
              <UserTable users={users} />

              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-4">
                  <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={page === 1}>
                    Əvvəlki
                  </Button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Səhifə {page} / {totalPages}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleNextPage} disabled={page >= totalPages}>
                    Növbəti
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-500 dark:text-gray-400">Heç bir istifadəçi tapılmadı.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
