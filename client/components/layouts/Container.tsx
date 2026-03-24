'use client'

import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/redux/hooks";
import { useScrollToTop } from "@/hooks/useScrollToTop";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ContainerWapper = ({ children, className }: ContainerProps) => {
  const isOpen = useAppSelector((state) => state.topBar.isOpen);
  useScrollToTop();

  return (
    <div className={cn(
      className,
      "pt-[80px] md:pt-[115px]",
      isOpen ? "pb-[145px] md:pb-20" : "pb-[70px] md:pb-0"
    )}>
      {children}
    </div>
  );
}
