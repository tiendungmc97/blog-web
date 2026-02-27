"use client";

import { usePathname, useRouter } from "@/libs/i18n/navigation";
import "@/styles/sidenav-submenu.css";
import { Layout, Menu, type MenuProps } from "antd";
import { useEffect, useMemo, useState } from "react";
import { historySub, infoSub, items, parentRoute, portfolioSub } from "./navigation.constant";

const { Sider } = Layout;

interface AntSideNavProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export function AntSideNav({ collapsed, onCollapse }: AntSideNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) => pathname.startsWith(href);
  const go = (href: string) => router.push(href);

  // --- controlled openKeys ---
  const computedOpenFromPath = useMemo(() => {
    const keys: string[] = [];
    if (infoSub.some((s) => isActive(s.href))) keys.push("information");
    if (portfolioSub.some((s) => isActive(s.href))) keys.push("portfolio");
    return keys;
  }, [pathname]);

  const [openKeys, setOpenKeys] = useState<string[]>(computedOpenFromPath);
  useEffect(() => setOpenKeys(computedOpenFromPath), [computedOpenFromPath]);

  const toggleOpen = (key: string) =>
    setOpenKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  // --- selected key ---
  const selectedKeys = useMemo((): string[] => {
    for (const subItem of [...infoSub, ...portfolioSub, ...historySub]) {
      if (isActive(subItem.href)) return [subItem.href];
    }
    for (const item of items) {
      if (isActive(parentRoute[item.key])) return [item.key];
    }
    return [];
  }, [pathname]);

  const menuItems: MenuProps["items"] = useMemo(() => {
    return items.map((item) => {
      const Icon = item.Icon;

      if (item.key === "history") {
        return {
          key: item.key,
          icon: <Icon />,
          label: item.label,
          title: item.label,
          children: historySub.map((s) => ({
            key: s.href,
            label: s.label,
            title: s.label,
            onClick: () => go(s.href),
          })),
        };
      }

      if (item.key === "information") {
        return {
          key: item.key,
          icon: <Icon />,
          label: item.label,
          title: item.label,
          children: infoSub.map((s) => ({
            key: s.href,
            label: s.label,
            title: s.label,
            onClick: () => go(s.href),
          })),
        };
      }

      if (item.key === "portfolio") {
        // label có 2 vùng click: text = route, caret = toggle
        const parentKey = "portfolio";
        const Label = () => (
          <div className="flex items-center gap-2">
            <span
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // không mở submenu
                go(parentRoute[parentKey]); // route tới trang parent
              }}
              className="cursor-pointer select-none"
            >
              {item.label}
            </span>
            <button
              aria-label="Toggle submenu"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // không route
                toggleOpen(parentKey);
              }}
              className="ml-auto inline-flex items-center"
            ></button>
          </div>
        );

        return {
          key: parentKey,
          icon: <Icon />,
          label: <Label />, // custom label
          title: item.label,
          children: portfolioSub.map((s) => ({
            key: s.href,
            label: s.label,
            title: s.label,
            onClick: () => go(s.href),
          })),
        };
      }

      // item thường
      return {
        key: item.key,
        icon: <Icon />,
        label: item.label,
        title: item.label,
        onClick: () => go(parentRoute[item.key]),
      };
    });
  }, [go, openKeys]);

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
        openKeys={openKeys} // dùng controlled openKeys
        onOpenChange={setOpenKeys} // vẫn cho mở/đóng bằng cơ chế khác nếu cần
        className="main-sidenav-menu !h-full !border-r-0 !bg-white"
        theme="light"
        subMenuOpenDelay={0.1}
        subMenuCloseDelay={0.1}
      />
    </Sider>
  );
}
