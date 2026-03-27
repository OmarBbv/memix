import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import TopSellingProducts from "../../components/ecommerce/TopSellingProducts";
import PageMeta from "../../components/common/PageMeta";
import OrderStatusChart from "../../components/dashboard/OrderStatusChart";
import BranchPerformance from "../../components/dashboard/BranchPerformance";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard | Memix Admin"
        description="Memix E-commerce Admin Dashboard"
      />
      
      <div className="space-y-6">
        <EcommerceMetrics />

        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 xl:col-span-8">
            <MonthlySalesChart />
          </div>
          <div className="col-span-12 xl:col-span-4">
            <OrderStatusChart />
          </div>

          <div className="col-span-12 xl:col-span-8">
            <RecentOrders />
          </div>
          <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
            <BranchPerformance />
            <TopSellingProducts />
          </div>
        </div>
      </div>
    </>
  );
}

