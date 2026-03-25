import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

interface LabelProps {
  htmlFor?: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
  optional?: boolean;
}

const Label: FC<LabelProps> = ({ htmlFor, children, className, required, optional }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        twMerge(
          "mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-400",
          className,
        ),
      )}
    >
      {children}
      {required && <span className="text-red-500">*</span>}
      {optional && (
        <span className="text-xs font-normal text-gray-400 dark:text-gray-500 ml-1">
          (opsional)
        </span>
      )}
    </label>
  );
};

export default Label;
