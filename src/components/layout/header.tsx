"use client";

import { ROUTERS } from "@/constants/routers";
import { useRouter } from "@/libs/i18n/navigation";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import React from "react";
import { HeaderActions } from "./header/header-actions";
import { LogoSection } from "./header/logo-section";
import { MobileMenu } from "./header/mobile-menu";
import { NotificationDropdown } from "./header/notification-dropdown";
import { PairDropdown } from "./header/pair-dropdown";
import { WalletDropdown } from "./header/wallet-dropdown";
import { useMutationLogout } from "@/services/auth/hooks";
import { useNotifications } from "@/app/[locale]/(user)/notifications/_hooks/use-notifications";
import { useQueryUserProfile } from "@/services/users/hooks";

export default function Header() {
  const router = useRouter();
  const [isPairSelectorOpen, setIsPairSelectorOpen] = React.useState(false);
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = React.useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const userDropdownTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const walletDropdownTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const notificationDropdownTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const pairDropdownTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const { mutate: logout } = useMutationLogout();
  const { data: userDataRes } = useQueryUserProfile();
  const userInfo = userDataRes?.data;
  // Notification data - same as dax-fsilver-web
  const { data: notificationsData, isLoading: isNotificationsLoading } = useNotifications();

  // Use totalNotiUnRead from API response, fallback to calculating from array
  const unreadNotificationCount =
    notificationsData?.totalNotiUnRead ?? notificationsData?.data?.filter((notif: any) => !notif.isRead).length ?? 0;

  const userTriggerRef = React.useRef<HTMLButtonElement>(null);
  const walletDropdownRef = React.useRef<HTMLDivElement>(null);
  const walletTriggerRef = React.useRef<HTMLButtonElement>(null);
  const notificationDropdownRef = React.useRef<HTMLDivElement>(null);
  const notificationTriggerRef = React.useRef<HTMLButtonElement>(null);
  const pairSelectorRef = React.useRef<HTMLDivElement>(null);
  const pairDropdownRef = React.useRef<HTMLDivElement>(null);
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);

  // Helper functions for hover with delay
  const handleUserDropdownEnter = () => {
    if (userDropdownTimeoutRef.current) {
      clearTimeout(userDropdownTimeoutRef.current);
      userDropdownTimeoutRef.current = null;
    }
  };

  const handleUserDropdownLeave = () => {
    userDropdownTimeoutRef.current = setTimeout(() => {}, 150);
  };

  const handleWalletDropdownEnter = () => {
    if (walletDropdownTimeoutRef.current) {
      clearTimeout(walletDropdownTimeoutRef.current);
      walletDropdownTimeoutRef.current = null;
    }
    setIsWalletDropdownOpen(true);
  };

  const handleWalletDropdownLeave = () => {
    walletDropdownTimeoutRef.current = setTimeout(() => {
      setIsWalletDropdownOpen(false);
    }, 150);
  };

  const handleNotificationDropdownEnter = () => {
    if (notificationDropdownTimeoutRef.current) {
      clearTimeout(notificationDropdownTimeoutRef.current);
      notificationDropdownTimeoutRef.current = null;
    }
    setIsNotificationDropdownOpen(true);
  };

  const handleNotificationDropdownLeave = () => {
    notificationDropdownTimeoutRef.current = setTimeout(() => {
      setIsNotificationDropdownOpen(false);
    }, 150);
  };

  const handlePairDropdownEnter = () => {
    if (pairDropdownTimeoutRef.current) {
      clearTimeout(pairDropdownTimeoutRef.current);
      pairDropdownTimeoutRef.current = null;
    }
    setIsPairSelectorOpen(true);
  };

  const handlePairDropdownLeave = () => {
    pairDropdownTimeoutRef.current = setTimeout(() => {
      setIsPairSelectorOpen(false);
    }, 150);
  };

  const handleLogout = () => {
    logout(undefined, { onSettled: () => router.push(ROUTERS.AUTH.LOGIN) });
  };

  // click outside to close dropdowns/menus
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const t = e.target as Node;

      if (
        walletDropdownRef.current &&
        !walletDropdownRef.current.contains(t) &&
        walletTriggerRef.current &&
        !walletTriggerRef.current.contains(t)
      ) {
        setIsWalletDropdownOpen(false);
      }
      if (
        pairSelectorRef.current &&
        !pairSelectorRef.current.contains(t) &&
        pairDropdownRef.current &&
        !pairDropdownRef.current.contains(t)
      ) {
        setIsPairSelectorOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(t)) {
        const burger = document.getElementById("header-burger-btn");
        if (!burger?.contains(t)) setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // auto-close burger on md+
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const matches = "matches" in e ? e.matches : (e as MediaQueryList).matches;
      if (matches) setIsMobileMenuOpen(false);
    };
    onChange(mq as unknown as MediaQueryList);
    mq.addEventListener?.("change", onChange as EventListener);
    return () => mq.removeEventListener?.("change", onChange as EventListener);
  }, []);

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      if (userDropdownTimeoutRef.current) clearTimeout(userDropdownTimeoutRef.current);
      if (walletDropdownTimeoutRef.current) clearTimeout(walletDropdownTimeoutRef.current);
      if (notificationDropdownTimeoutRef.current) clearTimeout(notificationDropdownTimeoutRef.current);
      if (pairDropdownTimeoutRef.current) clearTimeout(pairDropdownTimeoutRef.current);
    };
  }, []);

  return (
    <header className="w-full bg-white">
      <div className="flex h-14 w-full items-stretch md:h-16">
        {/* Left: Logo */}
        <LogoSection />

        {/* Center: market (md+) */}
        {/* <MarketSection
          isPairSelectorOpen={isPairSelectorOpen}
          onPairSelectorEnter={handlePairDropdownEnter}
          onPairSelectorLeave={handlePairDropdownLeave}
          pairSelectorRef={pairSelectorRef}
        /> */}

        {/* Right: Burger (mobile) + Actions (md+ with desktop dropdown) */}
        <div className="ml-auto flex items-center gap-2 px-2 md:gap-3 md:px-4">
          {/* Burger button (mobile only) */}
          <button
            id="header-burger-btn"
            className="flex h-8 w-8 items-center justify-center rounded-lg md:hidden"
            onClick={() => setIsMobileMenuOpen((s) => !s)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
          </button>

          {/* Actions hidden on mobile, visible on md+ */}
          <div className="hidden md:flex">
            <HeaderActions
              onUserDropdownToggle={() => {}}
              onWalletDropdownToggle={() => setIsWalletDropdownOpen((o) => !o)}
              onNotificationDropdownToggle={() => setIsNotificationDropdownOpen((o) => !o)}
              onUserDropdownEnter={handleUserDropdownEnter}
              onUserDropdownLeave={handleUserDropdownLeave}
              onWalletDropdownEnter={handleWalletDropdownEnter}
              onWalletDropdownLeave={handleWalletDropdownLeave}
              onNotificationDropdownEnter={handleNotificationDropdownEnter}
              onNotificationDropdownLeave={handleNotificationDropdownLeave}
              userTriggerRef={userTriggerRef}
              walletTriggerRef={walletTriggerRef}
              notificationTriggerRef={notificationTriggerRef}
              name={userInfo?.partnerName}
              unreadNotificationCount={unreadNotificationCount}
            />
          </div>
        </div>
      </div>

      {/* Desktop pair dropdown */}
      <PairDropdown
        isOpen={isPairSelectorOpen}
        onClose={() => setIsPairSelectorOpen(false)}
        onPairSelectorEnter={handlePairDropdownEnter}
        onPairSelectorLeave={handlePairDropdownLeave}
        pairDropdownRef={pairDropdownRef}
      />

      {/* Mobile Menu using MobileMenu component */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigate={(path: string) => router.push(path)}
        onLogout={handleLogout}
        mobileMenuRef={mobileMenuRef}
      />

      {/* Desktop wallet dropdown */}
      <WalletDropdown
        isOpen={isWalletDropdownOpen}
        onClose={() => setIsWalletDropdownOpen(false)}
        onWalletDropdownEnter={handleWalletDropdownEnter}
        onWalletDropdownLeave={handleWalletDropdownLeave}
        onNavigate={(path: string) => router.push(path)}
        walletDropdownRef={walletDropdownRef}
      />

      {/* Desktop notification dropdown */}
      <NotificationDropdown
        isOpen={isNotificationDropdownOpen}
        onClose={() => setIsNotificationDropdownOpen(false)}
        onNotificationDropdownEnter={handleNotificationDropdownEnter}
        onNotificationDropdownLeave={handleNotificationDropdownLeave}
        notificationDropdownRef={notificationDropdownRef}
        notifications={notificationsData?.data ? { data: notificationsData.data } : undefined}
        isLoading={isNotificationsLoading}
      />

      {/* Desktop user dropdown */}
      {/* <UserDropdown
        isOpen={isUserDropdownOpen}
        onClose={() => setIsUserDropdownOpen(false)}
        onUserDropdownEnter={handleUserDropdownEnter}
        onUserDropdownLeave={handleUserDropdownLeave}
        name={userInfo?.partnerName}
        email={userInfo?.email}
        userInfo={userInfo}
        onNavigate={(path: string) => router.push(path)}
        onLogout={handleLogout}
        userDropdownRef={userDropdownRef}
      /> */}
    </header>
  );
}
