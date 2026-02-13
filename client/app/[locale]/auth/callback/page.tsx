'use client';

import { useAuthCallback } from "@/hooks/useAuth";

export default function AuthCallbackPage() {
  const { isLoading } = useAuthCallback();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );
}
