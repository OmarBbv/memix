import { useDashboardOverview } from "../../hooks/useAnalytics";

export default function TopSellingProducts() {
  const { data, isLoading } = useDashboardOverview();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6 h-[400px] animate-pulse"></div>
    );
  }

  const topProducts = data?.topProducts || [];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Ən Çox Satılanlar
        </h3>
      </div>

      <div className="space-y-5">
        {topProducts.length > 0 ? (
          topProducts.map((product) => (
            <div key={product.productId} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold dark:bg-gray-800">
                  {product.productName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {product.productName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {product.totalSold} ədəd satılıb
                  </p>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-800 dark:text-white/90">
                {Number(product.totalRevenue).toFixed(2)} AZN
              </p>
            </div>
          ))
        ) : (
          <p className="text-center py-10 text-gray-500 italic">Məlumat yoxdur</p>
        )}
      </div>
    </div>
  );
}
