"use client";

import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface PairDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onPairSelectorEnter: () => void;
  onPairSelectorLeave: () => void;
  pairDropdownRef: React.RefObject<HTMLDivElement | null>;
}

export function PairDropdown({ isOpen, onPairSelectorEnter, onPairSelectorLeave, pairDropdownRef }: PairDropdownProps) {
  if (!isOpen) return null;

  return (
    <div
      className="border-border absolute top-16 left-64 z-50 hidden w-[22rem] border bg-white shadow-lg md:block"
      ref={pairDropdownRef}
      onMouseEnter={onPairSelectorEnter}
      onMouseLeave={onPairSelectorLeave}
    >
      <div className="border-border border-b p-4">
        <div className="relative">
          <Input
            placeholder="Tìm kiếm"
            prefix={<SearchOutlined className="!text-textTertiary" />}
            className="!bg-bgLayout !border-border !text-textBase w-full rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="p-4">
        <div className="text-textSecondary mb-3 grid grid-cols-3 gap-4 text-xs font-medium uppercase">
          <div>Cặp giao dịch</div>
          <div className="text-center">Giá gần nhất</div>
          <div className="text-right">24H %</div>
        </div>
        <div className="space-y-2">
          <div className="grid cursor-pointer grid-cols-3 items-center gap-4 rounded py-2 transition-colors">
            <div className="text-textBase text-sm font-medium">XAG/VND</div>
            <div className="text-textBase text-center text-sm">87,888</div>
            <div className="text-error text-right text-sm">-1,33%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
