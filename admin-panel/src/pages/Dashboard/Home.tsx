import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import TopSellingProducts from "../../components/ecommerce/TopSellingProducts";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard | Memix Admin"
        description="Memix E-commerce Admin Dashboard"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-8">
          <EcommerceMetrics />

          <MonthlySalesChart />

          <RecentOrders />
        </div>

        <div className="col-span-12 xl:col-span-4">
          <TopSellingProducts />
        </div>
      </div>
    </>
  );
}
