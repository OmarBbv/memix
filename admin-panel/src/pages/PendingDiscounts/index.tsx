import React, { useState, useMemo } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { usePendingDiscounts, useApproveBulkDiscounts, useTriggerAutoDiscount } from "../../hooks/useAutoDiscounts";
import { PendingDiscount } from "../../types/pending-discount";
import toast from "react-hot-toast";

const PendingDiscounts: React.FC = () => {
  const { data: pendingDiscounts, isLoading } = usePendingDiscounts();
  const approveMutation = useApproveBulkDiscounts();
  const triggerMutation = useTriggerAutoDiscount();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Brend üzrə qruplaşdır
  const groupedByBrand = useMemo(() => {
    if (!pendingDiscounts) return {};
    
    const groups: Record<string, PendingDiscount[]> = {};
    for (const pd of pendingDiscounts) {
      const key = pd.brandName || "Brendsiz";
      if (!groups[key]) groups[key] = [];
      groups[key].push(pd);
    }
    return groups;
  }, [pendingDiscounts]);

  const toggleSelect = (productId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const selectBrand = (brandName: string) => {
    const items = groupedByBrand[brandName] || [];
    const allSelected = items.every((i) => selectedIds.has(i.productId));
    
    setSelectedIds((prev) => {
      const next = new Set(prev);
      items.forEach((i) => {
        if (allSelected) {
          next.delete(i.productId);
        } else {
          next.add(i.productId);
        }
      });
      return next;
    });
  };

  const selectAll = () => {
    if (!pendingDiscounts) return;
    const allSelected = pendingDiscounts.every((pd) => selectedIds.has(pd.productId));
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingDiscounts.map((pd) => pd.productId)));
    }
  };

  const handleApprove = () => {
    if (selectedIds.size === 0) {
      toast.error("Heç bir məhsul seçilməyib");
      return;
    }

    approveMutation.mutate(Array.from(selectedIds), {
      onSuccess: (result) => {
        toast.success(`${result.applied} məhsula endirim tətbiq edildi`);
        setSelectedIds(new Set());
      },
      onError: () => {
        toast.error("Xəta baş verdi");
      },
    });
  };

  const handleTrigger = () => {
    triggerMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Avtomatik endirim yoxlaması tamamlandı");
      },
      onError: () => {
        toast.error("Xəta baş verdi");
      },
    });
  };

  const getDaysLabel = (days: number) => {
    if (days >= 90) return "90+ gün";
    if (days >= 60) return "60+ gün";
    return `${days} gün`;
  };

  const getDaysBadgeColor = (days: number) => {
    if (days >= 90)
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    if (days >= 60)
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
  };

  return (
    <>
      <PageMeta
        title="Gözləyən Endirimlər | Memix Admin"
        description="Təsdiq gözləyən avtomatik endirimlərin idarə edilməsi"
      />
      <PageBreadcrumb pageTitle="Gözləyən Endirimlər" />

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Yeni (Outlet) məhsullar — 60 və 90 gün keçmiş, admin təsdiqi gözləyən endirimlər.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleTrigger}
              disabled={triggerMutation.isPending}
              className="text-sm"
            >
              {triggerMutation.isPending ? "Yoxlanılır..." : "🔄 Manual Yoxla"}
            </Button>
            {selectedIds.size > 0 && (
              <Button
                onClick={handleApprove}
                disabled={approveMutation.isPending}
                className="text-sm"
              >
                {approveMutation.isPending
                  ? "Tətbiq edilir..."
                  : `✅ Seçilmişləri Təsdiqlə (${selectedIds.size})`}
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/3 md:p-8">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
            </div>
          ) : !pendingDiscounts || pendingDiscounts.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Heç bir gözləyən endirim yoxdur.
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                Bütün yeni məhsullar hələ 60 günü tamamlamamışdır və ya artıq endirim tətbiq olunub.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Select all */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      pendingDiscounts.length > 0 &&
                      pendingDiscounts.every((pd) => selectedIds.has(pd.productId))
                    }
                    onChange={selectAll}
                    className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Hamısını seç ({pendingDiscounts.length} məhsul)
                  </span>
                </label>
              </div>

              {/* Brend qrupları */}
              {Object.entries(groupedByBrand).map(([brandName, items]) => (
                <div key={brandName} className="flex flex-col gap-3">
                  {/* Brend başlığı */}
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={items.every((i) => selectedIds.has(i.productId))}
                        onChange={() => selectBrand(brandName)}
                        className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                      />
                      <span className="text-base font-semibold text-gray-800 dark:text-white/90">
                        {brandName}
                      </span>
                    </label>
                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                      {items.length} məhsul
                    </span>
                  </div>

                  {/* Məhsul kartları */}
                  <div className="grid gap-3 ml-7">
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                          selectedIds.has(item.productId)
                            ? "border-brand-500 bg-brand-50 dark:bg-brand-900/10 dark:border-brand-500/50"
                            : "border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/30 hover:border-gray-300"
                        }`}
                        onClick={() => toggleSelect(item.productId)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedIds.has(item.productId)}
                          onChange={() => toggleSelect(item.productId)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-white/90 truncate">
                            {item.productName}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            ID: {item.productId}
                          </p>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${getDaysBadgeColor(
                            item.daysListed
                          )}`}
                        >
                          {getDaysLabel(item.daysListed)}
                        </span>

                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold text-red-500 line-through">
                            {item.currentPrice.toFixed(2)} ₼
                          </p>
                          <p className="text-sm font-bold text-green-600 dark:text-green-400">
                            {item.suggestedPrice.toFixed(2)} ₼
                            <span className="text-xs font-normal ml-1 text-gray-400">
                              (-{item.suggestedPercentage}%)
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Açıqlama */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-900/10">
          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
            ℹ️ Avtomatik Endirim Sistemi Necə İşləyir?
          </h4>
          <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
            <li>• <strong>İkinci əl</strong> məhsullar: 30/60/90 gün → 30%/50%/70% endirim — <strong>tam avtomatik</strong></li>
            <li>• <strong>Yeni (Outlet)</strong> məhsullar: 30 gün → 30% <strong>avtomatik</strong>, 60/90 gün → bu səhifədə təsdiqləmə gözləyir</li>
            <li>• Stoku bitmiş və ya manual endirimli məhsullara avtomatik endirim tətbiq olunmur</li>
            <li>• Sistem hər gün gecə saat 03:00-da avtomatik yoxlama aparır</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default PendingDiscounts;
