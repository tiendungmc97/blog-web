import type React from "react";
import { LoadingSpinner } from "./loading-spinner";

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  message?: string;
}

export function LoadingOverlay({ isLoading, children, className }: LoadingOverlayProps) {
  return (
    <div className={`relative ${className ?? ""}`}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/40 backdrop-blur-xs">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
