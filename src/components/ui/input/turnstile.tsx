"use client";

import { Typography } from "antd";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";

declare global {
  interface Window {
    turnstile: {
      render: (container: HTMLElement, opts: any) => string;
      reset: (widgetId?: string | HTMLElement) => void;
      remove: (widgetId?: string | HTMLElement) => void;
      getResponse: (widgetId?: string | HTMLElement) => string;
      execute: (id?: string | HTMLElement) => void;
    };
    turnstileLoading?: boolean;
  }
}

interface TurnstileFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact" | "invisible";
}

export interface TurnstileFieldRef {
  executeTurnstile: () => Promise<string | null>;
  resetTurnstile: () => void;
}

export const TurnstileField = forwardRef<TurnstileFieldRef, TurnstileFieldProps>(
  ({ name, label, required = false, className = "", theme = "light", size = "normal" }, ref) => {
    const { control } = useFormContext();
    const turnstileRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const [turnstileError, setTurnstileError] = useState<string | null>(null);

    const {
      field: { onChange },
      fieldState: { error },
    } = useController({
      name,
      control,
      rules: {
        required: required ? "Please complete the Cloudflare verification" : false,
      },
    });

    const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

    const hardReset = useCallback(() => {
      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.reset(widgetIdRef.current);
        } catch {}
      }
      onChange("");
      setTurnstileError(null);
    }, [onChange]);

    useImperativeHandle(ref, () => ({
      executeTurnstile: async () => {
        if (!window.turnstile || !widgetIdRef.current) return null;
        if (size !== "invisible") {
          console.warn("executeTurnstile chỉ dùng khi size='invisible'");
          return null;
        }
        hardReset();
        try {
          window.turnstile.execute(widgetIdRef.current);
        } catch (e) {
          console.error("Turnstile execute failed:", e);
        }
        return null;
      },
      resetTurnstile: hardReset,
    }));

    useEffect(() => {
      const loadTurnstile = () => {
        if (window.turnstile && turnstileRef.current && siteKey) {
          if (widgetIdRef.current) {
            window.turnstile.remove(widgetIdRef.current);
          }
          widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              onChange(token);
            },
            "error-callback": () => {
              console.error("Turnstile error occurred");
              setTurnstileError("Security verification failed. Please try again.");
              hardReset();
            },
            "expired-callback": () => {
              console.log("Turnstile token expired");
              setTurnstileError("Security verification expired. Please complete it again.");
              hardReset();
            },
            theme: theme,
            size,
          });
        }
      };

      if (!window.turnstile && !window.turnstileLoading) {
        window.turnstileLoading = true;
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          window.turnstileLoading = false;
          loadTurnstile();
        };
        script.onerror = () => {
          window.turnstileLoading = false;
          setTurnstileError(
            "Failed to load security verification. Please check your internet connection and refresh the page.",
          );
        };
        document.head.appendChild(script);
      } else if (window.turnstile) {
        loadTurnstile();
      }

      return () => {
        if (window.turnstile && widgetIdRef.current) {
          window.turnstile.remove(widgetIdRef.current);
        }
      };
    }, [siteKey, theme, onChange, size]);

    if (!siteKey) {
      console.error("Cloudflare Turnstile site key is not configured");
      return (
        <div className={className}>
          <Typography.Text type="danger">
            Security verification is temporarily unavailable. Please try again later.
          </Typography.Text>
        </div>
      );
    }

    return (
      <div className={className}>
        {label && (
          <Typography.Text
            strong
            className="mb-2 block"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </Typography.Text>
        )}

        {/* Cloudflare Turnstile will render here */}
        <div ref={turnstileRef} />

        {turnstileError && (
          <Typography.Text
            type="danger"
            className="mt-1 block text-sm"
          >
            {turnstileError}
          </Typography.Text>
        )}

        {error && (
          <Typography.Text
            type="danger"
            className="mt-1 block text-sm"
          >
            {error.message}
          </Typography.Text>
        )}
      </div>
    );
  },
);

TurnstileField.displayName = "TurnstileField";
