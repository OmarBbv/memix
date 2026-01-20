import React from 'react';
import { cn } from '@/lib/utils';

interface CardWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const CardWrapper = ({ children, className }: CardWrapperProps) => {
  return (
    <div className={cn("mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
      {children}
    </div>
  );
};
