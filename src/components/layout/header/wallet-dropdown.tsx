"use client";

import React from "react";
import { PieChartOutlined, BankOutlined, DollarOutlined, HistoryOutlined } from "@ant-design/icons";
import { ROUTERS } from "@/constants/routers";

interface WalletDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletDropdownEnter: () => void;
  onWalletDropdownLeave: () => void;
  onNavigate: (path: string) => void;
  walletDropdownRef: React.RefObject<HTMLDivElement | null>;
}

function DropdownItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <div
      className="flex cursor-pointer items-center rounded-lg px-3 py-2 transition-colors hover:bg-gray-50"
      onClick={onClick}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function WalletDropdown({
  isOpen,
  onClose,
  onWalletDropdownEnter,
  onWalletDropdownLeave,
  onNavigate,
  walletDropdownRef,
}: WalletDropdownProps) {
  if (!isOpen) return null;

  return (
    <div
      className="border-border absolute top-16 right-0 z-50 hidden w-64 border bg-white shadow-lg md:block"
      ref={walletDropdownRef}
      onMouseEnter={onWalletDropdownEnter}
      onMouseLeave={onWalletDropdownLeave}
    >
      {/* Menu items */}
      <div className="p-2">
        <DropdownItem
          icon={<PieChartOutlined className="mr-3 text-xl" />}
          label="Tổng quan"
          onClick={() => {
            onClose();
            onNavigate(ROUTERS.PORTFOLIO.OVERVIEW);
          }}
        />
        <DropdownItem
          icon={<BankOutlined className="mr-3 text-xl" />}
          label="Tài sản thực"
          onClick={() => {
            onClose();
            onNavigate(ROUTERS.PORTFOLIO.ASSETS_SPOT);
          }}
        />
        <DropdownItem
          icon={<DollarOutlined className="mr-3 text-xl" />}
          label="Tài khoản"
          onClick={() => {
            onClose();
            onNavigate(ROUTERS.PORTFOLIO.ASSETS_FUNDING);
          }}
        />
        <DropdownItem
          icon={<HistoryOutlined className="mr-3 text-xl" />}
          label="Lịch sử giao dịch"
          onClick={() => {
            onClose();
            onNavigate(ROUTERS.HISTORY.INDEX);
          }}
        />
      </div>
    </div>
  );
}
