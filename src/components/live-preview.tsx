"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * LivePreview component — add to your root layout.
 *
 * Listens for postMessage events from the Strapi admin panel and:
 *  - Refreshes the page when Strapi saves a content update (`strapiUpdate`)
 *  - Injects the Live Preview script sent by Strapi (`strapiScript`)
 *
 * Also posts `previewReady` so Strapi knows the frontend iframe is ready.
 */
export default function LivePreview() {
  const router = useRouter();

  useEffect(() => {
    // Derive the Strapi origin from the API URL (strip the trailing /api)
    const strapiOrigin = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/api\/?$/, "");

    const handleMessage = (message: MessageEvent) => {
      // Only accept messages from the Strapi admin origin
      if (strapiOrigin && message.origin !== strapiOrigin) return;

      const { type, payload } = (message.data ?? {}) as { type?: string; payload?: { script?: string } };

      if (type === "strapiUpdate") {
        router.refresh();
      } else if (type === "strapiScript") {
        const script = document.createElement("script");
        script.textContent = payload?.script ?? "";
        document.head.appendChild(script);
      }
    };

    window.addEventListener("message", handleMessage);

    // Let Strapi know the frontend is ready to receive the preview script
    window.parent?.postMessage({ type: "previewReady" }, "*");

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [router]);

  return null;
}
