"use client";

import { ROUTERS } from "@/constants/routers";
import { useRouter } from "@/libs/i18n/navigation";
import { BellOutlined, PlusOutlined, WalletOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Image from "next/image";
import React from "react";

type Action = {
  key: "bell" | "wallet" | "profile";
  aria: string;
  variant: "circle" | "profile";
  icon: React.ReactNode;
  onClick: () => void;
};

interface HeaderActionsProps {
  onUserDropdownToggle?: () => void;
  onWalletDropdownToggle?: () => void;
  onNotificationDropdownToggle?: () => void;
  onUserDropdownEnter?: () => void;
  onUserDropdownLeave?: () => void;
  onWalletDropdownEnter?: () => void;
  onWalletDropdownLeave?: () => void;
  onNotificationDropdownEnter?: () => void;
  onNotificationDropdownLeave?: () => void;
  userTriggerRef?: React.RefObject<HTMLButtonElement | null>;
  walletTriggerRef?: React.RefObject<HTMLButtonElement | null>;
  notificationTriggerRef?: React.RefObject<HTMLButtonElement | null>;
  name?: string;
  className?: string;
  unreadNotificationCount?: number;
}

export function HeaderActions({
  onUserDropdownToggle = () => {},
  onNotificationDropdownToggle = () => {},
  onUserDropdownEnter = () => {},
  onUserDropdownLeave = () => {},
  onWalletDropdownEnter = () => {},
  onWalletDropdownLeave = () => {},
  onNotificationDropdownEnter = () => {},
  onNotificationDropdownLeave = () => {},
  name = "",
  className = "",
  userTriggerRef,
  walletTriggerRef,
  notificationTriggerRef,
  unreadNotificationCount = 0,
}: HeaderActionsProps) {
  const router = useRouter();
  const actions: Action[] = [
    {
      key: "bell",
      aria: "Notifications",
      variant: "circle",
      icon: (
        <div className="relative">
          <BellOutlined className="!text-[26px]" />
          {unreadNotificationCount > 0 && (
            <span className="bg-primary absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[11px] text-white">
              {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
            </span>
          )}
        </div>
      ),
      onClick: onNotificationDropdownToggle,
    },
    {
      key: "wallet",
      aria: "Wallet",
      variant: "circle",
      icon: <WalletOutlined className="!text-[26px]" />,
      onClick: () => {},
    },
    {
      key: "profile",
      aria: `Profile${name ? ` (${name})` : ""}`,
      variant: "profile",
      icon: (
        <Image
          src="/images/demo/image.png"
          alt={name || "User Avatar"}
          width={24}
          height={24}
          className="h-8 w-8 rounded-full object-cover"
        />
      ),
      onClick: onUserDropdownToggle,
    },
  ];

  const circleBtn =
    "flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-50 cursor-pointer";

  return (
    <div className={`flex items-center justify-end gap-2 md:gap-3 ${className}`}>
      <Button
        onClick={() => router.push(ROUTERS.WALLET.DEPOSIT_FIAT)}
        icon={<PlusOutlined />}
        color="primary"
        type="primary"
      >
        <span className="hidden md:inline">Nạp ngay</span>
      </Button>

      {actions.map((a) =>
        a.variant === "circle" ? (
          <button
            key={a.key}
            type="button"
            aria-label={a.aria}
            onClick={a.onClick}
            onMouseEnter={() => {
              if (a.key === "wallet") onWalletDropdownEnter();
              if (a.key === "bell") onNotificationDropdownEnter();
            }}
            onMouseLeave={() => {
              if (a.key === "wallet") onWalletDropdownLeave();
              if (a.key === "bell") onNotificationDropdownLeave();
            }}
            className={circleBtn}
            ref={a.key === "bell" ? notificationTriggerRef : undefined}
          >
            {a.icon}
          </button>
        ) : (
          <button
            key={a.key}
            type="button"
            aria-label={a.aria}
            onClick={a.onClick}
            onMouseEnter={() => {
              if (a.key === "profile") onUserDropdownEnter();
            }}
            onMouseLeave={() => {
              if (a.key === "profile") onUserDropdownLeave();
            }}
            className="group flex items-center"
            ref={a.key === "profile" ? userTriggerRef : a.key === "wallet" ? walletTriggerRef : undefined}
          >
            <span className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-gray-50">
              {a.icon}
            </span>
            {/* no visible name next to avatar; accessible only */}
            <span className="sr-only">{name}</span>
          </button>
        ),
      )}
    </div>
  );
}
