import { useBranchPerformance } from "../../hooks/useAnalytics";

interface BranchData {
  branchId: number;
  branchName: string;
  totalProducts: number;
  totalStock: number;
  address: string;
}

export default function BranchPerformance() {
  const { data, isLoading } = useBranchPerformance();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6 h-[300px] animate-pulse"></div>
    );
  }

  const branches: BranchData[] = data || [];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
        Filial Performansı
      </h3>
      <div className="space-y-6">
        {branches.length > 0 ? (
          branches.map((branch) => (
            <div key={branch.branchId} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-white/90">
                    {branch.branchName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {branch.address}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-brand-500">
                    {branch.totalStock} ədəd
                  </p>
                  <p className="text-[10px] text-gray-400">Ümumi Stok</p>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 dark:bg-gray-800">
                <div 
                  className="bg-brand-500 h-1.5 rounded-full" 
                  style={{ width: `${Math.min((branch.totalStock / 1000) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-gray-400">
                {branch.totalProducts} fərqli məhsul növü
              </p>
            </div>
          ))
        ) : (
          <p className="text-center py-10 text-gray-500 italic">Filial tapılmadı</p>
        )}
      </div>
    </div>
  );
}
