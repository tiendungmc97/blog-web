import { Spin } from "antd";
import { useEffect, useState } from "react";

interface ProtectedImageProps {
  imageUrl: string;
  alt?: string;
  className?: string;
}

export function ProtectedImage({ imageUrl, alt = "", className = "" }: ProtectedImageProps) {
  const [src, setSrc] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const accessToken = "your_access_token_here"; // Replace with actual token retrieval logic
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");
    fetch(imageUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load image");
        return res.blob();
      })
      .then((blob) => {
        if (isMounted) {
          setSrc(URL.createObjectURL(blob));
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
      if (src) URL.revokeObjectURL(src);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, accessToken]);

  if (loading) return <Spin />;
  if (error) return <></>;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
    />
  );
}
