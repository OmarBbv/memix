import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Xəta baş verdi",
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 w-full h-[50vh] text-center space-y-4">
      <div className="h-40 w-40">
        <DotLottieReact
          src="https://lottie.host/1b5e0825-4b07-4226-9d32-261546979201/2O6wG5T1uR.lottie"
          loop
          autoplay
        />
      </div>
      <h3 className="text-xl font-semibold text-zinc-900">{message}</h3>
      <p className="text-zinc-500 max-w-md">
        Məlumatları yükləyərkən gözlənilməz bir xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="mt-4 gap-2"
        >
          <RefreshCcw className="w-4 h-4" />
          Yenidən cəhd et
        </Button>
      )}
    </div>
  );
};
