import React, { useEffect, useState } from "react";

interface SvgIconProps {
  src: string; // Path to SVG file (e.g., "/icons/tick.svg")
  children?: React.ReactNode; // For inline SVG content
  color?: string;
  size?: number;
  className?: string;
  viewBox?: string;
}

export function SvgIcon({
  src,
  children,
  color = "currentColor",
  size = 24,
  className,
  viewBox = "0 0 24 24",
}: SvgIconProps) {
  const [svgContent, setSvgContent] = useState<string>("");
  const [svgViewBox, setSvgViewBox] = useState<string>(viewBox);

  useEffect(() => {
    if (src) {
      fetch(src)
        .then((response) => response.text())
        .then((svgText) => {
          // Parse the SVG to extract content and viewBox
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
          const svgElement = svgDoc.querySelector("svg");

          if (svgElement) {
            // Extract viewBox from the original SVG
            const originalViewBox = svgElement.getAttribute("viewBox");
            if (originalViewBox) {
              setSvgViewBox(originalViewBox);
            }

            // Get inner content and apply color
            const innerHTML = svgElement.innerHTML;
            const colorizedContent = innerHTML
              .replace(/stroke="[^"]*"/g, `stroke="${color}"`)
              .replace(/fill="(?!none)[^"]*"/g, `fill="${color}"`);

            setSvgContent(colorizedContent);
          }
        })
        .catch((error) => {
          console.error("Error loading SVG:", error);
        });
    }
  }, [src, color]);

  // If using src prop, render the fetched SVG content
  if (src) {
    return (
      <svg
        width={size}
        height={size}
        viewBox={svgViewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ color }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    );
  }

  // Otherwise, render children (inline SVG content)
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color }}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const childProps = child.props as any;
          // Clone the child element and add/override the stroke/fill with the color prop
          return React.cloneElement(child as React.ReactElement<any>, {
            stroke: childProps.stroke ? color : childProps.stroke,
            fill: childProps.fill === "none" ? "none" : childProps.fill || color,
          });
        }
        return child;
      })}
    </svg>
  );
}
