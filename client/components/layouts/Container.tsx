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

  return <div className={cn(className, isOpen ? "md:pt-[130px]" : "md:pt-[120px]")}>{children}</div>
}
