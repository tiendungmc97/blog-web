"use client";

import React from "react";
import { Menu, type MenuProps } from "antd";
import { InfoCircleOutlined, SettingOutlined, LogoutOutlined, WalletOutlined } from "@ant-design/icons";
import { designTokens } from "@/utils/design-tokens";
import { items, parentRoute, infoSub, portfolioSub } from "../sidenav/navigation.constant";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  mobileMenuRef: React.RefObject<HTMLDivElement | null>;
}

/** Lightweight dropdown under the header (mobile only). */
export function MobileMenu({ isOpen, onClose, onNavigate, onLogout, mobileMenuRef }: MobileMenuProps) {
  if (!isOpen) return null;

  const handleGo = (path: string) => {
    onNavigate(path);
    onClose();
  };

  const isActive = (href: string) => {
    if (typeof window !== "undefined") {
      return window.location.pathname.startsWith(href);
    }
    return false;
  };

  // Create menu items for Ant Design Menu component
  const menuItems: MenuProps["items"] = [
    // Main navigation items
    ...items
      .filter((item) => item.key !== "information" && item.key !== "settings" && item.key !== "portfolio")
      .map((item) => ({
        key: item.key,
        icon: <item.Icon />,
        label: item.label,
        onClick: () => handleGo(parentRoute[item.key]),
      })),
    // Portfolio section
    {
      key: "portfolio",
      icon: <WalletOutlined />,
      label: "VÍ",
      children: portfolioSub.map((sub) => ({
        key: sub.href,
        label: sub.label,
        onClick: () => handleGo(sub.href),
      })),
    },
    // Information section
    {
      key: "information",
      icon: <InfoCircleOutlined />,
      label: "THÔNG TIN",
      children: infoSub.map((sub) => ({
        key: sub.href,
        label: sub.label,
        onClick: () => handleGo(sub.href),
      })),
    },
    // Settings
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
      onClick: () => handleGo("/settings"),
    },
  ];

  const selectedKeys = (() => {
    for (const subItem of [...infoSub, ...portfolioSub]) {
      if (isActive(subItem.href)) {
        return [subItem.href];
      }
    }
    for (const item of items) {
      if (isActive(parentRoute[item.key])) {
        return [item.key];
      }
    }
    if (isActive("/settings")) {
      return ["settings"];
    }
    return [];
  })();

  const openKeys = (() => {
    const keys: string[] = [];
    if (infoSub.some((s) => isActive(s.href))) keys.push("information");
    if (portfolioSub.some((s) => isActive(s.href))) keys.push("portfolio");
    return keys;
  })();

  return (
    <div
      ref={mobileMenuRef}
      className="border-borderLight absolute top-14 left-0 z-50 max-h-[80vh] w-full overflow-y-auto border-t bg-white shadow-md md:hidden"
    >
      {/* Main Menu */}
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        defaultOpenKeys={openKeys}
        items={menuItems}
        className="!border-none"
        theme="light"
      />

      {/* Logout Section */}
      <div className="border-t border-gray-200 p-2">
        <button
          className="flex w-full items-center rounded-lg px-3 py-2 transition-colors"
          onClick={() => {
            onClose();
            onLogout();
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = designTokens.colors.errorBg)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <LogoutOutlined className="!text-error mr-3 text-lg" />
          <span className="!text-error text-sm">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
