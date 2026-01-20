'use client'

import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/redux/hooks";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}


export const ContainerWapper = ({ children, className }: ContainerProps) => {
  const isOpen = useAppSelector((state) => state.topBar.isOpen);

  return <div className={cn(className, isOpen ? "md:pt-[190px]" : "md:pt-[150px]")}>{children}</div>
}
