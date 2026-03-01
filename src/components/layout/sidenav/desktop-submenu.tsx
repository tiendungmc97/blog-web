"use client";

import React from "react";

export type MenuItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

interface DesktopSubmenuProps {
  items: MenuItem[];
  isActive: (href: string) => boolean;
  go: (href: string) => void;
}

function SubItemRow({
  icon,
  label,
  onClick,
  disabled,
  active,
}: {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      role="menuitem"
      className={[
        "flex w-full items-center gap-3 px-3 py-2.5 text-sm transition-colors",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        active ? "text-textBase bg-white" : `bg-white ${disabled ? "text-border" : "text-textSecondary"}`,
      ].join(" ")}
    >
      <span
        className={`inline-flex h-6 w-6 items-center justify-center ${active ? "text-primary" : "text-textSecondary"}`}
      >
        {icon}
      </span>
      <span className={disabled ? "font-medium" : active ? "font-bold" : "font-medium hover:font-bold"}>{label}</span>
    </button>
  );
}

export function DesktopSubmenu({ items, isActive, go }: DesktopSubmenuProps) {
  return (
    <div
      role="menu"
      className="invisible absolute top-0 left-full z-50 hidden w-48 bg-white py-2 opacity-0 shadow-lg transition duration-150 group-hover:visible group-hover:opacity-100 md:block"
    >
      {items.map((item) => (
        <SubItemRow
          key={item.key}
          icon={item.icon}
          label={item.label}
          disabled={item.disabled}
          active={isActive(item.key)}
          onClick={item.disabled ? undefined : item.onClick ? item.onClick : () => go(item.key)}
        />
      ))}
    </div>
  );
}
