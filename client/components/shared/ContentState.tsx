import React from 'react';
import { Loading } from './Loading';
import { ErrorState } from './ErrorState';

interface ContentStateProps {
  isLoading: boolean;
  isError: boolean;
  children: React.ReactNode;
  errorMessage?: string;
  onRetry?: () => void;
}

export const ContentState: React.FC<ContentStateProps> = ({
  isLoading,
  isError,
  children,
  errorMessage = "Məlumatları yükləyərkən xəta baş verdi",
  onRetry
}) => {
  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <ErrorState
        message={errorMessage}
        onRetry={onRetry}
      />
    );
  }

  return <>{children}</>;
};
