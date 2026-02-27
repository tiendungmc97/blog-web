"use client";

import React, { useMemo } from "react";
import { Layout, Menu, type MenuProps } from "antd";
import { usePathname, useRouter } from "@/libs/i18n/navigation";
import { ROUTERS } from "@/constants/routers";
import { GiftOutlined, ExclamationCircleOutlined, NotificationOutlined, RetweetOutlined } from "@ant-design/icons";
import "@/styles/sidenav-submenu.css";
import { useTranslations } from "next-intl";

const { Sider } = Layout;

interface NotificationSideNavProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export function NotificationSideNav({ collapsed, onCollapse }: NotificationSideNavProps) {
  const t = useTranslations("Notifications");
  const router = useRouter();
  const pathname = usePathname();

  const notificationItems = [
    {
      key: "system",
      label: t("system"),
      icon: <NotificationOutlined />,
      href: ROUTERS.NOTIFICATION.SYSTEM,
    },
    {
      key: "promotion",
      label: t("promotions"),
      icon: <GiftOutlined />,
      href: ROUTERS.NOTIFICATION.PROMOTION,
    },
    {
      key: "transaction",
      label: t("transactions"),
      icon: <RetweetOutlined />,
      href: ROUTERS.NOTIFICATION.TRANSACTION,
    },
    {
      key: "account",
      label: t("accountAlerts"),
      icon: <ExclamationCircleOutlined />,
      href: ROUTERS.NOTIFICATION.ACCOUNT_ALERT,
    },
  ];

  const isActive = (href: string) => pathname === href;
  const go = (href: string) => router.push(href);

  // --- selected key ---
  const selectedKeys = useMemo((): string[] => {
    for (const item of notificationItems) {
      if (isActive(item.href)) return [item.key];
    }
    return [];
  }, [pathname]);

  const menuItems: MenuProps["items"] = useMemo(() => {
    return notificationItems.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: item.label,
      title: item.label,
      onClick: () => go(item.href),
    }));
  }, [go]);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      breakpoint="lg"
      collapsedWidth={80}
      width={240}
      theme="light"
      trigger={null}
      className="!hidden !bg-white !pt-8 md:!block"
    >
      <Menu
        mode="inline"
        items={menuItems}
        selectedKeys={selectedKeys}
        className="main-sidenav-menu !h-full !border-r-0 !bg-white"
        theme="light"
      />
    </Sider>
  );
}
