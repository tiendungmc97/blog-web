import { Spin } from "antd";
import type React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "default" | "large";
  text?: string;
  className?: string;
}

export function LoadingSpinner({ size = "large", text, className }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className ?? ""}`}>
      <Spin size={size} />
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );
}
