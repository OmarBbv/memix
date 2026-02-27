import { useState } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import { PlusIcon } from "../../../icons";
import { useCampaigns, useDeleteCampaign } from "../../../hooks/useCampaigns";
import CampaignTable from "./CampaignTable";
import { Campaign } from "../../../types/campaign";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import toast from "react-hot-toast";

const Campaigns: React.FC = () => {
  const { data: campaigns, isLoading } = useCampaigns();
  const deleteMutation = useDeleteCampaign();

  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<number | null>(null);

  const handleEdit = (campaign: Campaign) => {
    navigate(`/marketing/campaigns/edit/${campaign.id}`);
  };

  const handleCreate = () => {
    navigate("/marketing/campaigns/create");
  };

  const openDeleteDialog = (id: number) => {
    setCampaignToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (campaignToDelete) {
      deleteMutation.mutate(campaignToDelete, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          toast.success("Kampaniya uğurla silindi");
        }
      });
    }
  };

  return (
    <>
      <PageMeta title="Kampaniyalar | Memix Admin" description="Kampaniyaların idarə edilməsi" />
      <PageBreadcrumb pageTitle="Kampaniyalar" />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-end">
          <button onClick={handleCreate} className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-600 active:scale-95">
            <PlusIcon className="size-5" />
            <span>Yeni Kampaniya</span>
          </button>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/3 md:p-8">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
            </div>
          ) : campaigns && campaigns.length > 0 ? (
            <CampaignTable campaigns={campaigns} onEdit={handleEdit} onDelete={openDeleteDialog} />
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-500 dark:text-gray-400">Heç bir kampaniya tapılmadı.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Kampaniyanı Sil"
        description="Bu kampaniyanı silmək istədiyinizə əminsiniz?"
        confirmLabel="Sil"
        cancelLabel="Ləğv et"
        isDanger={true}
      />
    </>
  );
};

export default Campaigns;
