import React from "react";
import { Modal } from "./modal";
import Button from "./button/Button";
import { TrashBinIcon } from "../../icons";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Təsdiqlə",
  cancelLabel = "Ləğv et",
  isDanger = true,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[400px] p-6 text-center"
      showCloseButton={false}
    >
      <div className="flex flex-col items-center">
        {isDanger && (
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10">
            <TrashBinIcon className="h-8 w-8" />
          </div>
        )}

        <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-white/90">
          {title}
        </h3>
        <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>

        <div className="flex w-full gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 ${isDanger
                ? "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                : ""
              }`}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
