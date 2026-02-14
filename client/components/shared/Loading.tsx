import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export const Loading = () => {
  return (
    <div className="flex w-full items-center justify-center p-10">
      <div className="h-40 w-40">
        <DotLottieReact
          src="https://lottie.host/8195580d-dceb-4c89-9207-625ba73cd0ce/h5NSidkEKn.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
};
