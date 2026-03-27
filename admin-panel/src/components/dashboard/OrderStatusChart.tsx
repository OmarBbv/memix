import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useDashboardOverview } from "../../hooks/useAnalytics";
import { OrderStatus } from "../../types/order";

export default function OrderStatusChart() {
  const { data, isLoading } = useDashboardOverview();

  const getStatusText = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING: return "Gözləyir";
      case OrderStatus.PREPARING: return "Hazırlanır";
      case OrderStatus.READY: return "Hazırdır";
      case OrderStatus.ON_WAY: return "Yoldadır";
      case OrderStatus.DELIVERED: return "Çatdırıldı";
      case OrderStatus.CANCELLED: return "Ləğv edildi";
      default: return status;
    }
  };

  const statusData = data?.revenue?.ordersByStatus || {};
  const labels = Object.keys(statusData).map(getStatusText);
  const series = Object.values(statusData) as number[];

  const options: ApexOptions = {
    colors: ["#FFB264", "#465FFF", "#12D18E", "#FF4C4C", "#9A9A9A", "#646FCD"],
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
    },
    labels: labels,
    legend: {
      show: true,
      position: "bottom",
      fontFamily: "Outfit",
    },
    plotOptions: {
      pie: {
        donut: {
            size: '75%',
            labels: {
                show: true,
                total: {
                    show: true,
                    label: 'Cəmi',
                    color: '#374151',
                    formatter: function (w) {
                        return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0)
                    }
                }
            }
        }
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6 h-[350px] animate-pulse">
         <div className="w-full h-full bg-gray-100 rounded-lg dark:bg-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
        Sifariş Statusları
      </h3>
      <div className="flex items-center justify-center">
        <Chart options={options} series={series} type="donut" width="100%" height={300} />
      </div>
    </div>
  );
}
