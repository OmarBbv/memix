import React, { useState } from "react";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { useCreateBrand } from "../../hooks/useBrands";
import toast from "react-hot-toast";

interface QuickCreateBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (brandId: number) => void;
}

export default function QuickCreateBrandModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: QuickCreateBrandModalProps) {
  const [name, setName] = useState("");
  const { mutate: createBrand, isPending } = useCreateBrand();

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const brandData = {
      name: name.trim(),
      slug: generateSlug(name.trim()) || `brand-${Date.now()}`,
      isActive: true,
      showOnHome: true,
      order: 0,
    };

    createBrand(brandData, {
      onSuccess: (newBrand) => {
        toast.success(`Marka əlavə edildi: ${newBrand.name}`);
        setName("");
        onClose();
        if (onSuccess) onSuccess(newBrand.id);
      },
      onError: (error: any) => {
        const errorMsg = error.response?.data?.message || "Marka yaradıla bilmədi";
        toast.error(`Xəta: ${errorMsg}`);
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[400px] p-6">
      <div className="flex flex-col gap-5">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">
          Yeni Marka Əlavə Et
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="quick-brand-name" required>Marka Adı</Label>
            <Input 
              id="quick-brand-name"
              placeholder="Məsələn: Zara, Nike..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex items-center gap-3">
            <Button 
                className="flex-1" 
                type="submit" 
                disabled={isPending || !name.trim()}
            >
              {isPending ? "Yadda saxlanılır..." : "Yadda Saxla"}
            </Button>
            <Button 
                variant="outline" 
                type="button" 
                onClick={onClose}
            >
              Ləğv et
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
