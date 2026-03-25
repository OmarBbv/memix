import React, { useState } from 'react';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import { useCampaigns, useApplyBulkDiscount, useRemoveBulkDiscount } from '../../../hooks/useCampaigns';
import { useCategories } from '../../../hooks/useCategories';
import toast from 'react-hot-toast';
import ComponentCard from '../../../components/common/ComponentCard';
import Button from '../../../components/ui/button/Button';
import Label from '../../../components/form/Label';
import SearchableSelect from '../../../components/ui/select/SearchableSelect';
import Input from '../../../components/form/input/InputField';

export default function Discounts() {
  const { data: campaigns = [], isLoading: isCampaignsLoading } = useCampaigns();
  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();

  const applyDiscountMutation = useApplyBulkDiscount();
  const removeDiscountMutation = useRemoveBulkDiscount();

  const [selectedCampaignId, setSelectedCampaignId] = useState<number | ''>('');
  const [targetType, setTargetType] = useState<'category' | 'brand'>('category');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number | ''>('');

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaignId || !selectedCategoryId || !discountValue) {
      toast.error('Zəhmət olmasa bütün sahələri doldurun');
      return;
    }

    applyDiscountMutation.mutate(
      {
        id: Number(selectedCampaignId),
        data: {
          targetType,
          targetId: Number(selectedCategoryId),
          discountType,
          discountValue: Number(discountValue),
        },
      },
      {
        onSuccess: (response) => {
          toast.success(response.message + ` (${response.count} məhsula tətbiq edildi)`);
        },
        onError: (error: unknown) => {
          const err = error as { response?: { data?: { message?: string } } };
          toast.error(err.response?.data?.message || 'Endirim tətbiq edilərkən xəta baş verdi');
        },
      }
    );
  };

  const handleRemoveDiscount = (campaignId: number) => {
    if (!window.confirm('Bu kampaniyanın bütün toplu endirimlərini ləğv etmək istədiyinizə əminsiniz?')) return;

    removeDiscountMutation.mutate(campaignId, {
      onSuccess: (response) => {
        toast.success(response.message + ` (${response.count} endirim silindi)`);
      },
      onError: (error: unknown) => {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || 'Endirimlər ləğv edilərkən xəta baş verdi');
      },
    });
  };

  if (isCampaignsLoading || isCategoriesLoading) return <div>Yüklənir...</div>;

  return (
    <>
      <PageBreadcrumb pageTitle="Toplu Endirimlər" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sol Tərəf - Forma */}
        <ComponentCard title="Yeni Toplu Endirim Tətbiq Et">
          <form onSubmit={handleApplyDiscount} className="space-y-6 flex flex-col pt-4">
            <div>
              <Label>Kampaniya</Label>
              <SearchableSelect
                options={[
                  ...campaigns.map((c) => ({ value: c.id.toString(), label: c.title })),
                ]}
                value={selectedCampaignId.toString()}
                onChange={(val: string | number | null) => setSelectedCampaignId(val ? Number(val) : '')}
                placeholder="Kampaniya Seçin"
              />
            </div>

            <div>
              <Label>Hədəf Növü</Label>
              <SearchableSelect
                options={[
                  { value: 'category', label: 'Kateqoriya' },
                ]}
                value={targetType}
                onChange={(val: string | number | null) => val && setTargetType(val as 'category' | 'brand')}
                placeholder="Hədəf Növünü Seçin"
              />
            </div>

            {targetType === 'category' && (
              <div>
                <Label>Kateqoriya</Label>
                <SearchableSelect
                  options={[
                    ...categories.map((c) => ({ value: c.id.toString(), label: c.name })),
                  ]}
                  value={selectedCategoryId.toString()}
                  onChange={(val: string | number | null) => setSelectedCategoryId(val ? Number(val) : '')}
                  placeholder="Kateqoriya Seçin"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Endirim Növü</Label>
                <SearchableSelect
                  options={[
                    { value: 'percentage', label: 'Faiz (%)' },
                    { value: 'fixed', label: 'Məbləğ' },
                  ]}
                  value={discountType}
                  onChange={(val: string | number | null) => val && setDiscountType(val as 'percentage' | 'fixed')}
                  placeholder="Endirim Növünü Seçin"
                />
              </div>
              <div>
                <Label>Dəyər</Label>
                <Input
                  type="number"
                  placeholder="Məs: 20"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value ? Number(e.target.value) : '')}
                  className="w-full"
                />
              </div>
            </div>

            <Button size="sm" type="submit" disabled={applyDiscountMutation.isPending}>
              {applyDiscountMutation.isPending ? 'Tətbiq edilir...' : 'Tətbiq Et'}
            </Button>
          </form>
        </ComponentCard>

        {/* Sağ Tərəf - Mövcud Kampaniyaların endirimlərini silmək */}
        <ComponentCard title="Endirimləri Ləğv Et">
          <div className="space-y-4 pt-4">
            <p className="text-sm text-gray-500 mb-4">Aşağıdakı düymələrdən istifadə edərək kampaniyaya aid bağlanmış endirimləri silib məhsulların qiymətlərini əvvəlki vəziyyətinə qaytara bilərsiniz.</p>
            {campaigns.length === 0 && <p className="text-sm">Kampaniya tapılmadı</p>}
            {campaigns.map((c) => (
              <div key={c.id} className="flex justify-between items-center bg-gray-50 border border-gray-100 p-3 rounded-md dark:bg-gray-800 dark:border-gray-700">
                <span className="font-medium text-gray-800 dark:text-gray-100">{c.title}</span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={removeDiscountMutation.isPending}
                  onClick={() => handleRemoveDiscount(c.id)}
                  className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  Endirimləri Ləğv Et
                </Button>
              </div>
            ))}
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
