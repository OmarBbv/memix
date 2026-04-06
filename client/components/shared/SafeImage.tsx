'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface SafeImageProps extends Omit<ImageProps, 'onLoad'> {
  containerClassName?: string;
  spinnerClassName?: string;
  showSpinner?: boolean;
}

export const SafeImage = ({
  src,
  alt,
  className,
  containerClassName,
  spinnerClassName,
  showSpinner = true,
  ...props
}: SafeImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={cn("relative w-full h-full overflow-hidden bg-zinc-50/50", containerClassName)}>
      {!isLoaded && !hasError && (
        <Skeleton className="absolute inset-0 w-full h-full transition-opacity duration-500" />
      )}

      {!isLoaded && !hasError && showSpinner && (
        <div className="absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-500">
          <Loader2 className={cn("w-6 h-6 text-zinc-300 animate-spin", spinnerClassName)} />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 text-zinc-400 text-[10px] font-bold uppercase p-2 text-center">
          Format Dəstəklənmir
        </div>
      )}

      <Image
        src={src || 'https://via.placeholder.com/800x800?text=No+Image'}
        alt={alt || 'Image'}
        className={cn(
          "transition-all duration-700 ease-in-out",
          isLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-[1.02] blur-xl",
          className
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        {...props}
      />
    </div>
  );
};
